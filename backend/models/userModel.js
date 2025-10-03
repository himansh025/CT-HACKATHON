const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo:{type:Number},
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "organizer"], default: "user" },
  avatar: String,
    otp: String,
otpExpiry: Date,

},{timestamps:true});

module.exports = mongoose.model('User', userSchema);
