// backend/controllers/userController.js
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Make sure jwt is imported
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { sendOtpEmail } = require("../utils/sendEmail");
const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");

// --- THIS IS THE FIX ---
// Define the generateToken function directly in this file
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, phoneNo, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNo,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    const passMatched = await bcrypt.compare(password, user.password);
    if (!passMatched) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({
      token: generateToken(user), // Use the local function
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        phoneNo: user.phoneNo,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ... (keep the rest of your controller functions exactly as they were)
const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone,interests } = req.body;
    console.log(interests);
    let avatarUrl;
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      if (uploadedImage && uploadedImage.url) {
        avatarUrl = uploadedImage.url;
      }
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ...(name && { name }),
          ...(phone && { phoneNo: phone }),
          ...(interests&&{interests:interests}),
          ...(avatarUrl && { avatar: avatarUrl }),
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const updateUserInterests = async (req, res) => {
  const { interests } = req.body;
  const userId = req.user._id;
  if (!interests || !Array.isArray(interests)) {
    return res.status(400).json({ message: "Interests must be an array." });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.interests = interests;
    await user.save();
    res.status(200).json({
      message: "Interests updated successfully.",
      interests: user.interests,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const sendOtpForPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();
    await sendOtpEmail({ email: user.email, name: user.name, otp });
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP" });
  }
};

const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpiry ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error during reset" });
  }
};

const getUserDashboard = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id });
  res.json({
    success: true,
    data: {
      stats: {
        totalBookings: bookings.length,
        upcomingEvents: bookings.filter(
          (b) => new Date(b.createdAt) > new Date()
        ).length,
        averageRating: 4.8,
      },
      upcomingBookings: bookings.slice(0, 3),
    },
  });
};

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneDay = 24 * 60 * 60 * 1000;
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * oneDay);
    const sevenDaysAgo = new Date(today.getTime() - 7 * oneDay);
    const newEvents = await Event.find({
      createdAt: { $gte: sevenDaysAgo },
      date: { $gte: today },
    })
      .limit(3)
      .select("title date category _id");
    const upcomingBookings = await Booking.find({
      userId,
      status: "confirmed",
    }).populate({
      path: "eventId",
      select: "title date time venue images",
    });
    const upcomingAlerts = upcomingBookings
      .filter((booking) => {
        const eventDate = new Date(booking.eventId.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today && eventDate <= thirtyDaysFromNow;
      })
      .map((booking) => ({
        eventTitle: booking.eventId.title,
        eventDate: booking.eventId.date,
        time: booking.eventId.time,
        bookingId: booking.bookingId,
        eventId: booking.eventId._id,
      }));
    res.json({
      success: true,
      data: {
        newEvents,
        upcomingAlerts,
      },
    });
  } catch (err) {
    console.error("Error fetching user notifications:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getAllUsers,
  getUserById,
  updateProfile,
  updateUserInterests,
  sendOtpForPasswordReset,
  verifyOtpAndResetPassword,
  getUserDashboard,
  getUserNotifications,
};
