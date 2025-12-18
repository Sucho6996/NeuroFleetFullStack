import React, { useState, useEffect } from "react";
import "../styles/header.css";
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
/>


export default function Header({ setLoggedIn }) {
  const [open, setOpen] = useState(false);
  const [showProfileBox, setShowProfileBox] = useState(false);
  const [profile, setProfile] = useState(null);

  const PROFILE_URLS = {
    "Customer": "http://localhost:8080/user/profile",
    "Driver": "http://localhost:8082/driver/profile",
    "Fleet Manager": "http://localhost:8081/fleetManager/profile",
    "Admin": "http://localhost:8083/admin/profile",
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || !role) return;

    const url = PROFILE_URLS[role];

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      const data = await res.json();
      setProfile(data);
    }
  };

  const handleProfileToggle = () => {
    if (!showProfileBox) fetchProfile();  // load profile only when opening
    setShowProfileBox(!showProfileBox);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <header>
      <a href="/" className="logo">
        NeuroFleet.
      </a>

      <ul className={`nav ${open ? "nav-open" : ""}`}>
        <li><a href="#"><i className="bi bi-house-fill"></i></a></li>
        <li><a href="#">Gifts</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>

        {/* PROFILE BUTTON */}
        <li>
          <button
            className={`profile-btn ${showProfileBox ? "active" : ""}`}
            onClick={handleProfileToggle}
          >
            Profile
          </button>

          {showProfileBox && profile && (
            <div className="profile-dropdown">
              <p><b>Name:</b><strong>{profile.name}</strong></p>
              <p><b>Email:</b>{profile.email}</p>
              <p><b>Role:</b>{profile.role}</p>

              {profile.role?.toLowerCase() === "customer" && (
                <p>Aadhar: {profile.adharNo}</p>
              )}
              {profile.role?.toLowerCase() === "driver" && (
                <p><b>License No:</b> {profile.licenceNumber}</p>
              )}
              {profile.role?.toLowerCase() === "fleet manager" && (
                <p>Company: {profile.companyName}</p>
              )}
              {profile.role?.toLowerCase() === "admin" && (
                <p>Reg No: {profile.registrationNo}</p>
              )}
            </div>
          )}
        </li>

        {/* LOGOUT BUTTON */}
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>

      {/* Mobile Menu Icon */}
      {open ? (
        <a href="#" className="menu-icon" onClick={() => setOpen(false)}>
          <i className="bi bi-x-lg"></i>
        </a>
      ) : (
        <a href="#" className="menu-icon" onClick={() => setOpen(true)}>
          <i className="bi bi-list"></i>
        </a>
      )}
    </header>
  );
}
