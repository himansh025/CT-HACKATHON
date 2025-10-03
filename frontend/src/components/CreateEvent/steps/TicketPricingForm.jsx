import React from "react";

const TicketPricingForm = ({ register, errors, watch }) => {
  const generalPrice = watch("generalPrice");
  const generalQuantity = watch("generalQuantity");
  const vipPrice = watch("vipPrice");
  const vipQuantity = watch("vipQuantity");

  const generalRevenue = (parseFloat(generalPrice) || 0) * (parseInt(generalQuantity) || 0);
  const vipRevenue = (parseFloat(vipPrice) || 0) * (parseInt(vipQuantity) || 0);
  const totalRevenue = generalRevenue + vipRevenue;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Ticket Information</h3>
        <p className="text-sm text-blue-700">Set up your ticket types and pricing. At least one ticket type is required.</p>
      </div>

      {/* General Admission */}
      <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
        <h2 className="font-semibold text-lg mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">General Admission</span>
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Price (₹) *</label>
            <input
              type="number"
              step="0.01"
              {...register("generalPrice", {
                required: "General admission price is required",
                min: { value: 0, message: "Price cannot be negative" }
              })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 500"
            />
            {errors.generalPrice && <p className="text-red-500 text-sm mt-1">{errors.generalPrice.message}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Quantity *</label>
            <input
              type="number"
              {...register("generalQuantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Quantity must be at least 1" }
              })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 100"
            />
            {errors.generalQuantity && <p className="text-red-500 text-sm mt-1">{errors.generalQuantity.message}</p>}
          </div>
        </div>
        {generalRevenue > 0 && (
          <div className="mt-3 p-2 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Potential Revenue: <span className="font-semibold text-gray-900">₹{generalRevenue.toLocaleString()}</span></p>
          </div>
        )}
      </div>

      {/* VIP Section */}
      <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
        <h2 className="font-semibold text-lg mb-4 flex items-center">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm mr-2">VIP</span>
          <span className="text-sm text-gray-500 font-normal">(Optional)</span>
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Price (₹)</label>
            <input
              type="number"
              step="0.01"
              {...register("vipPrice", {
                min: { value: 0, message: "Price cannot be negative" }
              })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g. 1500"
            />
            {errors.vipPrice && <p className="text-red-500 text-sm mt-1">{errors.vipPrice.message}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              {...register("vipQuantity", {
                min: { value: 0, message: "Quantity cannot be negative" }
              })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g. 50"
            />
            {errors.vipQuantity && <p className="text-red-500 text-sm mt-1">{errors.vipQuantity.message}</p>}
          </div>
        </div>
        {vipRevenue > 0 && (
          <div className="mt-3 p-2 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Potential Revenue: <span className="font-semibold text-gray-900">₹{vipRevenue.toLocaleString()}</span></p>
          </div>
        )}
      </div>

      {/* Total Revenue */}
      {totalRevenue > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-green-900">Total Potential Revenue:</span>
            <span className="text-2xl font-bold text-green-700">₹{totalRevenue.toLocaleString()}</span>
          </div>
          <p className="text-sm text-green-600 mt-2">Based on full ticket sales</p>
        </div>
      )}
    </div>
  );
};

export default TicketPricingForm;