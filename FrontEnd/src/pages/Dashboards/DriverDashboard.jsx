import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  Route,
  CheckCircle,
  Percent,
  Star,
  Navigation,
} from "lucide-react";

import DashboardCard from "../../components/DashboardCard";

/* ---------------- Dummy Stats ---------------- */

const driverStats = [
  { title: "Today's Trips", value: 8, icon: MapPin },
  { title: "Today's Earnings", value: "₹1,850", icon: IndianRupee },
  { title: "Distance Covered", value: "124 km", icon: Route },
  { title: "Completed Trips", value: 540, icon: CheckCircle },
  { title: "Acceptance Rate", value: "92%", icon: Percent },
];

/* ---------------- Component ---------------- */

const DriverDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ---------- Main Content ---------- */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Driver Dashboard
          </h2>
          <p className="text-slate-600 mt-1">
            Monitor your trips, earnings, and performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {driverStats.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}

          {/* Rating Card */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <p className="text-sm text-green-700 mb-2">Driver Rating</p>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-green-900">
                4.6
              </span>

              <div className="flex text-green-600">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} className="text-green-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-green-800 mb-2">
            Performance Summary
          </h3>
          <p className="text-sm text-green-700 leading-relaxed">
            Great job! Your acceptance rate is above average and your customer
            rating is excellent. Keep maintaining consistent performance to
            unlock weekly incentives.
          </p>
        </div>

        {/* Live Tracking (Driver Only) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="text-blue-600" size={24} />
                Live Tracking
              </h3>
              <p className="text-slate-600 mt-1">Track your trips in real-time</p>
            </div>
            <button
              onClick={() => navigate("/routes/live-tracking")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition flex items-center gap-2"
            >
              <Navigation size={20} />
              Open Live Tracking
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default DriverDashboard;
