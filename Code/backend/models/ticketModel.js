const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    sold: { type: Number, default: 0 },
  },
  { _id: false }
);

module.exports = { ticketSchema };
