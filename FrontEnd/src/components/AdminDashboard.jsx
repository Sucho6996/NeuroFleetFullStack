import React from "react";
import "../styles/Dashboard.css";

export default function AdminDashboard({ data }) {
  return (
    <div className="dashboard-wrapper">

      <h2 className="dashboard-title">Admin Dashboard</h2>

      <div className="dashboard-grid">
        <div className="card-box">Total Users: 1250</div>
        <div className="card-box">Total Fleets: 320</div>
        <div className="card-box">Total Bookings: 9800</div>
        <div className="card-box">Active Users: 860</div>
        <div className="card-box">Completed Trips: 7540</div>
        <div className="card-box">Total Revenue: ₹4,50,00,000</div>
      </div>
    </div>
  );
}
