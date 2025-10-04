const express  =require("express");
const { getDashboard, getOrganizerEvents, getOrganizerBookings, exportBookingData } = require("../controllers/organizerController.js");
const { protect, organizerOnly } =require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/dashboard", protect,organizerOnly,getDashboard);
router.get("/events", protect, organizerOnly, getOrganizerEvents);

router.get("/export-data", protect, organizerOnly, exportBookingData); // <-- NEW EXPORT ROUTE

module.exports = router;
