const mongoose = require("mongoose");
const { ticketSchema } = require("./ticketModel");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      default: () => `BK${Date.now()}${Math.floor(Math.random() * 1000)}`, // readable booking ID
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tickets: [ticketSchema], // array of subdocuments

    totalAmount: {
      type: Number,
      required: true,
    },

    attendeeInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "bank"],
      default: "upi",
    },

    status: {
      type: String,
      enum: ["created", "confirmed", "cancelled", "refunded"],
      default: "created",
    },

    razorpayOrderId: { type: String, unique: true },
    paymentId: { type: String }, // Razorpay payment id
    signature: { type: String }, // Razorpay signature

    qrCode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
