import React from "react";

const BookingsTabs = ({ activeTab, setActiveTab, myBookings }) => {
  // Calculate counts for each tab
  const upcomingCount = myBookings.filter(
    (b) => (b.status === "confirmed" || b.status === "created") &&
           new Date(b.eventDate) >= new Date()
  ).length;
  
  const pastCount = myBookings.filter(
    (b) => b.status === "confirmed" && new Date(b.eventDate) < new Date()
  ).length;
  
  const cancelledCount = myBookings.filter(
    (b) => b.status === "cancelled"
  ).length;

  const tabs = [
    { id: "upcoming", label: "Upcoming Events", count: upcomingCount },
    { id: "past", label: "Past Events", count: pastCount },
    { id: "cancelled", label: "Cancelled", count: cancelledCount },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
      <div className="border-b border-gray-200 bg-gray-50/50">
        <nav className="flex space-x-8 px-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-5 border-b-2 font-semibold text-sm transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isActive 
                      ? "bg-purple-100 text-purple-700" 
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BookingsTabs;