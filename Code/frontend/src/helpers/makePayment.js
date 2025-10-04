  // Razorpay payment handler

import axiosInstance from "../config/apiconfig";
 const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

export  const   makePayment = (booking,razorpayOrder,onSuccess) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "Event Booking",
      description: "Ticket Payment",
      order_id: razorpayOrder.id,
      handler: async function (response) {
      // console.log("res",response);
      console.log(booking);
        try {
          const verifyResponse = await axiosInstance.post("/booking/verify/payment", {
              booking_id: booking._id,
              order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (verifyResponse.data.success) {
             if (onSuccess) onSuccess();
          } else {
            alert("Payment verification failed!");
          }
        } catch (err) {
          console.error("Verification error:", err);
        }
      },
      prefill: {
        name: booking.attendeeInfo?.name,
        email: booking.attendeeInfo?.email,
        contact: booking.attendeeInfo?.phoneNo,
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
