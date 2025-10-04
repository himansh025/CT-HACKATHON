const Event = require("../models/eventModel");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { sendNewEventEmail } = require("../utils/sendEmail");
const User = require("../models/userModel"); // Ensure User model is imported
const Booking = require("../models/bookingModel");

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
    const event = await Event.findById(req.params.id).populate(
      "organizer.organizer_Id",
      "name avatar email"
    );

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
    // Handle image uploads
    let imageUrls = [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path, "events");
        if (uploaded?.url) imageUrls.push(uploaded.url);
      }
    }

    // Parse event data
    let data = req.body;
    if (typeof req.body.eventData === "string") {
      data = JSON.parse(req.body.eventData);
    }

    let tickets = []; // <-- initialize the array

    // Ticket Logic (Good)
    if (data.generalPrice && parseFloat(data.generalPrice) > 0) {
      tickets.push({
        type: "General Admission",
        price: parseFloat(data.generalPrice),
        quantity: parseInt(data.generalQuantity) || 100,
        sold: 0
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "General admission ticket is required"
      });
    }

    if (data.vipPrice && parseFloat(data.vipPrice) > 0) {
      tickets.push({
        type: "VIP",
        price: parseFloat(data.vipPrice),
        quantity: parseInt(data.vipQuantity) || 50,
        sold: 0
      });
    }

    // Create event object matching schema
    const newEvent = {
      title: data.title,
      description: data.description,
      category: data.category,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      images: imageUrls.length > 0 ? imageUrls : ["default-event-image.jpg"],
      venue: {
        name: data.venueName,
        address: data.venueAddress || data.location,
        capacity: parseInt(data.venueCapacity) || 100,
        coordinates: {
          type: "Point",
          coordinates: [
            parseFloat(data.coordinates.lng),
            parseFloat(data.coordinates.lat)
          ]
        }
      },
      price: parseFloat(data.generalPrice) || 0,
      organizer: {
        organizer_Id: req.user.id || req.user._id,
        name: req.user.name,
        avatar: req.user.avatar || ""
      },
      tickets: tickets,
      rating: 0,
      attendees: 0,
      featured: data.featured || false
    };

    // Create event in database
    const event = await Event.create(newEvent);

    // Send notification email
    try {
      await sendNewEventEmail({
        email: req.user.email,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.startTime,
        eventVenue: event.venue.name,
        eventId: event._id
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event
    });

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to create event"
    });
  }
};


// ✅ PUT /events/:id
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    let data = req.body;

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
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to update this event",
        });
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
      venue: data.location || data.venue || event.venue,
      images: imageUrls,
      featured: data.featured ?? event.featured,
      isDraft: data.isDraft ?? event.isDraft,
      price: data.generalPrice ? parseFloat(data.generalPrice) : event.price,
    };

    // 3. Handle Ticket Updates (Preserve sold counts)
    const newTickets = [];
    const existingTickets = event.tickets || [];

    const getSoldCount = (type) =>
      existingTickets.find((t) => t.type === type)?.sold || 0;

    if (data.generalPrice && parseFloat(data.generalPrice) >= 0) {
      newTickets.push({
        type: "General Admission",
        price: parseFloat(data.generalPrice),
        quantity: parseInt(data.generalQuantity) || 0,
        sold: getSoldCount("General Admission"),
      });
    }

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

    res.json({
      success: true,
      message: "Event updated successfully",
      data: updated,
    });
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
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to delete this event",
        });
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

// 💡 FIX 1: Add the missing recommendation function
const getRecommendedEvents = async (req, res) => {
  // --- ADD THIS LOG ---
  console.log("🚀 Reached getRecommendedEvents controller function!");
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.interests || user.interests.length === 0) {
      // Fallback: return featured, upcoming events if no interests set
      const fallbackEvents = await Event.find({
        featured: true,
        date: { $gte: new Date() },
      })
        .limit(10)
        .sort({ date: 1 });
      return res.status(200).json(fallbackEvents);
    }

    const recommendedEvents = await Event.find({
      category: { $in: user.interests },
      date: { $gte: new Date() }, // Only upcoming events
    }).sort({ date: 1 });

    res.status(200).json(recommendedEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 💡 FIX 2: Ensure the new function is exported
module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getCategories,
  getRecommendedEvents,
};
