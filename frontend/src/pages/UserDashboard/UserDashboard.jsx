import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/apiconfig";
import Loader from "../../components/Loader";
import EditProfile from "../../components/EditProfile";
import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import DashboardTabs from "./DashboardTabs";
import BookingsList from "./BookingsList";

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [myBookings, setMyBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/booking");
        setMyBookings(data?.bookings?.formatted || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setMyBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    getBookings();
  }, []);

  const tabs = [
    { id: "upcoming", label: "Upcoming", count: myBookings.filter(b => (b.status === "confirmed" || b.status === "created") && new Date(b.eventDate) >= new Date()).length },
    { id: "past", label: "Past", count: myBookings.filter(b => b.status === "confirmed" && new Date(b.eventDate) < new Date()).length },
    { id: "cancelled", label: "Cancelled", count: myBookings.filter(b => b.status === "cancelled").length },
    { id: "profile", label: "Profile", count: null }
  ];

  const filteredBookings = myBookings.filter((booking) => {
    const eventDate = new Date(booking.eventDate);
    const now = new Date();
    switch (activeTab) {
      case "upcoming":
        return (booking.status === "confirmed" || booking.status === "created") && eventDate >= now;
      case "past":
        return booking.status === "confirmed" && eventDate < now;
      case "cancelled":
        return booking.status === "cancelled";
      default:
        return false;
    }
  });

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader userName={user?.name} />
        <StatsCards 
          totalBookings={myBookings.length}
          upcomingCount={tabs[0].count}
        />

        <DashboardTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {/* Tab Content */}
          {activeTab === "profile" && <EditProfile />}
          {(activeTab === "upcoming" || activeTab === "past" || activeTab === "cancelled") && (
            <BookingsList bookings={filteredBookings} activeTab={activeTab} />
          )}
        </DashboardTabs>
      </div>
    </div>
  );
};

export default UserDashboard;
