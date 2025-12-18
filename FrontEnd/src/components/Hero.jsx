import React, { useEffect, useState } from "react";
import "../styles/hero.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import AdminDashboard from "./AdminDashboard";
import FleetManagerDashboard from "./FleetManagerDashboard";
import DriverDashboard from "./DriverDashboard";
import CustomerDashboard from "./CustomerDashboard";

// Fix Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png"
});

export default function Hero({ showProfile }) {
  const [profile, setProfile] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [coords, setCoords] = useState(null);

  // -----------------------------------------
  // Load user profile from localStorage
  // -----------------------------------------
  useEffect(() => {
    const userProfile = {
      role: localStorage.getItem("role"),
      name: localStorage.getItem("name") || "User",
      email: localStorage.getItem("email") || "unknown@example.com"
    };

    setProfile(userProfile);
  }, []);

  // -----------------------------------------
  // Fetch IPStack Location
  // -----------------------------------------
  const fetchLocation = async () => {
    const API_KEY = "bddd6871ba8b9f4f38c82d7843c1e309"; // your API key

    try {
      const res = await fetch(
        `http://api.ipstack.com/check?access_key=${API_KEY}`
      );
      const data = await res.json();

      setCoords({
        lat: data.latitude,
        lng: data.longitude
      });

      setShowMap(true);
    } catch (err) {
      alert("Failed to fetch location!");
      console.log(err);
    }
  };

  // -----------------------------------------
  // Render correct dashboard
  // -----------------------------------------
  const renderDashboard = () => {
    if (!profile?.role) return <p>Loading...</p>;

    switch (profile.role) {
      case "Admin":
        return <AdminDashboard />;

      case "Fleet Manager":
        return <FleetManagerDashboard />;

      case "Driver":
        return <DriverDashboard />;

      case "Customer":
        return <CustomerDashboard />;

      default:
        return <p>No dashboard found</p>;
    }
  };

  return (
    <div className="hero-container"
    /* style={{marginTop:"100px"}}*/>

     

      {/* -----------------------------------------
                MAP POPUP
      ----------------------------------------- */}
      {showMap && coords && (
        <div className="map-wrapper">
          <div className="map-card">

            <button className="close-map-btn" onClick={() => setShowMap(false)}>
              ✖
            </button>

            <h3>Your Current Location</h3>

            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={13}
              style={{ height: "300px", width: "100%", borderRadius: "10px"}}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>You are here!</Popup>
              </Marker>
            </MapContainer>

          </div>
        </div>
      )}

      {/* -----------------------------------------
                PROFILE OR DASHBOARD
      ----------------------------------------- */}
      {showProfile ? (
        <div className="profile-box">
          <h2>Welcome, {profile?.name} 🎉</h2>
          <p>Email: {profile?.email}</p>
          <p>Role: {profile?.role}</p>
        </div>
      ) : (
        renderDashboard()
      )}
    </div>
  );
}
