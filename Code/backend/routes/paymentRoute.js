const express = require("express");
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Razorpay order
router.post("/createOrder", protect, createOrder);

// Verify Razorpay payment
router.post("/verifyPayment", protect, verifyPayment);

module.exports = router;
