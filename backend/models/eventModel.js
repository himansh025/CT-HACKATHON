const mongoose = require("mongoose");
const { ticketSchema } = require("./ticketModel");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    images: [{ type: String, required: true }],

    price: { type: Number, default: 0 },

    organizer: {
      organizer_Id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String, required: true },
      avatar: { type: String },
    },

    tickets: [ticketSchema],
    rating: { type: Number, default: 0 },
    attendees: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
