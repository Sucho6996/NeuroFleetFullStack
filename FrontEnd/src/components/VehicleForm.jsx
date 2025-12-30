import React, { useState } from "react";
import "../styles/vehicleForm.css";

export default function VehicleForm({ onSuccess }) {
  const [regNo, setRegNo] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [fuel, setFuel] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [licenseNo, setLicenseNo] = useState("");

  // 🔥 NEW FIELDS ONLY
  const [engineTemp, setEngineTemp] = useState("");
  const [tireWear, setTireWear] = useState("");
  const [batteryHealth, setBatteryHealth] = useState("");
  const [fuelEfficiency, setFuelEfficiency] = useState("");
  const [distanceCovered, setDistanceCovered] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const vehicleData = {
      regNo,
      name,
      location,
      fuel: parseFloat(fuel),
      type,
      status,
      licenseNo,

      // 🔥 NEW PROPERTIES SENT TO BACKEND
      engineTemp: parseFloat(engineTemp),
      tireWear: parseFloat(tireWear),
      batteryHealth: parseFloat(batteryHealth),
      fuelEfficiency: parseFloat(fuelEfficiency),
      distanceCovered: parseFloat(distanceCovered)
    };

    try {
      const res = await fetch("http://localhost:8081/fleetManager/addVehicle", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(vehicleData)
      });

      if (res.ok) {
        alert("Vehicle added successfully!");

        // Clear input fields
        setRegNo("");
        setName("");
        setLocation("");
        setFuel("");
        setType("");
        setStatus("");
        setLicenseNo("");

        // 🔥 RESET NEW FIELDS
        setEngineTemp("");
        setTireWear("");
        setBatteryHealth("");
        setFuelEfficiency("");
        setDistanceCovered("");

        if (onSuccess) onSuccess();
      } else {
        alert("Failed to add vehicle");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while adding vehicle");
    }
  };

  return (
    <div className="vehicle-form-container">
      <h2>Add Vehicle</h2>

      <form className="vehicle-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Registration Number"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Vehicle Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Fuel (%)"
          value={fuel}
          onChange={(e) => setFuel(e.target.value)}
          min="0"
          max="100"
          required
        />

        <input
          type="text"
          placeholder="Vehicle Type (Truck, Van, Car...)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Status (In Use, Idle)"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Driver License Number"
          value={licenseNo}
          onChange={(e) => setLicenseNo(e.target.value)}
          required
        />

        {/* 🔥 NEW INPUT FIELDS ONLY */}
        <input
          type="number"
          placeholder="Engine Temperature (°C)"
          value={engineTemp}
          onChange={(e) => setEngineTemp(e.target.value)}
        />

        <input
          type="number"
          placeholder="Tire Wear (%)"
          value={tireWear}
          onChange={(e) => setTireWear(e.target.value)}
        />

        <input
          type="number"
          placeholder="Battery Health (%)"
          value={batteryHealth}
          onChange={(e) => setBatteryHealth(e.target.value)}
        />

        <input
          type="number"
          placeholder="Fuel Efficiency (km/l)"
          value={fuelEfficiency}
          onChange={(e) => setFuelEfficiency(e.target.value)}
        />

        <input
          type="number"
          placeholder="Mileage (km)"
          value={distanceCovered}
          onChange={(e) => setDistanceCovered(e.target.value)}
        />

        <button type="submit" className="vehicle-btn">
          Add Vehicle
        </button>
      </form>
    </div>
  );
}
