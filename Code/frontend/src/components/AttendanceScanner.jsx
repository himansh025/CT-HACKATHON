// src/components/AttendanceScanner.jsx
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
//import { QrReader } from "@blackbox-vision/react-qr-reader";
import axiosInstance from "../config/apiconfig";

const AttendanceScanner = ({ eventId, onClose }) => {
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState("");

  const handleScan = async (data) => {
    if (data) {
      try {
        const qrData = JSON.parse(data.text || data); // handle both text & object
        setScanResult(qrData);

        const res = await axiosInstance.post("/attendance/verify", {
          bookingId: qrData.bookingId,
          eventId,
        });

        setMessage(res.data.message || "Attendance marked successfully ✅");
      } catch (err) {
        console.error("Attendance error:", err);
        setMessage(
          err.response?.data?.message || "Invalid QR / Attendance failed ❌"
        );
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Scan Ticket QR</h2>

      <div className="w-full max-w-sm mx-auto">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (!!result) {
              handleScan(result);
            }
            if (!!error) {
              console.log(error);
            }
          }}
          style={{ width: "100%" }}
        />
      </div>

      {scanResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="font-medium">Booking ID: {scanResult.bookingId}</p>
          <p>User: {scanResult.userId}</p>
        </div>
      )}

      {message && (
        <div className="mt-3 text-sm font-medium text-green-600">{message}</div>
      )}
 
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Close Scanner
      </button>
    </div>
  );
};

export default AttendanceScanner;
