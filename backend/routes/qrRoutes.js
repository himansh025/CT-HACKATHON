// routes/qrRoutes.js
const express = require("express");
const { verifyQR } = require("../controllers/qrController");
const { protect, organizerOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Only organizers/helpers can verify
router.post("/verify", protect, organizerOnly, verifyQR);

module.exports = router;
