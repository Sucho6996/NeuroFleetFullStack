import React from "react";
import "../styles/Dashboard.css";

export default function CustomerDashboard({ data }) {
  return (
    <div className="dashboard-wrapper">

      <h2 className="dashboard-title">Customer Dashboard</h2>

      <div className="dashboard-grid">
        <div className="card-box">Active Bookings: 2</div>
        <div className="card-box">Total Trips: 38</div>
        <div className="card-box">Total Spent: ₹21,500</div>
        <div className="card-box">Amount Saved: ₹3,200</div>
        <div className="card-box">Upcoming Trips: 1</div>
        <div className="card-box">Favorite Routes: 4</div>
      </div>
    </div>
  );
}
