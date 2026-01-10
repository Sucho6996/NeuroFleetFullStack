import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Circle, Popup, Marker } from "react-leaflet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Car,
  MapPin,
  Route,
  Activity,
  Zap,
  Download,
  FileText,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { getDashboardSummary, getHeatmapData, getHourlyActivity, exportCSV, exportPDF } from "../../services/adminApis";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const FleetAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalFleet: 0,
    activeVehicles: 0,
    tripsToday: 0,
    activeRoutes: 0,
    evUtilization: 0,
  });
  const [heatmapData, setHeatmapData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [summary, heatmap, hourly] = await Promise.all([
        getDashboardSummary(),
        getHeatmapData(),
        getHourlyActivity(),
      ]);

      setDashboardData(summary);
      setHeatmapData(heatmap);
      setHourlyData(hourly);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async (type) => {
    setLoading(true);
    await exportCSV(type);
    setLoading(false);
  };

  const handleExportPDF = async (type) => {
    setLoading(true);
    await exportPDF(type);
    setLoading(false);
  };

  // Calculate max trip count for normalization
  const maxTripCount = Math.max(...heatmapData.map((d) => d.trip_count || 0), 1);

  // Normalize heatmap intensity (0-1 scale)
  const getHeatmapIntensity = (tripCount) => {
    return Math.min(tripCount / maxTripCount, 1);
  };

  // Get color based on trip count
  const getHeatmapColor = (tripCount, maxCount) => {
    const intensity = tripCount / maxCount;
    if (intensity > 0.7) return "#dc2626"; // Red - High
    if (intensity > 0.4) return "#f97316"; // Orange - Medium
    return "#16a34a"; // Green - Low
  };

  if (loading && !dashboardData.totalFleet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
          <p className="mt-6 text-xl text-slate-600">Loading Fleet Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <TrendingUp className="text-green-600" size={32} />
                Fleet Analytics & Reporting
              </h1>
              <p className="text-slate-600 text-lg">
                Real-time fleet visibility, operational analytics, and actionable insights
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition flex items-center gap-2"
            >
              <RefreshCw size={20} />
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">🚗 Total Fleet</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">{dashboardData.totalFleet}</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Car className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">📍 Active Vehicles</div>
                <div className="text-3xl font-bold text-green-900 mt-2">{dashboardData.activeVehicles}</div>
                <div className="text-xs text-green-700 mt-1">Now</div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">🧳 Trips Today</div>
                <div className="text-3xl font-bold text-purple-900 mt-2">{dashboardData.tripsToday}</div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-orange-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">🛣 Active Routes</div>
                <div className="text-3xl font-bold text-orange-900 mt-2">{dashboardData.activeRoutes}</div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Route className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">⚡ EV Utilization</div>
                <div className="text-3xl font-bold text-yellow-900 mt-2">{dashboardData.evUtilization}%</div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Zap className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Heatmap & Hourly Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heatmap */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <MapPin className="text-green-600" size={24} />
                  Fleet Heatmap Overview
                </h2>
                <p className="text-slate-600 mt-1">Pickup & Drop-off Density Visualization</p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-green-100 rounded-lg text-xs">
                  <div className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2"></div>
                  Low
                </div>
                <div className="px-3 py-1 bg-orange-100 rounded-lg text-xs">
                  <div className="w-3 h-3 bg-orange-500 rounded-full inline-block mr-2"></div>
                  Medium
                </div>
                <div className="px-3 py-1 bg-red-100 rounded-lg text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2"></div>
                  High
                </div>
              </div>
            </div>
            <div className="h-[500px] rounded-xl overflow-hidden border border-slate-200">
              <MapContainer
                center={[23.2599, 77.4126]}
                zoom={12}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {heatmapData.map((point, index) => {
                  const intensity = getHeatmapIntensity(point.trip_count);
                  const radius = Math.max(200, point.trip_count * 20);
                  const color = getHeatmapColor(point.trip_count, maxTripCount);

                  return (
                    <Circle
                      key={index}
                      center={[point.lat, point.lng]}
                      radius={radius}
                      pathOptions={{
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.4 * intensity,
                      }}
                    >
                      <Popup>
                        <div>
                          <strong className="text-lg">
                            {point.type === "pickup" ? "📍 Pickup Zone" : "📍 Drop-off Zone"}
                          </strong>
                          <div className="mt-2 space-y-1">
                            <div><strong>Trips:</strong> {point.trip_count}</div>
                            <div><strong>Location:</strong> {point.lat.toFixed(4)}, {point.lng.toFixed(4)}</div>
                            <div><strong>Demand Level:</strong> {intensity > 0.7 ? "High" : intensity > 0.4 ? "Medium" : "Low"}</div>
                          </div>
                        </div>
                      </Popup>
                    </Circle>
                  );
                })}
              </MapContainer>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Heatmap Insights</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Identify high-demand zones for fleet placement optimization</li>
                <li>• Support route planning based on pickup/drop-off density</li>
                <li>• Generated using trip frequency patterns and route data</li>
              </ul>
            </div>
          </div>

          {/* Hourly Activity Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="text-green-600" size={24} />
              Hourly Rental Activity
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="trips" fill="#16a34a" name="Trips" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Business Use</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Identify peak demand hours</li>
                <li>• Optimize pricing strategy</li>
                <li>• Manage fleet scheduling</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Export & Reports Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="text-green-600" size={24} />
                Export & Reports
              </h2>
              <p className="text-slate-600 mt-1">Generate and download business reports</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleExportCSV("trips")}
              className="p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition text-left"
            >
              <Download className="text-green-600 mb-3" size={32} />
              <div className="font-semibold text-slate-900">Export Trips CSV</div>
              <div className="text-sm text-slate-600 mt-1">Trip logs & operational data</div>
            </button>

            <button
              onClick={() => handleExportCSV("fleet")}
              className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition text-left"
            >
              <Download className="text-blue-600 mb-3" size={32} />
              <div className="font-semibold text-slate-900">Export Fleet CSV</div>
              <div className="text-sm text-slate-600 mt-1">Vehicle data & status</div>
            </button>

            <button
              onClick={() => handleExportPDF("summary")}
              className="p-6 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition text-left"
            >
              <FileText className="text-purple-600 mb-3" size={32} />
              <div className="font-semibold text-slate-900">Export Summary PDF</div>
              <div className="text-sm text-slate-600 mt-1">Executive summary report</div>
            </button>

            <button
              onClick={() => handleExportPDF("full")}
              className="p-6 bg-orange-50 border-2 border-orange-200 rounded-xl hover:bg-orange-100 transition text-left"
            >
              <FileText className="text-orange-600 mb-3" size={32} />
              <div className="font-semibold text-slate-900">Export Full PDF</div>
              <div className="text-sm text-slate-600 mt-1">Complete analytics report</div>
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Report Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                <strong>CSV Reports Include:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Trip logs with timestamps</li>
                  <li>Vehicle utilization data</li>
                  <li>Operational metrics</li>
                </ul>
              </div>
              <div>
                <strong>PDF Reports Include:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Executive summary</li>
                  <li>Performance charts</li>
                  <li>Compliance & audit data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetAnalytics;

