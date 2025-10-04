// routes/collabRoutes.js
const Collab = require("../models/collabModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");

const collaborate = async (req, res) => {
  try {
    const { eventId, invitedUserId } = req.body;
    const currentUserId = req.user._id; // from JWT

    // Create a new collaboration request
    const collab = await Collab.create({
      eventId,
      users: [currentUserId, invitedUserId],
      status: "pending",
    });

    res.status(201).json({ message: "Collaboration request sent", collab });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending collaboration request" });
  }
}

// Cosine similarity between two vectors
function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || b.length === 0) return 0;

  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return magA && magB ? dot / (magA * magB) : 0;
}

// Get all unique event categories
async function getAllCategories() {
  const events = await Event.find({}, "category");
  const categorySet = new Set(events.map(e => e.category).filter(Boolean));
  return Array.from(categorySet);
}

// One-hot encode categories
function encodeCategories(userCategories, allCategories) {
  return allCategories.map(cat => userCategories.includes(cat) ? 1 : 0);
}

// Build user feature vector
async function buildUserVector(userId, allCategories) {
  const user = await User.findById(userId);
  if (!user) {
    console.warn(`User not found: ${userId}`);
    return null;
  }

  const bookings = await Booking.find({ userId, status: "confirmed" })
    .populate("eventId", "category");

  const categoriesAttended = bookings?.map(b => b.eventId?.category).filter(Boolean) || [];
  const attendanceFrequency = bookings?.length || 0;

  const categoryVector = encodeCategories(categoriesAttended, allCategories);

  const allInterests = await User.distinct("interests");
  const userInterests = Array.isArray(user.interests) ? user.interests : [];
  const interestVector = allInterests.map(i => userInterests.includes(i) ? 1 : 0);

  return [...categoryVector, ...interestVector, attendanceFrequency];
}

// Event-specific boost (optional, simple example)
function calculateEventBoost(user, eventCategory) {
  const userInterests = Array.isArray(user.interests) ? user.interests : [];
  return userInterests.includes(eventCategory) ? 1.2 : 1; // 20% boost if interests match event
}

// Format user for frontend
async function formatUserForFrontend(user, score, eventCategory) {
  return {
    id: user._id,
    name: user.name,
    avatar: user.avatar || null,
    interests: user.interests || [],
    compatibilityScore: Math.round(score * 100), // MULTIPLIED BY 100 and rounded
    eventCategory
  };
}

// Main matching function
async function getCompatibleUsers(userId, eventId, topN = 5) {
  try {
    const event = await Event.findById(eventId).select('category title');
    if (!event) throw new Error(`Event not found: ${eventId}`);
    const eventCategory = event.category;

    const allCategories = await getAllCategories();
    const currentUserVector = await buildUserVector(userId, allCategories);
    if (!currentUserVector) return [];

    const otherUsers = await User.find({ _id: { $ne: userId } }).select('name avatar interests');

    const userPromises = otherUsers.map(async (user) => {
      try {
        const otherVector = await buildUserVector(user._id, allCategories);
        if (!otherVector) return null;

        let score = cosineSimilarity(currentUserVector, otherVector);
        score *= calculateEventBoost(user, eventCategory);

        if (score <= 0.15) return null;

        return await formatUserForFrontend(user, score, eventCategory);
      } catch (err) {
        console.error(`Error processing user ${user._id}:`, err);
        return null;
      }
    });

    const results = (await Promise.all(userPromises)).filter(Boolean);
    results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return results.slice(0, topN);

  } catch (error) {
    console.error("Error in getCompatibleUsers:", error);
    throw error;
  }
}

module.exports = { collaborate, getCompatibleUsers };