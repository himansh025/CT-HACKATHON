import React from "react";
import { Ticket, Calendar, Star } from "lucide-react";

const StatsCards = ({ totalBookings, upcomingCount }) => {
  const averageRating = "4.8";
  
  const stats = [
    {
      icon: Ticket,
      value: totalBookings,
      label: "Total Bookings",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Calendar,
      value: upcomingCount,
      label: "Upcoming Events",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: Star,
      value: averageRating,
      label: "Avg. Rating",
      gradient: "from-amber-500 to-amber-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <IconComponent className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;