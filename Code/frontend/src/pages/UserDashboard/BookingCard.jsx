import React from "react";
import { Download, Share2, CalendarPlus, CreditCard } from "lucide-react";
import { generateQRCodeDataURL } from "../utils/qrCodeGenerator";
import { handleDownloadTicket, handleShareTicket, handleAddToCalendar } from "../utils/bookingActions";

const BookingCard = ({ booking, statusConfig }) => {
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
    <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-white">
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
};

export default BookingCard;