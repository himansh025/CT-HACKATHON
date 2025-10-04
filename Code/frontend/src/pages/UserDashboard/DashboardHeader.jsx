import React from "react";

const DashboardHeader = ({ userName }) => {
  return (
    <div className="mb-8 text-center lg:text-left">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-purple-700 bg-clip-text text-transparent mb-3">
        Welcome back, {userName || "User"}!
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
        Manage your event tickets and bookings all in one place
      </p>
    </div>
  );
};

export default DashboardHeader;