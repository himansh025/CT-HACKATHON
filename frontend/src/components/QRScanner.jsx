import React, { useState } from "react";
import { QrReader } from 'react-qr-reader';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [verified, setVerified] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  const handleScan = (result) => {
    if (result?.text && cameraActive) {
      const ticketId = result.text;
      setScanResult(ticketId);
      setVerified(true);
      setCameraActive(false);
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner Error:", error);
  };

  const scanNextTicket = () => {
    setScanResult("");
    setVerified(false);
    setCameraActive(true);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4">QR Ticket Scanner</h2>

      {/* QR Scanner */}
      {cameraActive ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={handleScan}
            onError={handleError}
            style={{ width: "100%" }}
          />
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-100 rounded-lg">
          <p className="text-gray-600">Scanner paused</p>
        </div>
      )}

      {/* Scanned Ticket */}
      {scanResult && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Scanned Ticket ID:</p>
          <p className="text-xs font-mono break-all">{scanResult}</p>
        </div>
      )}

      {/* Verification Result */}
      {verified && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-300 text-center">
          <h3 className="font-semibold text-green-800">✅ Ticket Verified</h3>
          <p className="mt-1 text-green-700">
            Ticket <span className="font-mono">{scanResult}</span> verified successfully.
          </p>

          <button
            onClick={scanNextTicket}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Scan Next Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
