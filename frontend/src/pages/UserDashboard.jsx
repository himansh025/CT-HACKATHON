import React, { useState, useEffect } from "react";
// 💡 FIX 1: Import Redux hooks for accessing user state
import { useSelector } from "react-redux";
import {
  Calendar,
  Ticket,
  Clock,
  MapPin,
  Download,
  Share2,
  Star,
  IndianRupee,
} from "lucide-react";

import axiosInstance from "../config/apiconfig";
import { format } from "date-fns";
import Loader from "../components/Loader";
import RecommendedEvents from "../components/RecommendedEvents";
// 💡 FIX 2: Import the new modal component
import InterestSelectionModal from "../components/InterestSelectionModal";

// --- CORE FIX: QR CODE GENERATION UTILITY ---
// This function dynamically loads the 'qrcode' npm package and generates a Data URI.
const generateQRCodeDataURL = async (text) => {
  try {
    const qrcodeModule = await import("qrcode");

    return await qrcodeModule.toDataURL(text, {
      width: 180,
      margin: 1,
      errorCorrectionLevel: "H",
    });
  } catch (e) {
    console.error(
      "Critical: Client-side QR generation failed. Please ensure 'npm install qrcode' was run.",
      e
    );
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  }
};

const UserDashboard = () => {
  // 💡 FIX 3: Get user details from Redux
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [myBookings, setMyBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 💡 FIX 4: Add state for the new modal
  const [showInterestsModal, setShowInterestsModal] = useState(false);

  // --- HANDLER FUNCTIONS (UNCHANGED) ---

  const handleDownloadTicket = async (bookingId) => {
    try {
      // 1. Fetch rich ticket data from backend
      const response = await axiosInstance.get(
        `/booking/download/${bookingId}`
      );
      const ticketData = response.data.data;

      const totalQuantity = ticketData.tickets.reduce(
        (sum, t) => sum + t.quantity,
        0
      );

      // 1. Generate QR Code Data URI on the client-side (CORS-safe)
      const qrCodeDataURI = await generateQRCodeDataURL(ticketData.accessCode);

      // 2. Construct the printable HTML document with the Data URI
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Event Ticket - ${ticketData.eventTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
            body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
            .ticket-container {
                max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #9333ea; 
                color: white; padding: 30px; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px;
            }
            .content { padding: 30px; }
            .details { 
                border-bottom: 2px dashed #e5e7eb; padding-bottom: 20px; margin-bottom: 20px; display: flex; flex-wrap: wrap; justify-content: space-between;
            }
            .detail-item { width: 48%; margin-bottom: 15px; }
            .label { font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 500; }
            .value { font-size: 16px; color: #1f2937; font-weight: 600; }
            .ticket-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #f3f4f6; }
            .qr-section { text-align: center; background-color: #f9fafb; padding: 30px; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }
            .qr-section img { margin: 15px auto; display: block; }
            @media print {
                .ticket-container { box-shadow: none; border: 1px solid #000; }
                .header { background-color: #9333ea !important; -webkit-print-color-adjust: exact; color: white !important; }
                .qr-section { background-color: #f9fafb !important; -webkit-print-color-adjust: exact; }
                body { background-color: white; }
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="header">
              <h1 style="font-size: 28px; font-weight: 800; margin: 0;">${
                ticketData.eventTitle
              }</h1>
              <p style="font-size: 18px; margin: 5px 0 0;">Confirmed Ticket</p>
            </div>
            
            <div class="content">
              <div class="details">
                <div class="detail-item">
                  <p class="label">Attendee Name</p>
                  <p class="value">${ticketData.attendeeName}</p>
                </div>
                <div class="detail-item">
                  <p class="label">Date</p>
                  <p class="value">${format(
                    new Date(ticketData.eventDate),
                    "EEE, MMM dd, yyyy"
                  )}</p>
                </div>
                <div class="detail-item">
                  <p class="label">Time</p>
                  <p class="value">${ticketData.eventTime}</p>
                </div>
                <div class="detail-item">
                  <p class="label">Venue</p>
                  <p class="value">${ticketData.venue}</p>
                </div>
                <div class="detail-item">
                  <p class="label">Total Tickets</p>
                  <p class="value">${totalQuantity}</p>
                </div>
                <div class="detail-item">
                  <p class="label">Total Paid</p>
                  <p class="value">₹${ticketData.totalAmount}</p>
                </div>
              </div>

              <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 10px; color: #1f2937;">Ticket Breakdown</h3>
              ${ticketData.tickets
                .map(
                  (t) => `
                <div class="ticket-row">
                    <span class="value">${t.type} (x${t.quantity})</span>
                    <span class="value">₹${t.price * t.quantity}</span>
                </div>
              `
                )
                .join("")}
            </div>

            <div class="qr-section">
              <img src="${qrCodeDataURI}" alt="QR Code for Entry" style="width: 180px; height: 180px;"/>
              <p style="font-size: 18px; font-weight: 600; color: #1f2937;">SCAN FOR ENTRY</p>
              <p style="font-size: 12px; color: #6b7280;">Access Code: ${
                ticketData.accessCode
              }</p>
            </div>
          </div>
          
          <script>
            window.onload = function() {
                setTimeout(function() {
                    window.print();
                }, 100); 
            };
          </script>
        </body>
        </html>
      `;

      // 3. Open new window and trigger print
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow pop-ups to download the ticket.");
        return;
      }

      printWindow.document.write(printContent);
      printWindow.document.close();
    } catch (error) {
      console.error("Download failed:", error);
      alert(
        "Failed to download ticket. Please ensure the booking is confirmed and try again."
      );
    }
  };

  const handleShareTicket = (eventTitle, bookingId) => {
    const shareData = {
      title: `My Ticket for ${eventTitle}`,
      text: `Check out my ticket for ${eventTitle}! Booking ID: ${bookingId}. Find more events on EventHive.`,
      url: window.location.origin,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) => {
        if (error.name !== "AbortError") {
          console.log("Error sharing", error);
          alert("Sharing failed. You can copy the link manually.");
        }
      });
    } else {
      prompt("Copy the text to share:", shareData.text);
    }
  };

  const handleAddToCalendar = (eventTitle, eventDate, eventTime, venue) => {
    const startDateTime = new Date(`${eventDate}T${eventTime}`);
    const endTime = eventTime
      ? new Date(startDateTime.getTime() + 60 * 60 * 1000)
      : startDateTime;
    const formatCalendarTime = (date) => format(date, "yyyyMMddTHHmmss");

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle
    )}&dates=${formatCalendarTime(startDateTime)}/${formatCalendarTime(
      endTime
    )}&details=${encodeURIComponent(
      "Your confirmed booking with EventHive."
    )}&location=${encodeURIComponent(venue)}&sf=true&output=xml`;

    window.open(googleCalendarUrl, "_blank");
  };

  // --- END HANDLER FUNCTIONS ---

  // 💡 FIX 5: Logic to display modal on first visit (if no interests are set)
  useEffect(() => {
    // Check if the user object is available and if their interests array is null or empty
    // The conditional check here is crucial for triggering the AI feature.
    if (user && Array.isArray(user.interests) && user.interests.length === 0) {
      setShowInterestsModal(true);
    } else {
      setShowInterestsModal(false);
    }
  }, [user]);

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

  // Filtering logic based on date and status (Confirmed OR Created for Upcoming)
  const filteredBookings = myBookings.filter((booking) => {
    const eventDate = new Date(booking.eventDate);
    const now = new Date();

    if (activeTab === "upcoming") {
      return (
        (booking.status === "confirmed" || booking.status === "created") &&
        eventDate >= now
      );
    }
    if (activeTab === "past") {
      return booking.status === "confirmed" && eventDate < now;
    }
    if (activeTab === "cancelled") {
      return booking.status === "cancelled";
    }
    return false;
  });

  // Calculate counts dynamically
  const totalBookings = myBookings.length;
  const upcomingCount = myBookings.filter(
    (b) =>
      (b.status === "confirmed" || b.status === "created") &&
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
  ];

  const averageRating = "4.8";

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* 💡 FIX 6: Conditionally render the Interest Modal */}
      <InterestSelectionModal
        show={showInterestsModal}
        onClose={() => setShowInterestsModal(false)}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (Updated to greet the user) */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name || "User"}!
          </h1>
          <p className="text-gray-600">
            Manage your tickets and event bookings
          </p>
        </div>

        {/* Recommendations Section (Placed prominently at the top) */}
        <RecommendedEvents />

        {/* Stats Cards (Updated counts) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalBookings}
                </div>
                <div className="text-gray-600">Total Bookings</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {upcomingCount}
                </div>
                <div className="text-gray-600">Upcoming Events</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {averageRating}
                </div>
                <div className="text-gray-600">Avg. Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No {activeTab} Bookings Found
                </h3>
                <p className="text-gray-600">
                  Check a different tab or start exploring events!
                </p>
              </div>
            )}

            {/* Display Filtered Bookings */}
            {filteredBookings.length > 0 && (
              <div className="space-y-6">
                {filteredBookings.map((ticket) => {
                  const isPending = ticket.status === "created";
                  const isConfirmed = ticket.status === "confirmed";

                  return (
                    <div
                      key={ticket?.bookingId}
                      className={`border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow 
                      ${
                        isPending && activeTab === "upcoming"
                          ? "bg-yellow-50 border-yellow-200 opacity-90"
                          : ""
                      } 
                      ${activeTab === "past" ? "opacity-70" : ""} 
                      ${
                        activeTab === "cancelled"
                          ? "bg-red-50 border-red-200 opacity-90"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        <img
                          src={ticket?.image}
                          alt={ticket?.eventTitle}
                          className="w-full lg:w-48 h-32 object-cover rounded-lg"
                        />

                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {ticket?.eventTitle}
                              </h3>
                              {/* Status Badges */}
                              {isPending && activeTab === "upcoming" && (
                                <span className="text-sm font-medium px-3 py-1 rounded-full bg-yellow-400 text-white">
                                  Pending Payment
                                </span>
                              )}
                              {activeTab === "past" && isConfirmed && (
                                <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-500 text-white">
                                  Attended
                                </span>
                              )}
                              {activeTab === "cancelled" && (
                                <span className="text-sm font-medium px-3 py-1 rounded-full bg-red-500 text-white">
                                  Cancelled
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 text-gray-600 mt-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{ticket?.eventDate?.slice(0, 10)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{ticket?.eventTime}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{ticket?.venue}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            {ticket?.tickets &&
                              ticket.tickets.map((tkt, index) => (
                                <React.Fragment key={index}>
                                  <div className="bg-gray-200 flex gap-2">
                                    <div className="text-gray-500">
                                      Ticket Type
                                    </div>
                                    <div className="font-medium text-gray-900">
                                      {tkt.type.slice(0, 8)}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-500">
                                      Quantity
                                    </div>
                                    <div className="font-medium text-gray-900">
                                      {tkt.quantity}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-500">
                                      Total Paid
                                    </div>
                                    <div className="font-medium text-gray-900">
                                      ${tkt.price * tkt.quantity}
                                    </div>
                                  </div>
                                </React.Fragment>
                              ))}
                            <div className="text-gray-500">Booking ID</div>
                            <div className="font-medium text-gray-900">
                              {ticket.bookingId}
                            </div>
                          </div>

                          {/* Action Buttons: Show actions for ALL upcoming tickets (confirmed or created) */}
                          <div className="flex flex-wrap gap-3">
                            {activeTab === "upcoming" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleDownloadTicket(ticket?.bookingId)
                                  }
                                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                  <span>Download Ticket</span>
                                </button>
                                <button
                                  onClick={() =>
                                    handleShareTicket(
                                      ticket?.eventTitle,
                                      ticket?.bookingId
                                    )
                                  }
                                  className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Share2 className="w-4 h-4" />
                                  <span>Share</span>
                                </button>
                                <button
                                  onClick={() =>
                                    handleAddToCalendar(
                                      ticket?.eventTitle,
                                      ticket?.eventDate?.slice(0, 10),
                                      ticket?.eventTime,
                                      ticket?.venue
                                    )
                                  }
                                  className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Calendar className="w-4 h-4" />
                                  <span>Add to Calendar</span>
                                </button>
                              </>
                            )}

                            {isPending && activeTab === "upcoming" && (
                              <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                                <IndianRupee className="w-4 h-4" />
                                <span>Complete Payment</span>
                              </button>
                            )}

                            {activeTab === "past" && isConfirmed && (
                              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                                Review Event
                              </button>
                            )}
                            {activeTab === "cancelled" && (
                              <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                                View Cancellation Details
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Display Past Bookings (consolidated logic) */}
            {/* The separate 'Display Past Bookings' and 'Display Cancelled Bookings' blocks are now redundant 
                since the primary Display Filtered Bookings block handles all tabs and styling. 
                I will comment out the redundant sections for a cleaner structure. */}

            {/* {activeTab === "past" && (
                ... Redundant block removed for clarity ...
            )}
            {activeTab === "cancelled" && (
                ... Redundant block removed for clarity ...
            )} 
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
