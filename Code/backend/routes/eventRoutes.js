console.log("✅ eventRoutes.js file loaded and router configured."); // <-- ADD THIS LINE

const express = require("express");
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getCategories,
  getRecommendedEvents, // <-- 1. CRITICAL IMPORT ADDED
} = require("../controllers/eventController.js");
const { protect, organizerOnly } = require("../middlewares/authMiddleware.js");
const { upload } = require("../middlewares/multer.js");

// 2. CRITICAL ROUTE DEFINITION: Defines the full path /api/events/recommendations
router.get("/recommendations", protect, getRecommendedEvents);

router.get("/", getEvents);
router.get("/categories", getCategories);
router.get("/:id", getEventById);
router.post("/", protect, organizerOnly, upload.array("images"), createEvent);
router.put("/:id", protect, organizerOnly, upload.array("images"), updateEvent);

router.delete("/:id", protect, organizerOnly, deleteEvent);

module.exports = router;
