// controllers/qrController.js
const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");

exports.verifyQR = async (req, res) => {
  try {
    const { bookingId } = req.body; // scanned bookingId from QR
    const organizerId = req.user.id; // logged-in organizer

    const booking = await Booking.findOne({ bookingId }).populate("eventId");
    if (!booking) return res.status(404).json({ success: false, message: "Invalid QR code" });

    // ✅ Ensure booking belongs to this organizer’s event
    if (String(booking.eventId.organizerId) !== organizerId) {
      return res.status(403).json({ success: false, message: "Unauthorized QR scan" });
    }

    if (booking.checkedIn) {
      return res.json({ success: false, message: "Already checked in" });
    }

    booking.checkedIn = true;
    await booking.save();

    res.json({
      success: true,
      message: "Check-in successful",
      booking: {
        bookingId: booking.bookingId,
        userId: booking.userId,
        event: booking.eventId.title,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
