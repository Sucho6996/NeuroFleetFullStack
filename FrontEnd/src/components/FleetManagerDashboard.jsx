import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import VehicleForm from "./VehicleForm";

export default function FleetManagerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [myLocation, setMyLocation] = useState({ lat: null, lon: null });

  const [stats, setStats] = useState({
    activeVehicles: 0,
    totalFleetSize: 0,
    activeTrips: 12,
    completedTrips: 4500,
    activeDrivers: 18,
    weeklyRevenue: 150000
  });

  const token = localStorage.getItem("token");

  /* ---------------------------------------
     TAB EFFECTS
  --------------------------------------- */
  useEffect(() => {
    if (activeTab === "overview") fetchDashboardData();
    if (activeTab === "seeVehicles") loadVehicles();
    if (activeTab === "myLocation") getMyLocation();
  }, [activeTab]);

  /* ---------------------------------------
     LOAD DASHBOARD STATS
  --------------------------------------- */
  const fetchDashboardData = async () => {
    try {
      const res = await fetch(
        "http://localhost:8081/fleetManager/seeVehicles",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const list = await res.json();

      setStats({
        activeVehicles: list.length,
        totalFleetSize: list.length,
        activeTrips: 12,
        completedTrips: 4500,
        activeDrivers: 18,
        weeklyRevenue: 150000
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------------------------------
     LOAD VEHICLES
  --------------------------------------- */
  const loadVehicles = async () => {
    try {
      const res = await fetch(
        "http://localhost:8081/fleetManager/seeVehicles",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const list = await res.json();
      setVehicles(list);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------------------------------
     MY LOCATION
  --------------------------------------- */
  const getMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
      },
      () => alert("Location access denied")
    );
  };

  /* ---------------------------------------
     VEHICLE CLICK → DUMMY LIVE DATA
  --------------------------------------- */
  const handleVehicleClick = (vehicle) => {
    const lat = 22.5726 + Math.random() / 100; // dummy area
    const lon = 88.3639 + Math.random() / 100;

    setSelectedVehicle({
      ...vehicle,
      liveLat: lat,
      liveLon: lon,
      liveFuel: Math.floor(Math.random() * 40) + 40,
      liveSpeed: Math.floor(Math.random() * 60) + 20
    });
  };

  /* ---------------------------------------
     DELETE VEHICLE
  --------------------------------------- */
  const deleteVehicle = async (regNo) => {
    const confirmDel = window.confirm(
      `Are you sure you want to delete ${regNo}?`
    );
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
        loadVehicles();
        fetchDashboardData();
      } else {
        alert("Failed to delete vehicle");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting vehicle");
    }
  };

  /* ---------------------------------------
     RENDER
  --------------------------------------- */
  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-title">FLEET MANAGER DASHBOARD</h2>

      {/* TABS */}
      <div className="tab-wrapper">
        <div className="tab-button-row">
          <button
            className={activeTab === "overview" ? "active-tab" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>

          <button
            className={activeTab === "addVehicle" ? "active-tab" : ""}
            onClick={() => setActiveTab("addVehicle")}
          >
            Add Vehicle
          </button>

          <button
            className={activeTab === "seeVehicles" ? "active-tab" : ""}
            onClick={() => setActiveTab("seeVehicles")}
          >
            See Vehicles
          </button>

          <button
            className={activeTab === "myLocation" ? "active-tab" : ""}
            onClick={() => setActiveTab("myLocation")}
          >
            My Location
          </button>
        </div>
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="dashboard-grid">
          <div className="card-box">Active Vehicles: {stats.activeVehicles}</div>
          <div className="card-box">Total Fleet Size: {stats.totalFleetSize}</div>
          <div className="card-box">Active Trips: {stats.activeTrips}</div>
          <div className="card-box">Completed Trips: {stats.completedTrips}</div>
          <div className="card-box">Active Drivers: {stats.activeDrivers}</div>
          <div className="card-box">Weekly Revenue: ₹{stats.weeklyRevenue}</div>
        </div>
      )}

      {/* ADD VEHICLE */}
      {activeTab === "addVehicle" && (
        <div className="form-box">
          <VehicleForm onSuccess={loadVehicles} />
        </div>
      )}

      {/* SEE VEHICLES */}
      {activeTab === "seeVehicles" && (
        <div className="vehicle-list">
          <div className="vehicle-grid">
            {vehicles.map((v) => (
              <div
                key={v.regNo}
                className="vehicle-card"
                onClick={() => handleVehicleClick(v)}
              >
                <h3 className="vehicle-title">{v.regNo}</h3>
                <p className="vehicle-sub">
                  {v.name} ({v.type})
                </p>
                <p><strong>Driver:</strong> {v.driverName}</p>
                <p><strong>Fuel:</strong> {v.fuel}%</p>

                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteVehicle(v.regNo);
                  }}
                >
                  Delete Vehicle
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MY LOCATION */}
      {activeTab === "myLocation" && (
        <div className="location-box">
          <h3>My Current Location</h3>

          {myLocation.lat ? (
            <>
              <p>Latitude: {myLocation.lat}</p>
              <p>Longitude: {myLocation.lon}</p>

              <iframe
                title="my-map"
                width="100%"
                height="350"
                style={{ borderRadius: "10px", marginTop: "10px" }}
                src={`https://maps.google.com/maps?q=${myLocation.lat},${myLocation.lon}&z=15&output=embed`}
              />
            </>
          ) : (
            <p>Fetching location...</p>
          )}
        </div>
      )}

      {/* ===============================
          VEHICLE LIVE TRACKING POPUP
      =============================== */}
      {selectedVehicle && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Vehicle Live Tracking</h2>

            <p><strong>Reg No:</strong> {selectedVehicle.regNo}</p>
            <p><strong>Fuel:</strong> {selectedVehicle.liveFuel}%</p>
            <p><strong>Speed:</strong> {selectedVehicle.liveSpeed} km/h</p>

            <iframe
              title="vehicle-map"
              src={`https://maps.google.com/maps?q=${selectedVehicle.liveLat},${selectedVehicle.liveLon}&z=15&output=embed`}
            />

            <button
              className="modal-close-btn"
              onClick={() => setSelectedVehicle(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
