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
const LocationMarker = ({ position, onPositionChange, isReadOnly }) => {
  const map = useMapEvents(
    isReadOnly
      ? {} // ❌ no click events in read-only mode
      : {
          click(e) {
            onPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng });
            map.flyTo(e.latlng, map.getZoom());
          },
        }
  );

  if (!position) return null;

  return (
    <Marker
      position={position}
      draggable={!isReadOnly} // ✅ draggable only when not read-only
      eventHandlers={
        isReadOnly
          ? {}
          : {
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                onPositionChange({ lat, lng });
              },
            }
      }
    >
      <Popup>
        <strong>Selected Location</strong>
        <br />
        Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
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
  height = "400px",
  zoom = 13,
  className = "",
  showManualInputs = true,
  isReadOnly = false, // ✅ controls if map is editable or locked
}) => {
  const [currentPosition, setCurrentPosition] = useState(coordinates);

  useEffect(() => {
    if (coordinates) {
      setCurrentPosition(coordinates);
    }
  }, [coordinates]);

  const handlePositionChange = (pos) => {
    setCurrentPosition(pos);
    onCoordinatesChange?.(pos);
  };

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={currentPosition || [20.5937, 78.9629]} // default India center
        zoom={zoom}
        style={{ height, width: "100%" }}
        scrollWheelZoom={!isReadOnly} // ❌ disable zoom on scroll in read-only
        dragging={!isReadOnly} // ❌ disable dragging in read-only
        doubleClickZoom={!isReadOnly} // ❌ disable zoom by dbl click
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={currentPosition}
          onPositionChange={handlePositionChange}
          isReadOnly={isReadOnly}
        />
      </MapContainer>

      {showManualInputs && !isReadOnly && (
        <ManualCoordinateInputs position={currentPosition} onChange={handlePositionChange} />
      )}
    </div>
  );
};

export default LocationPicker;
