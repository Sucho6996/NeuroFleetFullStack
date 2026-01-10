import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  CheckCircle,
  Activity,
  ClipboardCheck,
  Users,
  IndianRupee,
  Route,
  MapPin,
  TrendingUp,
} from "lucide-react";

import DashboardCard from "../../components/DashboardCard";
import LineChart from "../../components/LineChart";
import DonutChart from "../../components/DonutChart";
import { getAllVehicles } from "../../services/fleetManagerApis";

/* ---------------- Component ---------------- */

const FleetManagerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fleetManagerStats, setFleetManagerStats] = useState([
    { title: "Active Vehicles", value: 0, icon: Truck },
    { title: "Total Fleet Size", value: 0, icon: Truck },
    { title: "Active Trips", value: 18, icon: Activity },
    { title: "Completed Trips", value: 4500, icon: ClipboardCheck },
    { title: "Active Drivers", value: 18, icon: Users },
    { title: "Weekly Revenue", value: "₹1,50,000", icon: IndianRupee },
  ]);

  const tripsWeeklyData = [
    { name: "Mon", trips: 20 },
    { name: "Tue", trips: 35 },
    { name: "Wed", trips: 28 },
    { name: "Thu", trips: 40 },
    { name: "Fri", trips: 30 },
    { name: "Sat", trips: 22 },
    { name: "Sun", trips: 18 },
  ];

  const [vehicleUsageData, setVehicleUsageData] = useState([
    { name: "Active", value: 0 },
    { name: "Idle", value: 0 },
    { name: "Maintenance", value: 0 },
  ]);

  // Fetch dashboard data from backend
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const vehicles = await getAllVehicles();
      
      // Calculate stats from backend data
      const totalFleetSize = vehicles.length || 0;
      const activeVehicles = vehicles.filter(v => 
        v.status === "In Use" || v.status === "IN_USE" || v.status === "ACTIVE"
      ).length;
      const idleVehicles = vehicles.filter(v => 
        v.status === "Idle" || v.status === "IDLE"
      ).length;
      const maintenanceVehicles = vehicles.filter(v => 
        v.status === "Maintenance" || v.status === "MAINTENANCE"
      ).length;

      // Update stats
      setFleetManagerStats([
        { title: "Active Vehicles", value: activeVehicles, icon: Truck },
        { title: "Total Fleet Size", value: totalFleetSize, icon: Truck },
        { title: "Active Trips", value: 12, icon: Activity },
        { title: "Completed Trips", value: 4500, icon: ClipboardCheck },
        { title: "Active Drivers", value: 18, icon: Users },
        { title: "Weekly Revenue", value: "₹1,50,000", icon: IndianRupee },
      ]);

      // Update vehicle usage data for donut chart
      const total = totalFleetSize || 1; // Avoid division by zero
      setVehicleUsageData([
        { name: "Active", value: Math.round((activeVehicles / total) * 100) },
        { name: "Idle", value: Math.round((idleVehicles / total) * 100) },
        { name: "Maintenance", value: Math.round((maintenanceVehicles / total) * 100) },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
          <p className="mt-6 text-xl text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ---------- Main Content ---------- */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Fleet Manager Dashboard
          </h2>
          <p className="text-slate-600 mt-1">
            Monitor fleet performance, trips, and revenue
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleetManagerStats.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Route Optimization Section (Fleet Manager - Analytics Only) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Route className="text-green-600" size={24} />
                Route Optimization Analytics
              </h3>
              <p className="text-slate-600 mt-1">Analyze traffic patterns and view performance reports</p>
            </div>
            <button
              onClick={() => navigate("/routes/dashboard")}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
            >
              View Dashboard
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/routes/traffic-analytics")}
              className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl hover:bg-orange-100 hover:border-orange-300 transition text-left"
            >
              <MapPin className="text-orange-600 mb-2" size={24} />
              <div className="font-semibold text-slate-900">Traffic Analytics</div>
              <div className="text-sm text-slate-600 mt-1">Real-time insights</div>
            </button>
            
            <button
              onClick={() => navigate("/routes/history")}
              className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition text-left"
            >
              <Activity className="text-purple-600 mb-2" size={24} />
              <div className="font-semibold text-slate-900">Reports</div>
              <div className="text-sm text-slate-600 mt-1">Performance analytics</div>
            </button>
          </div>
        </div>

        {/* Maintenance Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={24} />
                Predictive Maintenance
              </h3>
              <p className="text-slate-600 mt-1">Monitor vehicle health and maintenance alerts</p>
            </div>
            <button
              onClick={() => navigate("/fleet/maintenance")}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
            >
              View Dashboard
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
            <p className="text-slate-700">
              Monitor engine, tire, battery, and fuel health. Get AI-powered predictions for maintenance schedules and critical alerts.
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Line Chart */}
          <div className="lg:col-span-2 bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-green-800 mb-4">
              Weekly Trips Overview
            </h3>
            <LineChart data={tripsWeeklyData} />
          </div>

          {/* Donut Chart */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-green-800 mb-4">
              Vehicle Usage Status
            </h3>
            <DonutChart data={vehicleUsageData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FleetManagerDashboard;
