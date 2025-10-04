import {  useState } from "react";


const EventBooked = () => {
  const [orderStatus, setOrderStatus] = useState(false);


  return (
    <div className="w-full flex flex-col items-center p-6 bg-gray-50">
      {orderStatus && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600">🎉 Order Successful!</h2>
            <p className="text-gray-700 mt-3">Your booking has been confirmed.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventBooked;
