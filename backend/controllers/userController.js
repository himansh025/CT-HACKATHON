const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendOtpEmail = require("../utils/sendEmail.js")
const Booking = require("../models/bookingModel.js");
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const Event = require("../models/eventModel.js"); // Ensure Event is imported
const Notification = require('../models/NotificationModel');


// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


// 🔐 Register (only superadmin can create other users)
exports.registerUser = async (req, res) => {
  try {

    const { name, email,phoneNo, password, role} = req.body;
    console.log(email)
    console.log(role);
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNo,
    });
      await newUser.save();

    res.status(201).json({ message: 'User created successfully',newUser });

  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// 🔐 Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email ' });
    }

    const passMatched = await bcrypt.compare(password, user.password);

    if (!passMatched) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        avatar:user.avatar,
        phoneNo:user.phoneNo,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};



exports.logoutUser = (req, res) => {
  res.clearCookie('token'); // If using cookies
  res.status(200).json({ message: 'Logged out successfully' });
};




// 4. Get logged-in user’s profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// 5. Admin gets all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};



// 6. Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
 try{
  const { name, phone } = req.body;
    let avatarUrl;

    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      if (uploadedImage && uploadedImage.url) {
        avatarUrl = uploadedImage.url;
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ...(name && { name }),
          ...(phone && { phoneNo:phone }),
          ...(avatarUrl && { avatar: avatarUrl })
        },
      },
      { new: true } // return updated doc
    ).select('-password'); // exclude password

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};


exports.sendOtpForPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();

    await sendOtpEmail({ email: user.email, name: user.name, otp });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

exports.verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpiry ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword; // hashed with pre-save
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during reset' });
  }
};

exports.getUserDashboard = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id });
  res.json({
    success: true,
    data: {
      stats: {
        totalBookings: bookings.length,
        upcomingEvents: bookings.filter((b) => new Date(b.createdAt) > new Date()).length,
        averageRating: 4.8, // placeholder
      },
      upcomingBookings: bookings.slice(0, 3),
    },
  });
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    // Set time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);

    const oneDay = 24 * 60 * 60 * 1000;
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * oneDay); // <-- CHANGED TO 30 DAYS
    const sevenDaysAgo = new Date(today.getTime() - 7 * oneDay);

    // 1. Fetch New Events (Events created in the last 7 days)
    const newEvents = await Event.find({ 
      createdAt: { $gte: sevenDaysAgo },
      date: { $gte: today } // Only upcoming new events
    }).limit(3).select('title date category _id');

    // 2. Fetch Upcoming Booked Events (Events happening in the next 30 days)
    const upcomingBookings = await Booking.find({ 
      userId,
      status: "confirmed" 
    }).populate({
      path: 'eventId',
      select: 'title date time venue images'
    });

    const upcomingAlerts = upcomingBookings.filter(booking => {
      // Check if event is happening between today and thirty days from now (inclusive)
      const eventDate = new Date(booking.eventId.date);
      eventDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
      
      return eventDate >= today && eventDate <= thirtyDaysFromNow; // <-- Filter uses 30 days
    }).map(booking => ({
      eventTitle: booking.eventId.title,
      eventDate: booking.eventId.date,
      time: booking.eventId.time,
      bookingId: booking.bookingId,
      eventId: booking.eventId._id
    }));


    res.json({
      success: true,
      data: {
        newEvents,
        upcomingAlerts
      }
    });

  } catch (err) {
    console.error("Error fetching user notifications:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};