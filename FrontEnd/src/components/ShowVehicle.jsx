import React, { useEffect, useState } from "react";
import "../styles/showVehicle.css";

export default function ShowVehicle({ regNo, onBack }) {
  const [vehicle, setVehicle] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVehicle();
  }, [regNo]);

  const fetchVehicle = async () => {
    try {
      const res = await fetch(
        `http://localhost:8081/fleetManager/seeVehicle?regNo=${regNo}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await res.json();
      setVehicle(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load vehicle details");
    }
  };

  if (!vehicle) return <p>Loading...</p>;

  return (
    <div className="show-vehicle-container">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <h2>Vehicle Details</h2>

      {/* ---------------- VEHICLE INFO ---------------- */}
      <div className="details-card">
        <h3>Vehicle Information</h3>
        <p><strong>Registration No:</strong> {vehicle.regNo}</p>
        <p><strong>Name:</strong> {vehicle.name}</p>
        <p><strong>Type:</strong> {vehicle.type}</p>
        <p><strong>Status:</strong> {vehicle.status}</p>
        <p><strong>Fuel:</strong> {vehicle.fuel}%</p>
        <p><strong>Location:</strong> {vehicle.location}</p>
        <p><strong>License No:</strong> {vehicle.licenseNo}</p>
        <p><strong>Distance Covered:</strong> {vehicle.distanceCovered} km</p>
      </div>

      {/* ---------------- HEALTH METRICS ---------------- */}
      <div className="details-card">
        <h3>Vehicle Health</h3>
        <p><strong>Engine Temperature:</strong> {vehicle.engineTemp} °C</p>
        <p><strong>Tire Wear:</strong> {vehicle.tireWear}%</p>
        <p><strong>Battery Health:</strong> {vehicle.batteryHealth}%</p>
        <p><strong>Fuel Efficiency:</strong> {vehicle.fuelEfficiency} km/l</p>
      </div>

      {/* ---------------- DRIVER INFO ---------------- */}
      <div className="details-card">
        <h3>Driver Information</h3>

        {vehicle.driverName ? (
          <>
            <p><strong>Name:</strong> {vehicle.driverName}</p>
            <p><strong>Contact:</strong> {vehicle.driverContact}</p>
          </>
        ) : (
          <p>No driver assigned.</p>
        )}
      </div>
    </div>
  );
}
