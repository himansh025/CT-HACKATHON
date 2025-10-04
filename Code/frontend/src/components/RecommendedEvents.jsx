// frontend/src/components/RecommendedEvents.jsx
import React, { useState, useEffect } from "react";
import axios from "../config/apiconfig";
import EventCard from "./events/EventCard";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

// --- AESTHETIC DUMMY DATA FOR FALLBACK ---
const DUMMY_EVENTS = [
  {
    _id: "dummy-1",
    title: "Future of Tech Summit 2026",
    description:
      "Explore the next generation of AI, Blockchain, and sustainable computing.",
    date: "2026-03-15T10:00:00Z",
    time: "10:00 AM",
    venue: "Innovation Center, City Hall",
    category: "Technology",
    price: 99,
    // FIX: Using Picsum for stable, seed-based placeholder images
    images: ["https://picsum.photos/seed/tech/400/250"],
    attendees: 1200,
    rating: 4.7,
    organizer: { name: "Tech Innovators Co." },
  },
  {
    _id: "dummy-2",
    title: "Summer Music Festival: Indie Night",
    description:
      "Featuring the top breakout indie and folk artists under the stars.",
    date: "2025-07-20T18:30:00Z",
    time: "06:30 PM",
    venue: "City Park Amphitheater",
    category: "Music",
    price: 45,
    // FIX: Using Picsum for stable placeholder images
    images: ["https://picsum.photos/seed/music/400/250"],
    attendees: 5500,
    rating: 4.5,
    organizer: { name: "Vibe Events Ltd." },
  },
  {
    _id: "dummy-3",
    title: "Modern Art Workshop: Abstract & Digital",
    description:
      "A hands-on session exploring abstract painting techniques and digital tools.",
    date: "2025-11-05T14:00:00Z",
    time: "02:00 PM",
    venue: "The Creative Hub Gallery",
    category: "Arts",
    price: 50,
    // FIX: Using Picsum for stable placeholder images
    images: ["https://picsum.photos/seed/art/400/250"],
    attendees: 85,
    rating: 4.9,
    organizer: { name: "Artistry Studios" },
  },
  {
    _id: "dummy-4",
    title: "Startup Pitch Battle Finals",
    description:
      "Watch the city's top startups compete for a $1M seed funding prize.",
    date: "2026-01-25T17:00:00Z",
    time: "05:00 PM",
    venue: "Business Tower Auditorium",
    category: "Business",
    price: 0,
    // FIX: Using Picsum for stable placeholder images
    images: ["https://picsum.photos/seed/business/400/250"],
    attendees: 300,
    rating: 4.6,
    organizer: { name: "Venture Capital Group" },
  },
];

const RecommendedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await axios.get("/events/recommendations");
        setEvents(data);
        setError(null);
      } catch (err) {
        // Log the error but set a user-friendly message for the fallback
        console.error("Error fetching personalized recommendations:", err);
        setError("We couldn't fetch your personalized events right now.");
        setEvents([]); // Set empty array to trigger fallback logic
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Decide which events to display: fetched events OR dummy events
  const eventsToDisplay = events.length > 0 ? events : DUMMY_EVENTS;

  if (loading) return <Loader />;

  return (
    <div className="my-0">
      {/* Display an error bar if fetching failed but we are showing fallback data */}
      {error && events.length === 0 && DUMMY_EVENTS.length > 0 && (
        <p className="text-center text-sm text-yellow-700 mb-6 p-3 bg-yellow-100 border border-yellow-300 rounded-lg shadow-sm">
          {error} We are currently showing popular events as a general
          recommendation.
        </p>
      )}

      {eventsToDisplay.length === 0 ? (
        // Case: No events found (neither personalized nor dummy fallback exists)
        <div className="p-8 bg-gray-50 rounded-lg text-center border border-gray-200">
          <p className="text-lg text-gray-600 mb-4 font-medium">
            No recommended events available at this time.
          </p>
          <Link
            to="/events"
            className="text-primary-600 font-semibold hover:text-primary-800 transition-colors"
          >
            Explore all upcoming events →
          </Link>
        </div>
      ) : (
        // Case: Display fetched events OR dummy events
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventsToDisplay.map((event) => (
            <EventCard
              key={event._id}
              event={{
                ...event,
                // Flag the event as a fallback for potential custom styling in EventCard
                isFallback: event._id.startsWith("dummy"),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedEvents;
