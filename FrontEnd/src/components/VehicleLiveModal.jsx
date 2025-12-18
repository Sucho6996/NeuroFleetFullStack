import React from "react";

export default function VehicleLiveModal({ vehicle, onClose }) {
  if (!vehicle) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <h2>Vehicle Live Tracking</h2>

        <p><strong>Reg No:</strong> {vehicle.regNo}</p>
        <p><strong>Fuel:</strong> {vehicle.liveFuel}%</p>
        <p><strong>Speed:</strong> {vehicle.liveSpeed} km/h</p>

        <iframe
          title="vehicle-map"
          src={`https://maps.google.com/maps?q=${vehicle.liveLat},${vehicle.liveLon}&z=15&output=embed`}
        />

        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
}
