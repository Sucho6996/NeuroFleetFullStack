import React from "react";
import "../styles/Dashboard.css";

export default function DriverDashboard({ data }) {
  return (
    <div className="dashboard-wrapper">

      <h2 className="dashboard-title">Driver Dashboard</h2>

      <div className="dashboard-grid">
        <div className="card-box">Today's Trips: 5</div>
        <div className="card-box">Today's Earnings: ₹1200</div>
        <div className="card-box">Distance Covered: 78 km</div>
        <div className="card-box">Driver Rating: ⭐⭐⭐⭐☆ (4.0)</div>
        <div className="card-box">Completed Trips: 820</div>
        <div className="card-box">Acceptance Rate: 92%</div>
      </div>
    </div>
  );
}
