// frontend/src/components/RecommendedEvents.jsx
import React, { useState, useEffect } from "react";
import axios from "../config/apiconfig";
import EventCard from "./events/EventCard"; //
import Loader from "./Loader"; //
import { Link } from "react-router-dom";

const RecommendedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await axios.get("/api/events/recommendations");
        setEvents(data);
      } catch (err) {
        setError("Failed to load recommendations.");
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        🌟 Recommended For You
      </h2>

      {events.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-lg text-gray-600 mb-4">
            We couldn't find any recommendations based on your interests.
          </p>
          <Link
            to="/events"
            className="text-blue-600 font-semibold hover:text-blue-800"
          >
            Explore all upcoming events →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Assuming EventCard component exists and is imported */}
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedEvents;
