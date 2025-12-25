import React, { useState, useEffect,useRef } from "react";
import "../styles/Dashboard.css";
import VehicleForm from "./VehicleForm";

export default function FleetManagerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [myLocation, setMyLocation] = useState({ lat: null, lon: null });
  const [alerts, setAlerts] = useState([]);
  const speedIntervalRef = useRef(null);
  const overspeedRef = useRef(false);
  const serviceAlertRef = useRef(false);


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
     DASHBOARD STATS
  --------------------------------------- */
  const fetchDashboardData = async () => {
    try {
      const res = await fetch(
        "http://localhost:8081/fleetManager/seeVehicles",
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
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
    } catch (e) {
      console.error(e);
    }
  };

  /* ---------------------------------------
     LOAD VEHICLES
  --------------------------------------- */
  const loadVehicles = async () => {
    try {
      const res = await fetch(
        "http://localhost:8081/fleetManager/seeVehicles",
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const list = await res.json();
      setVehicles(list);
    } catch (e) {
      console.error(e);
    }
  };

  /* ---------------------------------------
     MY LOCATION
  --------------------------------------- */
  const getMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setMyLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        }),
      () => alert("Location access denied")
    );
  };

  /* ---------------------------------------
     VEHICLE CLICK (LIVE DATA + ALERT)
  --------------------------------------- */
 const handleVehicleClick = async (vehicle) => {
  // 🚫 Do nothing if already out of fuel
  

  // clear previous interval
  if (speedIntervalRef.current) {
    clearInterval(speedIntervalRef.current);
  }

  const liveLat = 22.5726 + Math.random() / 100;
  const liveLon = 88.3639 + Math.random() / 100;

  let liveFuel = Math.max(
    vehicle.fuel - (Math.floor(Math.random() * 2) + 1),
    0
  );
  // 🔁 backend fuel update (initial)
  try {
    await fetch(
      `http://localhost:8081/fleetManager/updateVehicle?regNo=${vehicle.regNo}&fuel=${liveFuel}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (e) {
    console.error(e);
  }
  if (liveFuel <= 0) {
    setSelectedVehicle({
      ...vehicle,
      liveLat,
      liveLon,
      liveFuel: 0,
      liveSpeed: 0
    });

    setVehicles((prev) =>
      prev.map((v) =>
        v.regNo === vehicle.regNo
          ? { ...v, fuel: 0, status: "MAINTENANCE" }
          : v
      )
    );


    alert(`⛽ Vehicle ${vehicle.regNo} has no fuel. Cannot start.`);
    return;
  }


  let liveSpeed = Math.floor(Math.random() * 121);

  setSelectedVehicle({
    ...vehicle,
    liveLat,
    liveLon,
    liveFuel,
    liveSpeed
  });

  // 🔥 Optimistic fuel update
  setVehicles((prev) =>
    prev.map((v) =>
      v.regNo === vehicle.regNo ? { ...v, fuel: liveFuel } : v
    )
  );

  // 🚨 Service alert
  if (vehicle.distanceCovered >= 1000) {
    alert(`🚨 Servicing Needed for\nVehicle: ${vehicle.regNo}`);
  }

  // ⏱️ Speed simulation
  speedIntervalRef.current = setInterval(async () => {
    // ⛽ STOP if fuel finished
    if (liveFuel <= 0) {
      clearInterval(speedIntervalRef.current);
      speedIntervalRef.current = null;

      setSelectedVehicle((prev) => ({
        ...prev,
        liveSpeed: 0,
        liveFuel: 0
      }));

      return;
    }


    // simulate fuel burn
    //liveFuel = Math.max(liveFuel - 1, 0);
    liveSpeed = Math.floor(Math.random() * 121);

    setSelectedVehicle((prev) => ({
      ...prev,
      liveSpeed,
      liveFuel
    }));

    setVehicles((prev) =>
      prev.map((v) =>
        v.regNo === vehicle.regNo ? { ...v, fuel: liveFuel } : v
      )
    );

    // 🚨 Overspeed alert
    if (liveSpeed >= 100) {
      const alertObj = {
        id: Date.now(),
        regNo: vehicle.regNo,
        type: "Overspeeding",
        speed: liveSpeed,
        time: new Date().toDateString() + " " + new Date().toLocaleTimeString()
      };

      setAlerts((prev) => [alertObj, ...prev]);

      alert(
        `🚨 Overspeeding Alert!\nVehicle: ${vehicle.regNo}\nSpeed: ${liveSpeed} km/h`
      );

      try {
        await fetch("http://localhost:8081/fleetManager/overSpeeding", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            regNo: vehicle.regNo,
            time: alertObj.time,
            speed: String(liveSpeed)
          })
        });
      } catch (err) {
        console.error("Overspeeding API failed", err);
      }
    }
  }, 2000);

  
};

  /* ---------------------------------------
     DELETE VEHICLE
  --------------------------------------- */
  const deleteVehicle = async (regNo) => {
    if (!window.confirm(`Delete vehicle ${regNo}?`)) return;

    try {
      const res = await fetch(
        `http://localhost:8081/fleetManager/deleteVehicle?regNo=${regNo}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.ok) {
        loadVehicles();
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const closeModal = () => {
  if (speedIntervalRef.current) {
    clearInterval(speedIntervalRef.current);
    speedIntervalRef.current = null;
  }

  overspeedRef.current = false;
  serviceAlertRef.current = false;

  setSelectedVehicle(null);
};


  /* ---------------------------------------
     RENDER
  --------------------------------------- */
  return (
    <div className="dashboard-wrapper">
      <div><h2 className="dashboard-title"
      style={{marginTop:"350px",color:"white",position:"relative"}}
      >FLEET MANAGER DASHBOARD</h2></div>

      {/* ALERTS */}
      {/* {alerts.length > 0 && (
        <div className="alert-box">
          <h3>🚨 Active Alerts</h3>
          {alerts.map((a) => (
            <div key={a.id} className="alert-card">
              <strong>{a.regNo}</strong> — {a.type} ({a.speed} km/h) @ {a.time}
            </div>
          ))}
        </div>
      )} */}

      {/* TABS */}
      <div className="tab-wrapper">
        <div className="tab-button-row">
          {["overview", "addVehicle", "seeVehicles", "myLocation"].map((t) => (
            <button
              key={t}
              className={activeTab === t ? "active-tab" : ""}
              onClick={() => setActiveTab(t)}
            >
              {t.replace(/^\w/, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="dashboard-grid">
          <div className="card-box">Active Vehicles: {stats.activeVehicles}</div>
          <div className="card-box">Total Fleet Size: {stats.totalFleetSize}</div>
          <div className="card-box">Active Trips: {stats.activeTrips}</div>
          <div className="card-box">
            Completed Trips: {stats.completedTrips}
          </div>
          <div className="card-box">Active Drivers: {stats.activeDrivers}</div>
          <div className="card-box">
            Weekly Revenue: ₹{stats.weeklyRevenue}
          </div>
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
        <div className="vehicle-grid"
        style={{marginTop:"100px",paddingTop:"0px"}}>
          {vehicles.map((v) => (
            <div
              key={v.regNo}
              className={`vehicle-card ${
                v.status === "Maintenance" ? "disabled" : ""
              }`}
              onClick={() =>
                v.status !== "Maintenance" && handleVehicleClick(v)
              }
            >
              <h3>{v.regNo}</h3>
              <p>{v.name} ({v.type})</p>
              <p>Driver: {v.driverName}</p>
              <p>Fuel: {v.fuel}%</p>
              <p>Distance Travelled: {v.distanceCovered}</p>
              <p>Status: {v.status}</p>
              
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteVehicle(v.regNo);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MY LOCATION */}
      {activeTab === "myLocation" && (
        <div className="location-box">
          {myLocation.lat ? (
            <iframe
              title="my-map"
              src={`https://maps.google.com/maps?q=${myLocation.lat},${myLocation.lon}&z=15&output=embed`}
            />
          ) : (
            <p>Fetching location...</p>
          )}
        </div>
      )}

      {/* LIVE TRACKING MODAL */}
      {selectedVehicle && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Vehicle Live Tracking</h2>
            <p>Reg No: {selectedVehicle.regNo}</p>
            <p>Fuel: {selectedVehicle.liveFuel}%</p>
            <p>Speed: {selectedVehicle.liveSpeed} km/h</p>
            <iframe
              title="vehicle-map"
              src={`https://maps.google.com/maps?q=${selectedVehicle.liveLat},${selectedVehicle.liveLon}&z=15&output=embed`}
            />

            <button className="modal-close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
