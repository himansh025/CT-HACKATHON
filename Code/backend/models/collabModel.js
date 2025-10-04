const mongoose=  require("mongoose");

const collabSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // participants
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});

module.exports = mongoose.model("Collab", collabSchema);
