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
      licenseNo
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
          step="any"
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
          placeholder="Status(In Use,Idle)"
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

        <button type="submit" className="vehicle-btn">
          Add Vehicle
        </button>
      </form>
    </div>
  );
}
