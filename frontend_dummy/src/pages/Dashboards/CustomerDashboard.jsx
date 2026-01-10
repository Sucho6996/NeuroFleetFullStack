// src/pages/customer/CustomerDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import DashboardCard from "../../components/DashboardCard";
import {
  CarTaxiFront,
  IndianRupee,
  Route,
  CalendarClock,
  Receipt,
  PiggyBank,
  MapPin,
} from "lucide-react";

// Fix Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

// Custom markers
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [srcCoord, setSrcCoord] = useState(null);
  const [destCoord, setDestCoord] = useState(null);
  
  // Geocoding function
  const geocode = async (place) => {
    if (!place || place.trim() === "") {
      alert("Please enter a valid location");
      return null;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
    );
    const data = await res.json();

    if (!data || data.length === 0) {
      alert(`Location not found: ${place}`);
      return null;
    }

    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  };

  // Fetch multiple routes
  const fetchRoute = async () => {
    try {
      const src = await geocode(source);
      const dest = await geocode(destination);

      if (!src || !dest) return;

      setSrcCoord(src);
      setDestCoord(dest);

      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${src[1]},${src[0]};${dest[1]},${dest[0]}?alternatives=true&overview=full&geometries=geojson`
      );

      const data = await res.json();

      if (!data.routes || data.routes.length === 0) {
        alert("No route found");
        return;
      }

      const colors = ["#0077ff", "#ff9800", "#9c27b0"];

      const processedRoutes = data.routes
        .map((r, index) => ({
          coords: r.geometry.coordinates.map(([lon, lat]) => [
            lat + index * 0.0003,
            lon + index * 0.0003,
          ]),
          distance: (r.distance / 1000).toFixed(2),
          time: r.duration / 60,
          color: colors[index] || "#666",
        }))
        .sort((a, b) => a.time - b.time)
        .map((r) => ({
          ...r,
          time: Math.round(r.time),
        }));

      setRoutes(processedRoutes);
    } catch (err) {
      console.error(err);
      alert("Error fetching routes");
    }
  };

  const kpiData = [
    {
      title: "Active Bookings",
      value: "2",
      change: "In Progress",
      icon: CarTaxiFront,
      color: "blue",
      bgColor: "bg-white",
    },
    {
      title: "Total Trips",
      value: "184",
      change: "+12 this month",
      icon: Route,
      color: "green",
      bgColor: "bg-white",
    },
    {
      title: "Total Spent",
      value: "₹42,500",
      change: "All time",
      icon: IndianRupee,
      color: "purple",
      bgColor: "bg-white",
    },
    {
      title: "Amount Saved",
      value: "₹3,200",
      change: "Via offers & loyalty",
      icon: PiggyBank,
      color: "orange",
      bgColor: "bg-white",
    },
    {
      title: "Upcoming Trips",
      value: "3",
      change: "Next 7 days",
      icon: CalendarClock,
      color: "purple",
      bgColor: "bg-white",
    },
    {
      title: "Favourite Route",
      value: "Home → Office",
      change: "68 trips",
      icon: MapPin,
      color: "green",
      bgColor: "bg-white",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Welcome back, Rohan!
            </h1>
            <p className="text-slate-600 mt-1">
              Here's your ride summary and upcoming trips
            </p>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpiData.map((stat) => (
              <DashboardCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={stat.icon}
                color={stat.color}
                bgColor={stat.bgColor}
              />
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex gap-2 mb-6">
              {["overview", "bookCab"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab
                      ? "bg-green-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab === "overview" ? "Overview" : "Book Cab"}
                </button>
              ))}
            </div>

            {/* Book Cab Tab */}
            {activeTab === "bookCab" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  🚕 Book a Cab
                </h3>

                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter Source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Enter Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={fetchRoute}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                  >
                    Show Routes
                  </button>
                </div>

                {/* Route Info */}
                {routes.length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    {routes.map((r, i) => (
                      <p key={i} className="text-slate-700">
                        {i === 0 ? "🚀 Fastest Route" : `🛣️ Alternative ${i}`} — {r.distance} km | {r.time} mins
                      </p>
                    ))}
                  </div>
                )}

                {/* Map */}
                {(srcCoord || routes.length > 0) && (
                  <div className="mt-4">
                    <MapContainer
                      center={srcCoord || [22.5726, 88.3639]}
                      zoom={14}
                      style={{ height: "400px", width: "100%" }}
                      className="rounded-lg border border-slate-200"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                      {routes.map((r, i) => (
                        <Polyline
                          key={i}
                          positions={r.coords}
                          pathOptions={{
                            color: r.color,
                            weight: i === 0 ? 6 : 4,
                            dashArray: i === 0 ? null : "8,8",
                            opacity: i === 0 ? 1 : 0.7,
                          }}
                        />
                      ))}

                      {srcCoord && <Marker position={srcCoord} icon={greenIcon} />}
                      {destCoord && <Marker position={destCoord} icon={redIcon} />}
                    </MapContainer>
                  </div>
                )}
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Route className="text-green-600" size={24} />
                      Plan Trip & Book Vehicle
                    </h3>
                    <p className="text-slate-600 mt-1">Plan your route and select from available vehicles</p>
                  </div>
                  <button
                    onClick={() => navigate("/booking")}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
                  >
                    Plan & Book
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Optional: Recent Activity or Upcoming Trips Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">
              Upcoming Trips
            </h3>
            <div className="space-y-4">
              {/* Placeholder for real upcoming trips */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <CarTaxiFront size={20} className="text-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Home → Office</p>
                    <p className="text-sm text-slate-600">Tomorrow, 8:30 AM</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-700">Sedan • ₹420</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <CarTaxiFront size={20} className="text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Airport Drop</p>
                    <p className="text-sm text-slate-600">Jan 12, 6:00 PM</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-700">SUV • ₹1,250</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;