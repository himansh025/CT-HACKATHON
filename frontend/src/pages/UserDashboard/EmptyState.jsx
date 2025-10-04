// components/UserDashboard/EmptyState.jsx
import React from "react";
import { Ticket } from "lucide-react";

const EmptyState = ({ activeTab }) => {
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case "upcoming":
        return {
          title: "No Upcoming Bookings",
          description: "You don't have any upcoming events. Start exploring events to book your next adventure!",
          buttonText: "Browse Events"
        };
      case "past":
        return {
          title: "No Past Bookings",
          description: "Your past event bookings will appear here once you attend some events.",
          buttonText: "Browse Events"
        };
      case "cancelled":
        return {
          title: "No Cancelled Bookings",
          description: "Cancelled bookings will appear here if you need to cancel any events.",
          buttonText: "Browse Events"
        };
      default:
        return {
          title: "No Bookings",
          description: "You don't have any bookings yet.",
          buttonText: "Browse Events"
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Ticket className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">
        {content.title}
      </h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        {content.description}
      </p>
      <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
        {content.buttonText}
      </button>
    </div>
  );
};

export default EmptyState;