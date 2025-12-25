import React, { useState } from "react";
import "../styles/Dashboard.css";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";

/* -------------------------
   LEAFLET ICON FIX
-------------------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  /* -------------------------
     BOOK CAB STATE
  -------------------------- */
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);

  /* -------------------------
     DASHBOARD STATS
  -------------------------- */
  const stats = {
    activeBookings: 2,
    totalTrips: 38,
    totalSpent: 21500,
    amountSaved: 3200,
    upcomingTrips: 1,
    favoriteRoutes: 4
  };

  /* -------------------------
     SAFE GEOCODING
  -------------------------- */
  const geocode = async (place) => {
    if (!place || place.trim() === "") {
      alert("Please enter a valid location");
      return null;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        place
      )}`
    );

    const data = await res.json();

    if (!data || data.length === 0) {
      alert(`Location not found: ${place}`);
      return null;
    }

    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  };

  /* -------------------------
     FETCH ROUTE (SAFE)
  -------------------------- */
  const fetchRoute = async () => {
    try {
      const src = await geocode(source);
      const dest = await geocode(destination);

      if (!src || !dest) return;

      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${src[1]},${src[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`
      );

      const data = await res.json();

      if (!data.routes || data.routes.length === 0) {
        alert("No route found between these locations");
        return;
      }

      const coords = data.routes[0].geometry.coordinates.map(
        ([lon, lat]) => [lat, lon]
      );

      setRoute(coords);
      setDistance((data.routes[0].distance / 1000).toFixed(2));
      setTime((data.routes[0].duration / 60).toFixed(0));
    } catch (err) {
      console.error(err);
      alert("Error fetching route. Please try again.");
    }
  };

  /* -------------------------
     RENDER
  -------------------------- */
  return (
    <div className="dashboard-wrapper">
      <h2
        className="dashboard-title"
        style={{ marginTop: "350px", color: "white" }}
      >
        CUSTOMER DASHBOARD
      </h2>

      {/* TABS */}
      <div className="tab-wrapper">
        <div className="tab-button-row">
          {["overview", "myTrips", "bookCab"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active-tab" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.replace(/^\w/, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="dashboard-grid">
          <div className="card-box">
            Active Bookings: {stats.activeBookings}
          </div>
          <div className="card-box">Total Trips: {stats.totalTrips}</div>
          <div className="card-box">
            Total Spent: ₹{stats.totalSpent}
          </div>
          <div className="card-box">
            Amount Saved: ₹{stats.amountSaved}
          </div>
          <div className="card-box">
            Upcoming Trips: {stats.upcomingTrips}
          </div>
          <div className="card-box">
            Favorite Routes: {stats.favoriteRoutes}
          </div>
        </div>
      )}

      {/* MY TRIPS */}
      {activeTab === "myTrips" && (
        <div className="form-box">
          <h3 style={{ color: "white" }}>My Trips (Coming Soon)</h3>
        </div>
      )}

      {/* BOOK CAB */}
      {activeTab === "bookCab" && (
        <div className="form-box" style={{ width: "90%", margin: "auto" }}>
          <h3 style={{ color: "white" }}>🚕 Book a Cab</h3>

          <div className="book-cab-form">
            <input
              placeholder="Enter Source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />

            <input
              placeholder="Enter Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />

          <button onClick={fetchRoute}>Show Route</button>
        </div>

          {distance && (
            <p style={{ color: "white" }}>
              Distance: {distance} km | Estimated Time: {time} mins
            </p>
          )}

          <MapContainer
            center={[22.5726, 88.3639]}
            zoom={12}
            style={{ height: "400px", marginTop: "20px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {route.length > 0 && (
              <>
                <Polyline positions={route} />
                <Marker position={route[0]} />
                <Marker position={route[route.length - 1]} />
              </>
            )}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
