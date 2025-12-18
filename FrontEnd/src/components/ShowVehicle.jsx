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

  // ---------------------------------------
// DELETE VEHICLE
// ---------------------------------------
const deleteVehicle = async (regNo) => {
  const confirmDel = window.confirm(`Are you sure you want to delete ${regNo}?`);
  if (!confirmDel) return;

  try {
    const res = await fetch(
      `http://localhost:8081/fleetManager/deleteVehicle?regNo=${regNo}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (res.ok) {
      alert("Vehicle deleted successfully!");
      loadVehicles();  // refresh list
      fetchDashboardData(); // update stats
    } else {
      alert("Failed to delete vehicle");
    }
  } catch (e) {
    console.error(e);
    alert("Error deleting vehicle");
  }
};


  return (
    <div className="show-vehicle-container">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <h2>Vehicle Details</h2>

      <div className="details-card">
        <h3>Vehicle Information</h3>
        <p><strong>Registration No:</strong> {vehicle.regNo}</p>
        <p><strong>Name:</strong> {vehicle.name}</p>
        <p><strong>Type:</strong> {vehicle.type}</p>
        <p><strong>Fuel:</strong> {vehicle.fuel}%</p>
        <p><strong>Driver:</strong> {vehicle.driverName}</p>
        <p><strong>Contact:</strong> {vehicle.driverContact}</p>
        <p><strong>Location:</strong> {vehicle.location}</p>
      </div>

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
