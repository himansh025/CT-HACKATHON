const express  =require("express");
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getCategories,
} =require( "../controllers/eventController.js");
const { protect, organizerOnly } =require("../middlewares/authMiddleware.js");
const { upload } = require("../middlewares/multer.js");

const router = express.Router();

router.get("/", getEvents);
router.get("/categories", getCategories);
router.get("/:id", getEventById);
router.post("/",protect,organizerOnly, upload.array("images"), createEvent);
router.put("/:id", protect,organizerOnly,upload.array("images"), updateEvent);

router.delete("/:id", protect, organizerOnly, deleteEvent);

module.exports= router;
