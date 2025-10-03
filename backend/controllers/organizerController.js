const Event = require("../models/eventModel.js");
const Booking = require("../models/bookingModel.js");

// Helper functions for date formatting (built-in JS)
const formatDate = (date) => date ? new Date(date).toISOString().slice(0, 10) : 'N/A';
const formatDateTime = (date) => date ? new Date(date).toISOString().replace('T', ' ').slice(0, 16) : 'N/A';


// Get organizer dashboard stats and recent events list
const getDashboard = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // 1. Fetch all events by this organizer
    const events = await Event.find({ "organizer.organizer_Id": organizerId });

    // 2. Fetch all bookings (including created/pending)
    const allBookings = await Booking.find({
      eventId: { $in: events.map((e) => e._id) },
    });

    const confirmedBookings = allBookings.filter(b => b.status === "confirmed");
    const ticketsBooked = allBookings.filter(b => b.status !== "cancelled");


    // --- Stats calculation ---
    const totalEvents = events.length;
    
    // Calculate total revenue ONLY from CONFIRMED bookings
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toFixed(2);
    
    // Calculate total tickets SOLD (using all non-cancelled bookings as requested)
    const ticketsSold = ticketsBooked.reduce((sum, b) => sum + b.tickets.reduce((acc, t) => acc + t.quantity, 0), 0);
    
    // Calculate average rating only from events that have been rated
    const ratedEvents = events.filter(e => e.rating > 0);
    const avgRating =
      ratedEvents.length > 0
        ? (ratedEvents.reduce((sum, e) => sum + (e.rating || 0), 0) / ratedEvents.length).toFixed(1)
        : 0;

    // --- Recent events data enrichment ---
    const recentEvents = events
      .map(event => {
        // Calculate total available tickets by summing up quantities of all ticket types
        const totalTickets = event.tickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
        // Calculate total tickets sold (using the 'sold' field in the ticket subdocuments)
        const ticketsSoldCount = event.tickets.reduce((sum, t) => sum + (t.sold || 0), 0);
        
        // Calculate event-specific revenue from confirmed bookings
        const eventRevenue = confirmedBookings
          .filter(b => b.eventId.equals(event._id))
          .reduce((sum, b) => sum + b.totalAmount, 0)
          .toFixed(2);

        return {
          _id: event._id,
          title: event.title,
          date: event.date,
          time: event.time,
          images: event.images,
          status: event.status || "Published", 
          totalTickets,
          ticketsSold: ticketsSoldCount,
          revenue: eventRevenue,
          rating: event.rating,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
      .slice(0, 10); // Show top 10 recent events for dashboard list

    // --- Recent bookings (for activity feed) ---
    const recentBookings = allBookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        stats: { totalEvents, totalRevenue, ticketsSold, avgRating },
        recentEvents,
        recentBookings,
      },
    });
  } catch (err) {
    console.error("Error in getDashboard:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all organizer events with enrichment (Used for the 'Events' tab list)
const getOrganizerEvents = async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const organizerId = req.user.id;
    const filter = { "organizer.organizer_Id": organizerId };

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(filter).skip(skip).limit(Number(limit)),
      Event.countDocuments(filter),
    ]);

    // Fetch ALL bookings for enrichment
    const allBookings = await Booking.find({
        eventId: { $in: events.map((e) => e._id) },
    });
    
    const confirmedBookings = allBookings.filter(b => b.status === "confirmed");

    // Enrich events with calculated metrics
    const enrichedEvents = events.map(event => {
        const totalTickets = event.tickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
        // We use all non-cancelled bookings for ticketsSold, reflecting total demand
        const ticketsSoldCount = allBookings.filter(b => b.eventId.equals(event._id) && b.status !== 'cancelled').reduce((sum, b) => sum + b.tickets.reduce((acc, t) => acc + t.quantity, 0), 0);
        
        const eventRevenue = confirmedBookings
          .filter(b => b.eventId.equals(event._id))
          .reduce((sum, b) => sum + b.totalAmount, 0)
          .toFixed(2);

        return {
          _id: event._id,
          title: event.title,
          date: event.date,
          time: event.time,
          images: event.images,
          status: event.status || "Published", 
          totalTickets,
          ticketsSold: ticketsSoldCount,
          revenue: eventRevenue,
          rating: event.rating,
        };
    });


    res.json({
      success: true,
      data: {
        events: enrichedEvents,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      },
    });
  } catch (err) {
    console.error("Error in getOrganizerEvents:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// NEW FUNCTION: Export data function (Fetches and formats tabular data)
const exportBookingData = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // 1. Fetch all events for this organizer
    const events = await Event.find({ "organizer.organizer_Id": organizerId });
    const eventIds = events.map(e => e._id);
    const eventMap = events.reduce((map, e) => {
      map[e._id.toString()] = e;
      return map;
    }, {});

    // 2. Fetch all bookings
    const bookings = await Booking.find({
      eventId: { $in: eventIds },
    }).sort({ createdAt: 1 });

    const reportData = [];
    let ticketCounter = 1;

    // 3. Flatten and enrich the data for tabular export (One row per physical ticket)
    for (const booking of bookings) {
      const event = eventMap[booking.eventId.toString()];
      const attendee = booking.attendeeInfo;

      for (const bookedTicket of booking.tickets) {
        for (let i = 0; i < bookedTicket.quantity; i++) {
            reportData.push({
                "TICKET_SERIAL_ID": `T-${booking.bookingId.slice(3)}-${ticketCounter++}`,
                "BOOKING_ID": booking.bookingId,
                "EVENT_NAME": event ? event.title : 'N/A',
                "EVENT_DATE": formatDate(event.date),
                "TICKET_TYPE": bookedTicket.type,
                "PRICE_PAID": bookedTicket.price,
                "ATTENDEE_NAME": attendee.name,
                "ATTENDEE_EMAIL": attendee.email,
                "ATTENDEE_PHONE": attendee.phone,
                "PAYMENT_STATUS": booking.status.toUpperCase(),
                "BOOKING_DATE": formatDateTime(booking.createdAt),
            });
        }
      }
    }

    res.json({
      success: true,
      data: reportData,
    });
  } catch (err) {
    console.error("Error in exportBookingData:", err);
    res.status(500).json({ success: false, message: "Server error during export" });
  }
};

// Optionally, get recent bookings for organizer
const getOrganizerBookings = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const events = await Event.find({ "organizer.organizer_Id": organizerId });

    const bookings = await Booking.find({
      eventId: { $in: events.map((e) => e._id) },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        bookings,
      },
    });
  } catch (err) {
    console.error("Error in getOrganizerBookings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getDashboard,
  getOrganizerEvents,
  getOrganizerBookings,
  exportBookingData, // Export the new function
};
