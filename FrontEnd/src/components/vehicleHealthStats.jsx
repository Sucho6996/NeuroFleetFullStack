import React from "react";
import { useParams } from "react-router-dom";
import {
  Car,
  Wrench,
  Battery,
  Gauge,
} from "lucide-react";

import DashboardCard from "../../components/DashboardCard";
import LineChart from "../../components/LineChart";

/* ---------------- Dummy Data ---------------- */

const vehicleHealthStats = [
  { title: "Engine Health", value: "78%", icon: Gauge },
  { title: "Tire Health", value: "72%", icon: Car },
  { title: "Battery Health", value: "80%", icon: Battery },
  { title: "Next Service", value: "12 Days", icon: Wrench },
];

const healthTrendData = [
  { name: "Week 1", engine: 92, tire: 88, battery: 90 },
  { name: "Week 2", engine: 87, tire: 82, battery: 86 },
  { name: "Week 3", engine: 82, tire: 77, battery: 83 },
  { name: "Week 4", engine: 78, tire: 72, battery: 80 },
];

/* ---------------- Component ---------------- */

const VehicleHealthDetails = () => {
  const { vehicleId } = useParams();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto p-6 space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Vehicle Health Details
          </h2>
          <p className="text-slate-600 mt-1">
            Vehicle ID: <span className="font-medium">{vehicleId}</span>
          </p>
        </div>

        {/* Health Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicleHealthStats.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Health Trend Chart */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-green-800 mb-4">
            Component Health Over Time
          </h3>
          <LineChart data={healthTrendData} />
        </div>

        {/* Maintenance Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Maintenance Recommendation
          </h3>
          <p className="text-slate-600">
            Engine wear and tire degradation indicate upcoming service is
            required. Schedule maintenance within the next <b>12 days</b> to
            avoid operational downtime.
          </p>
        </div>

      </main>
    </div>
  );
};

export default VehicleHealthDetails;
