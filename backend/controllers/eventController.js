const Event = require("../models/eventModel");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { sendNewEventEmail } = require("../utils/sendEmail");
const User = require("../models/userModel"); // Ensure User model is imported
const Booking = require('../models/bookingModel'); // Needed for future features/checks

// Generate JWT (Assuming this is defined elsewhere or in userController, keeping minimal imports)
// Note: Keeping this file focused on CRUD operations.

// ✅ GET /events
const getEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      location,
      date,
      priceMin,
      priceMax,
      sortBy,
      featured,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (location) filter.venue = { $regex: location, $options: "i" };
    if (date) filter.date = date;
    if (featured) filter.featured = featured === "true";

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    const sortOptions = {
      date: { date: 1 },
      price: { price: 1 },
      rating: { rating: -1 },
      popular: { attendees: -1 },
    }[sortBy] || { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [events, totalItems] = await Promise.all([
      Event.find(filter).sort(sortOptions).skip(skip).limit(Number(limit)),
      Event.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          hasNext: page * limit < totalItems,
          hasPrev: page > 1,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET /events/:id
const getEventById = async (req, res) => {
  try {
    // Populate organizer details for the frontend EventDetail page
    const event = await Event.findById(req.params.id)
      .populate('organizer.organizer_Id', 'name avatar email'); 
      
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const createEvent = async (req, res) => {
  try {
    let imageUrls = [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path, "events");
        if (uploaded?.url) imageUrls.push(uploaded.url);
      }
    }

    let data = req.body;
    if (typeof req.body.eventData === "string") {
      data = JSON.parse(req.body.eventData);
    }

    const newEvent = {
      title: data.title,
      description: data.description,
      category: data.category,
      date: data.date,
      time: data.time,
      venue: data.location || data.venue,
      images: imageUrls,
      price: parseFloat(data.generalPrice) || 0,
      organizer: {
        organizer_Id: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar || "",
      },
      tickets: [],
      featured: data.featured || false,
      attendees: data.attendees || 0,
      rating: 0,
      isDraft: data.isDraft || false, // Assuming a draft flag might be used
    };

    if (data.generalPrice && parseFloat(data.generalPrice) > 0) {
      newEvent.tickets.push({
        type: "General Admission",
        price: parseFloat(data.generalPrice),
        quantity: parseInt(data.generalQuantity) || 100,
        sold: 0,
      });
    }

    if (data.vipPrice && parseFloat(data.vipPrice) > 0) {
      newEvent.tickets.push({
        type: "VIP",
        price: parseFloat(data.vipPrice),
        quantity: parseInt(data.vipQuantity) || 50,
        sold: 0,
      });
    }

    const event = await Event.create(newEvent);

    // Send New Event Email
    await sendNewEventEmail({
      email: req.user.email,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      eventId: event._id,
    });
    
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ PUT /events/:id (Updated to handle multi-step form update)
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    let data = req.body;

    // Parse eventData if it's sent as a JSON string (for multipart/form-data)
    if (typeof req.body.eventData === "string") {
      data = JSON.parse(req.body.eventData);
    }

    const event = await Event.findById(eventId);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
        
    // Authorization check
    if (event.organizer.organizer_Id.toString() !== req.user.id.toString()) {
        return res.status(403).json({ success: false, message: "Not authorized to update this event" });
    }

    // 1. Handle Image Updates
    let imageUrls = event.images;
    if (req.files?.length > 0) {
      imageUrls = [];
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path, "events");
        if (uploaded?.url) imageUrls.push(uploaded.url);
      }
    }
    
    // 2. Construct the update object
    const updateFields = {
      title: data.title || event.title,
      description: data.description || event.description,
      category: data.category || event.category,
      date: data.date || event.date,
      time: data.time || event.time,
      venue: data.location || data.venue || event.venue, // Frontend sends location or venue
      images: imageUrls,
      featured: data.featured ?? event.featured,
      isDraft: data.isDraft ?? event.isDraft,
      // Update basic price field for listing purposes
      price: data.generalPrice ? parseFloat(data.generalPrice) : event.price, 
    };

    // 3. Handle Ticket Updates (Preserve sold counts)
    const newTickets = [];
    const existingTickets = event.tickets || [];
    
    // Helper to get sold count
    const getSoldCount = (type) => existingTickets.find(t => t.type === type)?.sold || 0;

    // General Admission
    if (data.generalPrice && parseFloat(data.generalPrice) >= 0) {
      newTickets.push({
        type: "General Admission",
        price: parseFloat(data.generalPrice),
        quantity: parseInt(data.generalQuantity) || 0,
        sold: getSoldCount("General Admission"),
      });
    }

    // VIP Tickets
    if (data.vipPrice && parseFloat(data.vipPrice) >= 0) {
      newTickets.push({
        type: "VIP",
        price: parseFloat(data.vipPrice),
        quantity: parseInt(data.vipQuantity) || 0,
        sold: getSoldCount("VIP"),
      });
    }
    
    updateFields.tickets = newTickets;

    const updated = await Event.findByIdAndUpdate(
      eventId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: "Event updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ DELETE /events/:id
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    // Authorization check: only organizer can delete
    if (event.organizer.organizer_Id.toString() !== req.user.id.toString()) {
        return res.status(403).json({ success: false, message: "Not authorized to delete this event" });
    }
    
    await Event.deleteOne({ _id: event._id });

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET /events/categories
const getCategories = async (_, res) => {
  try {
    const categories = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: categories.map((c) => ({
        name: c._id,
        count: c.count,
        icon: "tag", // placeholder
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getCategories,
};
