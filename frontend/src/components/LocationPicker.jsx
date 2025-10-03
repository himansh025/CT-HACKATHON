import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet’s default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ----------------------
// LocationMarker Component
// ----------------------
const LocationMarker = ({ position, onPositionChange, isReadOnly = false }) => {
  const map = useMapEvents({
    click(e) {
      if (!isReadOnly) {
        onPositionChange(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  if (!position || position[0] == null || position[1] == null) return null;

  return (
    <Marker position={position}>
      <Popup>
        <div className="text-sm">
          <strong>Selected Location</strong>
          <br />
          Lat: {position[0] != null ? position[0].toFixed(6) : 'N/A'}, 
          Lng: {position[1] != null ? position[1].toFixed(6) : 'N/A'}
        </div>
      </Popup>
    </Marker>
  );
};


// ----------------------
// Manual Input Component
// ----------------------
const ManualCoordinateInputs = ({ position, onChange }) => {
  const [lat, setLat] = useState(position?.lat || "");
  const [lng, setLng] = useState(position?.lng || "");

  useEffect(() => {
    setLat(position?.lat || "");
    setLng(position?.lng || "");
  }, [position]);

  return (
    <div className="mt-2 flex gap-2">
      <input
        type="number"
        step="0.000001"
        value={lat}
        onChange={(e) => {
          setLat(e.target.value);
          onChange({ lat: parseFloat(e.target.value), lng: parseFloat(lng) });
        }}
        placeholder="Latitude"
        className="border px-2 py-1 rounded w-1/2"
      />
      <input
        type="number"
        step="0.000001"
        value={lng}
        onChange={(e) => {
          setLng(e.target.value);
          onChange({ lat: parseFloat(lat), lng: parseFloat(e.target.value) });
        }}
        placeholder="Longitude"
        className="border px-2 py-1 rounded w-1/2"
      />
    </div>
  );
};

// ----------------------
// Main LocationPicker Component
// ----------------------
const LocationPicker = ({
  coordinates = null,
  onCoordinatesChange,
  height = '400px',
  zoom = 13,
  className = '',
  showManualInputs = true,
  isReadOnly = false, // <-- new prop
}) => {
  const [position, setPosition] = useState(null);
  const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });
  const [hasInteracted, setHasInteracted] = useState(false);

  const defaultCenter = [30.8886624, 75.7230126];

  useEffect(() => {
    if (coordinates && coordinates.lat != null && coordinates.lng != null) {
      setPosition([coordinates.lat, coordinates.lng]);
      setManualCoords({ lat: coordinates.lat.toString(), lng: coordinates.lng.toString() });
    } else if (!hasInteracted) {
      setPosition(defaultCenter);
      setManualCoords({ lat: defaultCenter[0].toString(), lng: defaultCenter[1].toString() });
    }
  }, [coordinates, hasInteracted]);

  const handlePositionChange = (latlng) => {
    if (!isReadOnly) {
      setHasInteracted(true);
      setPosition([latlng.lat, latlng.lng]);
      setManualCoords({ lat: latlng.lat.toString(), lng: latlng.lng.toString() });
      onCoordinatesChange({ lat: latlng.lat, lng: latlng.lng });
    }
  };

  const handleManualCoordinateChange = (type, value) => {
    if (isReadOnly) return;
    const newManualCoords = { ...manualCoords, [type]: value };
    setManualCoords(newManualCoords);

    const latValue = parseFloat(newManualCoords.lat);
    const lngValue = parseFloat(newManualCoords.lng);

    if (!isNaN(latValue) && !isNaN(lngValue)) {
      setHasInteracted(true);
      setPosition([latValue, lngValue]);
      onCoordinatesChange({ lat: latValue, lng: lngValue });
    }
  };

  const currentPosition = position || defaultCenter;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div style={{ height }} className="relative">
          <MapContainer center={currentPosition} zoom={zoom} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              position={currentPosition}
              onPositionChange={handlePositionChange}
              isReadOnly={isReadOnly}
            />
          </MapContainer>
        </div>
      </div>

      {!isReadOnly && showManualInputs && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Manual Coordinates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="number"
              step="any"
              value={manualCoords.lat}
              onChange={(e) => handleManualCoordinateChange('lat', e.target.value)}
              placeholder="Latitude"
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              step="any"
              value={manualCoords.lng}
              onChange={(e) => handleManualCoordinateChange('lng', e.target.value)}
              placeholder="Longitude"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};


export default LocationPicker;
