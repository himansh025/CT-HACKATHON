// Event-App/backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  logoutUser,
  getUserProfile,
  updateProfile,
  sendOtpForPasswordReset,
  verifyOtpAndResetPassword,
  loginUser,
  registerUser,
  getUserDashboard,
  getUserNotifications // Add this
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const {upload}= require("../middlewares/multer")

// Authenticated routes
router.post('/register',  registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);
router.get("/dashboard", protect, getUserDashboard);
router.get("/notifications", protect, getUserNotifications); // Add this
router.post('/forgot-password', sendOtpForPasswordReset);
router.post('/reset-password', verifyOtpAndResetPassword);
router.put('/update-profile', protect, upload.single("avatar"), updateProfile);


module.exports = router;