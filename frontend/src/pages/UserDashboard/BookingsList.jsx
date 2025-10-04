import React from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock4, 
  Calendar, 
  Clock, 
  MapPin,
  Download,
  Share2,
  CalendarPlus,
  CreditCard
} from "lucide-react";
import { format } from "date-fns";
import axiosInstance from "../../config/apiconfig";

// QR Code Generation Utility
const generateQRCodeDataURL = async (text) => {
  try {
    const qrcodeModule = await import("qrcode");
    return await qrcodeModule.toDataURL(text, {
      width: 180,
      margin: 1,
      errorCorrectionLevel: "H",
    });
  } catch (e) {
    console.error("QR generation failed:", e);
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  }
};

const handleDownloadTicket = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`/booking/download/${bookingId}`);
    const ticketData = response.data.data;
    const totalQuantity = ticketData.tickets.reduce((sum, t) => sum + t.quantity, 0);
    const qrCodeDataURI = await generateQRCodeDataURL(ticketData.accessCode);

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
            <h1 style="font-size: 28px; font-weight: 800; margin: 0;">${ticketData.eventTitle}</h1>
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
                <p class="value">${format(new Date(ticketData.eventDate), "EEE, MMM dd, yyyy")}</p>
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
            ${ticketData.tickets.map(t => `
              <div class="ticket-row">
                  <span class="value">${t.type} (x${t.quantity})</span>
                  <span class="value">₹${t.price * t.quantity}</span>
              </div>
            `).join("")}
          </div>

          <div class="qr-section">
            <img src="${qrCodeDataURI}" alt="QR Code for Entry" style="width: 180px; height: 180px;"/>
            <p style="font-size: 18px; font-weight: 600; color: #1f2937;">SCAN FOR ENTRY</p>
            <p style="font-size: 12px; color: #6b7280;">Access Code: ${ticketData.accessCode}</p>
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

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to download the ticket.");
      return;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download ticket. Please ensure the booking is confirmed and try again.");
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

const BookingsList = ({ bookings, activeTab }) => {
  // Status configuration
  const statusConfig = {
    confirmed: { 
      label: "Confirmed", 
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle 
    },
    created: { 
      label: "Pending Payment", 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock4 
    },
    cancelled: { 
      label: "Cancelled", 
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle 
    },
  };

  const emptyStateMessages = {
    upcoming: {
      title: "No Upcoming Bookings",
      message: "You don't have any upcoming events. Start exploring events to book your next adventure!",
      icon: Calendar
    },
    past: {
      title: "No Past Bookings", 
      message: "Your past event bookings will appear here once you attend some events.",
      icon: Clock
    },
    cancelled: {
      title: "No Cancelled Bookings",
      message: "Cancelled bookings will appear here if you need to cancel any events.",
      icon: XCircle
    }
  };

  if (bookings.length === 0) {
    const emptyState = emptyStateMessages[activeTab] || emptyStateMessages.upcoming;
    const EmptyIcon = emptyState.icon;
    
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <EmptyIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          {emptyState.title}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          {emptyState.message}
        </p>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
          Browse Events
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => {
        const { 
          bookingId, 
          status, 
          tickets, 
          eventTitle, 
          eventDate, 
          eventTime, 
          venue, 
          totalPaid, 
          image 
        } = booking;
        
        const StatusIcon = statusConfig[status]?.icon || Clock4;
        const statusStyle = statusConfig[status]?.color || "bg-gray-100 text-gray-800 border-gray-200";
        const isActionable = status === "confirmed" || status === "created";

        return (
          <div key={bookingId} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-white">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Event Image */}
              <div className="flex-shrink-0">
                <img 
                  src={image} 
                  alt={eventTitle} 
                  className="w-full lg:w-64 h-48 object-cover rounded-xl shadow-md"
                />
              </div>
              
              {/* Event Details */}
              <div className="flex-1 min-w-0">
                {/* Header with Title and Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {eventTitle}
                    </h3>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4" />
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyle}`}>
                        {statusConfig[status]?.label || status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="font-medium">{eventDate?.slice(0, 10)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="font-medium">{eventTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 md:col-span-2 lg:col-span-1">
                    <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="font-medium truncate">{venue?.name}, {venue?.address}</span>
                  </div>
                </div>

                {/* Tickets Breakdown */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Ticket Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tickets.map((ticket, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-900">{ticket.type}</span>
                          <span className="text-sm text-gray-600">Qty: {ticket.quantity}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Price per ticket</span>
                          <span className="font-semibold text-gray-900">₹{ticket.price}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                          <span className="text-sm font-medium text-gray-700">Subtotal</span>
                          <span className="font-bold text-purple-700">₹{ticket.price * ticket.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer with Actions and Total */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">Booking ID: {bookingId}</span>
                    <span className="font-bold text-lg text-gray-900">Total: ₹{totalPaid}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {isActionable && (
                      <>
                        <button 
                          onClick={() => handleDownloadTicket(bookingId)}
                          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download Ticket
                        </button>
                        <button 
                          onClick={() => handleShareTicket(eventTitle, bookingId)}
                          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                        <button 
                          onClick={() => handleAddToCalendar(eventTitle, eventDate, eventTime, venue?.name)}
                          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          <CalendarPlus className="w-4 h-4" />
                          Calendar
                        </button>
                      </>
                    )}
                    {status === "created" && (
                      <button className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-amber-600 transition-colors">
                        <CreditCard className="w-4 h-4" />
                        Complete Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingsList;