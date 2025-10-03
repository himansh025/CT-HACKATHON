// controllers/attendanceController.js
const jwt = require("jsonwebtoken");
const Booking = require("../models/bookingModel");

const verifyAttendance = async (req, res) => {
  try {
    const { qrToken } = req.body;

    // Verify token
    const decoded = jwt.verify(qrToken, process.env.JWT_SECRET);

    const booking = await Booking.findById(decoded.bookingId).populate("userId eventId");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.attended) {
      return res.json({ success: false, message: "Already checked in" });
    }

    booking.attended = true;
    booking.checkInTime = new Date();
    await booking.save();

    res.json({
      success: true,
      message: "Attendance marked successfully",
      booking: {
        bookingId: booking.bookingId,
        attendee: booking.attendeeInfo,
        event: booking.eventId.title,
        checkInTime: booking.checkInTime,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid or expired QR" });
  }
}; 

const getAttendanceList = async (req, res) => {
  try {
    const { eventId } = req.params;

    const bookings = await Booking.find({ eventId }).populate("userId");

    const list = bookings.map(b => ({
      bookingId: b.bookingId,
      name: b.attendeeInfo.name,
      email: b.attendeeInfo.email,
      status: b.attended ? "Present" : "Absent",
      checkInTime: b.checkInTime,
    }));

    res.json({ success: true, eventId, attendees: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { verifyAttendance, getAttendanceList };
 