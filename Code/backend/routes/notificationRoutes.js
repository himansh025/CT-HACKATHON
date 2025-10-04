// Event-App/backend/routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const Event = require("../models/eventModel"); // adjust path
const Booking = require("../models/bookingModel"); // adjust path
const { protect } = require("../middlewares/authMiddleware"); // if auth required

// GET /api/notifications
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch events created in the last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const newEvents = await Event.find({ createdAt: { $gte: lastWeek } })
      .sort({ createdAt: -1 })
      .limit(10);

    // Fetch upcoming bookings in next 2 days
    const now = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);

    const upcomingAlerts = await Booking.find({
      user: userId,
      eventDate: { $gte: now, $lte: twoDaysLater },
    })
      .populate("eventId", "title date time")
      .sort({ eventDate: 1 });

    res.json({
      newEvents,
      upcomingAlerts: upcomingAlerts.map((b) => ({
        eventId: b.eventId._id,
        eventTitle: b.eventId.title,
        eventDate: b.eventId.date,
        time: b.eventId.time,
      })),
    });
  } catch (error) {
    console.error("❌ Backend error fetching notifications:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
