import React from "react";

const ReviewPublishForm = ({ eventData, imagePreviews, coordinates }) => {
  const totalTickets = (parseInt(eventData.generalQuantity) || 0) + (parseInt(eventData.vipQuantity) || 0);
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Review Event Details</h2>
        <p className="text-sm text-gray-600">Please review all information before publishing your event</p>
      </div>

      {/* Basic Information */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b pb-2">Basic Information</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-600 font-medium">Title:</span>
            <span className="col-span-2 text-gray-900">{eventData.title || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-600 font-medium">Category:</span>
            <span className="col-span-2 text-gray-900">{eventData.category || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-600 font-medium">Description:</span>
            <span className="col-span-2 text-gray-900">{eventData.description || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b pb-2">Date & Time</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-600 font-medium">Date:</span>
            <span className="col-span-2 text-gray-900">{eventData.date || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-600 font-medium">Start Time:</span>
            <span className="col-span-2 text-gray-900">{eventData.startTime || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-600 font-medium">End Time:</span>
            <span className="col-span-2 text-gray-900">{eventData.endTime || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Venue Information */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b pb-2">Venue Information</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-600 font-medium">Venue Name:</span>
            <span className="col-span-2 text-gray-900">{eventData.venueName || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-600 font-medium">Address:</span>
            <span className="col-span-2 text-gray-900">{eventData.location || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-600 font-medium">Capacity:</span>
            <span className="col-span-2 text-gray-900">{eventData.venueCapacity || "N/A"} people</span>
          </div>
          {coordinates?.lat && coordinates?.lng && (
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-600 font-medium">Coordinates:</span>
              <span className="col-span-2 text-gray-900 text-sm">
                Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tickets */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b pb-2">Tickets</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <div>
              <p className="font-medium text-gray-900">General Admission</p>
              <p className="text-sm text-gray-600">Quantity: {eventData.generalQuantity || 0}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-700">₹{eventData.generalPrice || 0}</p>
            </div>
          </div>
          
          {eventData.vipPrice && parseFloat(eventData.vipPrice) > 0 && (
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
              <div>
                <p className="font-medium text-gray-900">VIP</p>
                <p className="text-sm text-gray-600">Quantity: {eventData.vipQuantity || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-700">₹{eventData.vipPrice}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center p-3 bg-gray-100 rounded border-t-2 border-gray-300">
            <span className="font-semibold text-gray-700">Total Tickets:</span>
            <span className="font-bold text-gray-900">{totalTickets}</span>
          </div>
        </div>
      </div>

      {/* Images */}
      {imagePreviews && imagePreviews.length > 0 && (
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b pb-2">Event Images</h3>
          <div className="grid grid-cols-3 gap-3">
            {imagePreviews.map((src, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={src}
                  alt={`event-${idx}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
                />
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Image {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b pb-2">Settings</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-600 font-medium">Privacy:</span>
            <span className="col-span-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                eventData.privacy === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {eventData.privacy || "Public"}
              </span>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-600 font-medium">Featured:</span>
            <span className="col-span-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                eventData.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {eventData.featured ? "Yes" : "No"}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Once published, your event will be visible to all users. Make sure all information is correct before proceeding.
        </p>
      </div>
    </div>
  );
};

export default ReviewPublishForm;