const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware.js");
const {getCompatibleUsers,collaborate} = require("../controllers/collabController.js");
// Get top 5 user matches for collaboration
router.get("/:eventId/match", protect, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id; // Get from authenticated user
    console.log(eventId,userId);
    const matches = await getCompatibleUsers(userId, eventId, 5);
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error computing matches" });
  }
});
router.post("/collaborate", protect, collaborate)

module.exports = router;
