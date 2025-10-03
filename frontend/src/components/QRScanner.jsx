// src/components/QRScanner.jsx
import React, { useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";

const QRScanner = ({ eventId, onClose }) => {
  const [result, setResult] = useState(null);
  const [verified, setVerified] = useState(false);
  const [scanning, setScanning] = useState(true);

  const handleScan = (scannedCode) => {
    if (!scanning || !scannedCode) return;

    setResult(scannedCode);
    setVerified(true);
    setScanning(false);
  };

  const scanNextTicket = () => {
    setResult(null);
    setVerified(false);
    setScanning(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Scan Ticket (Event ID: {eventId})
        </h2>

        {/* QR Scanner */}
        {scanning ? (
          <div className="flex justify-center">
            <BarcodeScanner
              width={300}
              height={300}
              onUpdate={(err, scanResult) => {
                if (scanResult?.text) {
                  handleScan(scanResult.text);
                }
              }}
            />
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-100 rounded-lg">
            <p className="text-gray-600">Scanner paused</p>
          </div>
        )}

        {/* Verification Status */}
        {verified && (
          <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-300 text-center">
            <h3 className="font-semibold text-green-800">✅ Ticket Verified</h3>
            <p className="mt-1 text-green-700 font-mono">{result}</p>

            <button
              onClick={scanNextTicket}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Scan Next Ticket
            </button>
          </div>
        )}

        {/* Last scanned ticket */}
        {!verified && result && (
          <p className="mt-2 text-xs text-gray-500 break-words">
            Last scanned ticket: {result}
          </p>
        )}
      </div>
    </div>
  );
};

export default QRScanner;