const express  =require("express");
const router= express.Router()
const {healthCheck, chatBotHandler} =require("../controllers/chatBotController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/chathandler",protect, chatBotHandler);
router.get("/health", healthCheck);




module.exports = router;
