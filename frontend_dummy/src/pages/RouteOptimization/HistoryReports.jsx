import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { History, TrendingUp, Fuel, Clock, DollarSign, FileText } from "lucide-react";

const HistoryReports = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const routeHistory = [
    {
      id: 1,
      date: "2024-01-15",
      route: "Station → MP Nagar",
      distance: "5.1 km",
      time: "14 min",
      fuelSaved: "0.5L",
      costSaved: "₹35",
      optimizationType: "Fastest",
    },
    {
      id: 2,
      date: "2024-01-14",
      route: "Airport → New Market",
      distance: "12.3 km",
      time: "28 min",
      fuelSaved: "1.2L",
      costSaved: "₹84",
      optimizationType: "Energy Efficient",
    },
    {
      id: 3,
      date: "2024-01-13",
      route: "Bairagarh → Kolar",
      distance: "8.7 km",
      time: "22 min",
      fuelSaved: "0.8L",
      costSaved: "₹56",
      optimizationType: "Low Traffic",
    },
    {
      id: 4,
      date: "2024-01-12",
      route: "Station → MP Nagar",
      distance: "5.2 km",
      time: "15 min",
      fuelSaved: "0.4L",
      costSaved: "₹28",
      optimizationType: "Fastest",
    },
    {
      id: 5,
      date: "2024-01-11",
      route: "Habibganj → Hoshangabad",
      distance: "18.5 km",
      time: "35 min",
      fuelSaved: "1.5L",
      costSaved: "₹105",
      optimizationType: "Energy Efficient",
    },
  ];

  const performanceData = [
    { name: "Mon", timeSaved: 15, fuelSaved: 2.5, routes: 12 },
    { name: "Tue", timeSaved: 18, fuelSaved: 3.2, routes: 15 },
    { name: "Wed", timeSaved: 12, fuelSaved: 2.1, routes: 10 },
    { name: "Thu", timeSaved: 20, fuelSaved: 3.5, routes: 18 },
    { name: "Fri", timeSaved: 22, fuelSaved: 3.8, routes: 20 },
    { name: "Sat", timeSaved: 14, fuelSaved: 2.3, routes: 11 },
    { name: "Sun", timeSaved: 10, fuelSaved: 1.8, routes: 8 },
  ];

  const optimizationTypeData = [
    { name: "Fastest", value: 45, color: "#16a34a" },
    { name: "Energy Efficient", value: 30, color: "#2563eb" },
    { name: "Low Traffic", value: 25, color: "#f97316" },
  ];

  const totalStats = {
    routesOptimized: 94,
    totalTimeSaved: 127,
    totalFuelSaved: 19.2,
    totalCostSaved: 1344,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <History className="text-green-600" size={32} />
                History & Reports
              </h1>
              <p className="text-slate-600 text-lg">AI optimization effectiveness and performance analytics</p>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-700">Routes Optimized</div>
                <div className="text-3xl font-bold text-blue-900">{totalStats.routesOptimized}</div>
              </div>
              <TrendingUp className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-700">Time Saved</div>
                <div className="text-3xl font-bold text-green-900">{totalStats.totalTimeSaved} min</div>
              </div>
              <Clock className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-purple-700">Fuel Saved</div>
                <div className="text-3xl font-bold text-purple-900">{totalStats.totalFuelSaved}L</div>
              </div>
              <Fuel className="text-purple-600" size={32} />
            </div>
          </div>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-orange-700">Cost Saved</div>
                <div className="text-3xl font-bold text-orange-900">₹{totalStats.totalCostSaved}</div>
              </div>
              <DollarSign className="text-orange-600" size={32} />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="timeSaved" fill="#16a34a" name="Time Saved (min)" />
                <Bar dataKey="fuelSaved" fill="#22c55e" name="Fuel Saved (L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Optimization Type Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Optimization Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={optimizationTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {optimizationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Route History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <FileText className="text-green-600" size={24} />
            Recent Routes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Route</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Distance</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Fuel Saved</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Cost Saved</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                </tr>
              </thead>
              <tbody>
                {routeHistory.map((route) => (
                  <tr key={route.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-700">{route.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{route.route}</td>
                    <td className="py-3 px-4 text-slate-700">{route.distance}</td>
                    <td className="py-3 px-4 text-slate-700">{route.time}</td>
                    <td className="py-3 px-4 text-green-700 font-semibold">{route.fuelSaved}</td>
                    <td className="py-3 px-4 text-green-700 font-semibold">{route.costSaved}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        {route.optimizationType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default HistoryReports;

