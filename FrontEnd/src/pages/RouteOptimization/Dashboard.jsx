import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import DashboardCard from "../../components/DashboardCard";
import { 
  Route, 
  MapPin, 
  Clock, 
  Car, 
  TrendingUp,
  AlertCircle,
  Activity
} from "lucide-react";

// Get current user role
const getCurrentRole = () => {
  const role = localStorage.getItem("role")?.toLowerCase();
  if (role === "fleet_manager" || role === "fleetmanager") return "fleet_manager";
  return role || "";
};

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const RouteOptimizationDashboard = () => {
  const navigate = useNavigate();
  const currentRole = getCurrentRole();
  const isCustomer = currentRole === "customer";
  const [mapCenter] = useState([23.2599, 77.4126]); // Bhopal coordinates

  const stats = [
    {
      title: "Active Vehicles",
      value: "127",
      change: "+12 today",
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Current ETA",
      value: "14 min",
      change: "Avg delivery time",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Traffic Status",
      value: "Moderate",
      change: "Normal conditions",
      icon: Activity,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      title: "Optimized Routes",
      value: "89",
      change: "This week",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Route Optimization Dashboard
          </h1>
          <p className="text-slate-600 mt-1">
            AI-powered routing & load optimization system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-6 shadow-sm hover:shadow-md transition`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <h3 className={`text-2xl font-bold ${stat.color} mt-1`}>
                    {stat.value}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} bg-white/50`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Preview */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <MapPin className="text-green-600" size={24} />
                  Map Overview
                </h2>
              <p className="text-slate-600 mt-1">Live fleet locations and active routes</p>
            </div>
            <div className="h-96">
              <MapContainer
                center={mapCenter}
                zoom={12}
                className="h-full w-full"
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={mapCenter}>
                  <Popup>Fleet Operations Center</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {/* Plan Route - Only for Customers */}
                {isCustomer && (
                  <button
                    onClick={() => navigate("/routes/plan")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <Route size={20} />
                    Plan Route
                  </button>
                )}
                {/* Load Optimization - Only for Customers & Admins */}
                {isCustomer && currentRole !== "fleet_manager" && (
                  <button
                    onClick={() => navigate("/routes/load-optimization")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <Car size={20} />
                    Optimize Load
                  </button>
                )}
                <button
                  onClick={() => navigate("/routes/traffic-analytics")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                >
                  <Activity size={20} />
                  Traffic Analytics
                </button>
                {/* Live Tracking - Only for Drivers */}
                {currentRole === "driver" && (
                  <button
                    onClick={() => navigate("/routes/live-tracking")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <MapPin size={20} />
                    Live Tracking
                  </button>
                )}
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Traffic Alert</h4>
                  <p className="text-sm text-yellow-800">
                    High traffic expected on Route 7 between 5-7 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Module Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Plan Route - Only for Customers */}
            {isCustomer && (
              <button
                onClick={() => navigate("/routes/plan")}
                className="p-4 border border-slate-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition text-left"
              >
                <div className="font-semibold text-slate-900">Plan Route</div>
                <div className="text-sm text-slate-600 mt-1">Trip planning</div>
              </button>
            )}
            <button
              onClick={() => navigate("/routes/visualize")}
              className="p-4 border border-slate-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition text-left"
            >
              <div className="font-semibold text-slate-900">Visualize</div>
              <div className="text-sm text-slate-600 mt-1">Map view</div>
            </button>
            <button
              onClick={() => navigate("/routes/comparison")}
              className="p-4 border border-slate-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition text-left"
            >
              <div className="font-semibold text-slate-900">Compare</div>
              <div className="text-sm text-slate-600 mt-1">Route options</div>
            </button>
            <button
              onClick={() => navigate("/routes/history")}
              className="p-4 border border-slate-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition text-left"
            >
              <div className="font-semibold text-slate-900">History</div>
              <div className="text-sm text-slate-600 mt-1">Reports & analytics</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimizationDashboard;

