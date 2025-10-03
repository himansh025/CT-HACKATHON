// controllers/bookingController.js (or wherever your verifyPayment lives)
const mongoose = require("mongoose");
const crypto = require("crypto");
const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");

const { sendBookingConfirmationEmail } = require("../utils/sendEmail"); // Import new email function

exports.verifyPayment = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { booking_id, order_id, payment_id, signature } = req.body;

    // 1) verify signature (Razorpay uses order_id|payment_id)
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    // 2) start transaction
    session.startTransaction();

    // 3) find booking
    const booking = await Booking.findById(booking_id).session(session);
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // idempotency: if already confirmed, return success
    if (booking.status === "confirmed") {
      await session.commitTransaction();
      session.endSession();
      return res.json({
        success: true,
        message: "Booking already confirmed",
        booking,
      });
    }

    // 4) find event
    const event = await Event.findById(booking.eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // 5) update event tickets and attendees
    let attendeesToAdd = 0;
    for (const bTicket of booking.tickets) {
      // match an event ticket by type (and price optionally)
      const eTicket = event.tickets.find(
        (t) => t.type === bTicket.type && (t.price === bTicket.price || true)
      );

      if (!eTicket) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Ticket type "${bTicket.type}" not found on event`,
        });
      }

      // optional: check availability
      if (typeof eTicket.quantity === "number") {
        if (eTicket.quantity < bTicket.quantity) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            success: false,
            message: `Not enough tickets available for "${bTicket.type}"`,
          });
        }
        eTicket.quantity = eTicket.quantity - bTicket.quantity; // reduce available
      }

      eTicket.sold = (eTicket.sold || 0) + bTicket.quantity; // increment sold
      attendeesToAdd += bTicket.quantity;
    }

    event.attendees = (event.attendees || 0) + attendeesToAdd;

    // 6) update booking with payment info + status
    booking.status = "confirmed";
    booking.paymentId = payment_id;
    booking.signature = signature;
    booking.razorpayOrderId = order_id;

    // 7) save both inside the transaction
    await booking.save({ session });
    await event.save({ session });

    // 8) commit
    await session.commitTransaction();
    session.endSession();

    // 9) Send Confirmation Email (New Step)
    await sendBookingConfirmationEmail({
      email: booking.attendeeInfo.email,
      name: booking.attendeeInfo.name,
      bookingId: booking.bookingId,
      eventTitle: event.title,
      date: event.date,
      totalAmount: booking.totalAmount,
      tickets: booking.tickets,
    });

    return res.json({
      success: true,
      message: "Payment verified & booking confirmed",
      booking,
    });
  } catch (err) {
    // rollback and rethrow
    try {
      await session.abortTransaction();
      session.endSession();
    } catch (e) {
      // ignore
    }
    next(err);
  }
};
