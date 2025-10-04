import React from "react";
import LocationPicker from "../../LocationPicker";

const BasicDetailsForm = ({ register, errors, setValue, coordinates, onCoordinatesChange }) => {

  const handleCoordinatesChange = (newCoords) => {
    onCoordinatesChange(newCoords);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Event Title *</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="w-full border p-2 rounded"
          placeholder="Enter event title"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">Description *</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="w-full border p-2 rounded h-32"
          placeholder="Enter event description"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Start Date *</label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Start Time *</label>
          <input
            type="time"
            {...register("startTime", { required: "Start time is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">End Time *</label>
          <input
            type="time"
            {...register("endTime", { required: "End time is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime.message}</p>}
        </div>
      </div>

      {/* Venue Details */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-3">Venue Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Venue Name *</label>
            <input
              {...register("venueName", { required: "Venue name is required" })}
              className="w-full border p-2 rounded"
              placeholder="e.g., City Convention Center"
            />
            {errors.venueName && <p className="text-red-500 text-sm">{errors.venueName.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Venue Address *</label>
            <input
              {...register("location", { required: "Location is required" })}
              className="w-full border p-2 rounded"
              placeholder="Enter venue address"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Venue Capacity *</label>
            <input
              type="number"
              {...register("venueCapacity", { 
                required: "Venue capacity is required",
                min: { value: 1, message: "Capacity must be at least 1" }
              })}
              className="w-full border p-2 rounded"
              placeholder="e.g., 500"
            />
            {errors.venueCapacity && <p className="text-red-500 text-sm">{errors.venueCapacity.message}</p>}
          </div>
        </div>
      </div>

      {/* Map */}
   {/* Admin Create Event Form */}
<div className="space-y-4 border-t pt-4">
  <h3 className="text-lg font-semibold text-gray-800">
    Select Location on Map *
  </h3>

  {(!coordinates?.lat || !coordinates?.lng) && (
    <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
      Please click on the map to select the venue location
    </p>
  )}

  <LocationPicker
    coordinates={coordinates}
    onCoordinatesChange={handleCoordinatesChange} // updates form state
    height="400px"
    className="border border-gray-200 rounded-lg overflow-hidden"
    showManualInputs={true}
    isReadOnly={false} // ✅ allow admin to select/change location
  />

  {coordinates?.lat && coordinates?.lng && (
    <p className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">
      ✓ Location selected: <b>Lat:</b> {coordinates.lat.toFixed(6)},{" "}
      <b>Lng:</b> {coordinates.lng.toFixed(6)}
    </p>
  )}
</div>


      {/* Category */}
      <div>
        <label className="block mb-1 font-medium">Category *</label>
        <select
          {...register("category", { required: "Category is required" })}
          className="w-full border p-2 rounded"
        >
          <option value="">Select a category</option>
          <option value="Technology">Technology</option>
          <option value="Music">Music</option>
          <option value="Business">Business</option>
          <option value="Sports">Sports</option>
          <option value="Arts">Arts</option>
          <option value="Food">Food</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>
    </div>
  );
};

export default BasicDetailsForm;