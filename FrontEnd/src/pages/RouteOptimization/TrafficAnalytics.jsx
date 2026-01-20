import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Activity, AlertTriangle, TrendingUp, Clock, MapPin } from "lucide-react";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const TrafficAnalytics = () => {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState("now");

  const trafficZones = [
    {
      id: 1,
      center: [23.2628, 77.4168],
      radius: 500,
      level: "HIGH",
      density: 85,
      color: "#dc2626",
      alerts: ["Heavy congestion", "Peak hour traffic"],
    },
    {
      id: 2,
      center: [23.2610, 77.4145],
      radius: 400,
      level: "MEDIUM",
      density: 55,
      color: "#f97316",
      alerts: ["Moderate traffic"],
    },
    {
      id: 3,
      center: [23.2650, 77.4200],
      radius: 350,
      level: "LOW",
      density: 25,
      color: "#16a34a",
      alerts: [],
    },
    {
      id: 4,
      center: [23.2580, 77.4100],
      radius: 450,
      level: "HIGH",
      density: 90,
      color: "#dc2626",
      alerts: ["Road construction", "Lane closure"],
    },
  ];

  const peakHours = [
    { hour: "08:00", density: 75, label: "Morning Peak" },
    { hour: "12:00", density: 45, label: "Lunch Time" },
    { hour: "17:00", density: 85, label: "Evening Peak" },
    { hour: "20:00", density: 60, label: "Night Rush" },
  ];

  const congestionAlerts = [
    {
      id: 1,
      type: "HIGH",
      location: "MP Nagar - Hoshangabad Road",
      message: "Heavy congestion expected between 5-7 PM",
      time: "Next 2 hours",
    },
    {
      id: 2,
      type: "MEDIUM",
      location: "New Market - Station Road",
      message: "Moderate traffic due to event",
      time: "Next 1 hour",
    },
    {
      id: 3,
      type: "BLOCK",
      location: "Kolar Road",
      message: "Road block reported - use alternate route",
      time: "Active now",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <Activity className="text-green-600" size={32} />
                Traffic & Congestion Analytics
              </h1>
              <p className="text-slate-600 text-lg">
                Real-time traffic intelligence and AI insights
              </p>
            </div>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <option value="now">Live Now</option>
              <option value="1h">Next 1 Hour</option>
              <option value="3h">Next 3 Hours</option>
              <option value="today">Today</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-700">High Traffic Zones</div>
                <div className="text-3xl font-bold text-red-900">
                  {trafficZones.filter((z) => z.level === "HIGH").length}
                </div>
              </div>
              <AlertTriangle className="text-red-600" size={32} />
            </div>
          </div>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-orange-700">Medium Traffic</div>
                <div className="text-3xl font-bold text-orange-900">
                  {trafficZones.filter((z) => z.level === "MEDIUM").length}
                </div>
              </div>
              <Activity className="text-orange-600" size={32} />
            </div>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-700">Clear Routes</div>
                <div className="text-3xl font-bold text-green-900">
                  {trafficZones.filter((z) => z.level === "LOW").length}
                </div>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-yellow-700">Active Alerts</div>
                <div className="text-3xl font-bold text-yellow-900">{congestionAlerts.length}</div>
              </div>
              <AlertTriangle className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>

        {/* Map and Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traffic Heatmap */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Traffic Density Heatmap</h2>
              <p className="text-slate-600 mt-1">Live traffic conditions visualized</p>
            </div>
            <div className="h-[500px]">
              <MapContainer
                center={[23.2599, 77.4126]}
                zoom={12}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {trafficZones.map((zone) => (
                  <Circle
                    key={zone.id}
                    center={zone.center}
                    radius={zone.radius}
                    pathOptions={{
                      color: zone.color,
                      fillColor: zone.color,
                      fillOpacity: 0.4,
                    }}
                  >
                    <Popup>
                      <div>
                        <strong className="text-lg">{zone.level} Traffic</strong>
                        <div className="mt-2">
                          <div>Density: {zone.density}%</div>
                          {zone.alerts.length > 0 && (
                            <div className="mt-2">
                              <strong>Alerts:</strong>
                              <ul className="list-disc list-inside">
                                {zone.alerts.map((alert, idx) => (
                                  <li key={idx} className="text-sm">{alert}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Circle>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Congestion Alerts */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-green-600" size={20} />
                Congestion Alerts
              </h3>
              <div className="space-y-3">
                {congestionAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border-2 ${
                      alert.type === "HIGH"
                        ? "bg-red-50 border-red-200"
                        : alert.type === "BLOCK"
                        ? "bg-red-100 border-red-300"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          alert.type === "HIGH" || alert.type === "BLOCK"
                            ? "bg-red-600 text-white"
                            : "bg-yellow-600 text-white"
                        }`}
                      >
                        {alert.type}
                      </span>
                      <span className="text-xs text-slate-600">{alert.time}</span>
                    </div>
                    <div className="font-semibold text-slate-900 mb-1">{alert.location}</div>
                    <div className="text-sm text-slate-700">{alert.message}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Hour Predictions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="text-green-600" size={20} />
                Peak Hour Predictions
              </h3>
              <div className="space-y-3">
                {peakHours.map((peak, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-900">{peak.hour}</span>
                      <span className="text-sm text-slate-600">{peak.label}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          peak.density > 70 ? "bg-red-500" : peak.density > 40 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${peak.density}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Expected density: {peak.density}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/routes/dashboard")}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrafficAnalytics;

