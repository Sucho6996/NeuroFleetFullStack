// src/pages/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import LineChart from "../../components/LineChart";
import DonutChart from "../../components/DonutChart";
import {
  Car,
  Users,
  Activity,
  IndianRupee,
  AlertTriangle,
  MapPin,
  Route,
  TrendingUp,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const kpiData = [
    { title: "Total Vehicles", value: "342", change: "+12%", icon: Car },
    { title: "Active Drivers", value: "89", change: "+5%", icon: Users },
    { title: "Today's Bookings", value: "156", change: "+23%", icon: Activity },
    { title: "Total Revenue", value: "₹2.84L", change: "+18%", icon: IndianRupee },
    { title: "Maintenance Alerts", value: "14", change: "Critical", icon: AlertTriangle },
    { title: "Vehicles On Road", value: "127", change: "Live", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-slate-50 ">
      <main className="px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Admin Overview
            </h1>
            <p className="text-slate-600 mt-1">
              Real-time fleet performance & system insights
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpiData.map((stat) => (
              <DashboardCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Fleet Analytics Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={24} />
                  Fleet Analytics & Reporting
                </h3>
                <p className="text-slate-600 mt-1">Real-time fleet visibility, operational analytics, and business insights</p>
              </div>
              <button
                onClick={() => navigate("/admin/analytics")}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
              >
                View Analytics
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/admin/analytics")}
                className="p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 hover:border-green-300 transition text-left"
              >
                <TrendingUp className="text-green-600 mb-2" size={24} />
                <div className="font-semibold text-slate-900">Fleet Analytics</div>
                <div className="text-sm text-slate-600 mt-1">Heatmap & KPIs</div>
              </button>
              
              <button
                onClick={() => navigate("/routes/traffic-analytics")}
                className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl hover:bg-orange-100 hover:border-orange-300 transition text-left"
              >
                <MapPin className="text-orange-600 mb-2" size={24} />
                <div className="font-semibold text-slate-900">Traffic Analytics</div>
                <div className="text-sm text-slate-600 mt-1">System-wide traffic insights</div>
              </button>
              
              <button
                onClick={() => navigate("/routes/history")}
                className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition text-left"
              >
                <Activity className="text-purple-600 mb-2" size={24} />
                <div className="font-semibold text-slate-900">Route Reports</div>
                <div className="text-sm text-slate-600 mt-1">Performance analytics</div>
              </button>
              
              <button
                onClick={() => navigate("/routes/settings")}
                className="p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 hover:border-green-300 transition text-left"
              >
                <Activity className="text-green-600 mb-2" size={24} />
                <div className="font-semibold text-slate-900">AI Settings</div>
                <div className="text-sm text-slate-600 mt-1">System configuration</div>
              </button>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Line Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-xl font-semibold text-slate-900">
                  Revenue & Trip Trends
                </h3>

                <select className="px-4 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                  <option>This Year</option>
                </select>

              </div>

              <div className="h-80">
                <LineChart />
              </div>
            </div>

            {/* Donut Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Fleet Status
              </h3>

              <div className="h-80 flex items-center justify-center">
                <DonutChart />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
