import React, { useState, useEffect } from "react";
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";

import DashboardCard from "../components/DashboardCard";
import LineChart from "../components/VehicleLineChart";
import DonutChart from "../components/DonutChart";
import AlertTable from "../components/AlertTable";
import { getAllVehicles, getAllAlerts } from "../services/fleetManagerApis";

/* ---------------- Component ---------------- */

const MaintenanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [maintenanceStats, setMaintenanceStats] = useState([
    { title: "Healthy Vehicles", value: 0, icon: CheckCircle },
    { title: "Maintenance Due", value: 0, icon: Wrench },
    { title: "Critical Alerts", value: 0, icon: AlertTriangle },
    { title: "Avg Health Score", value: "0%", icon: Activity },
  ]);

  const healthTrendData = [
    { name: "Week 1", engine: 95, tire: 92, battery: 90 },
    { name: "Week 2", engine: 90, tire: 88, battery: 87 },
    { name: "Week 3", engine: 86, tire: 82, battery: 83 },
    { name: "Week 4", engine: 80, tire: 76, battery: 78 },
  ];

  const [maintenanceStatusData, setMaintenanceStatusData] = useState([
    { name: "Healthy", value: 0 },
    { name: "Due", value: 0 },
    { name: "Critical", value: 0 },
  ]);

  const [alertTableData, setAlertTableData] = useState([]);

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch vehicles and alerts from backend
      const [vehicles, alerts] = await Promise.all([
        getAllVehicles(),
        getAllAlerts().catch(() => []) // Handle if alerts API fails
      ]);

      // Calculate stats from vehicles
      const healthyVehicles = vehicles.filter(v => {
        const healthScore = calculateHealthScore(v);
        return healthScore >= 70;
      }).length;

      const maintenanceDue = vehicles.filter(v => {
        const healthScore = calculateHealthScore(v);
        return healthScore >= 50 && healthScore < 70;
      }).length;

      const criticalVehicles = vehicles.filter(v => {
        const healthScore = calculateHealthScore(v);
        return healthScore < 50;
      }).length;

      // Calculate average health score
      const totalHealthScore = vehicles.reduce((sum, v) => sum + calculateHealthScore(v), 0);
      const avgHealthScore = vehicles.length > 0 ? Math.round(totalHealthScore / vehicles.length) : 0;

      // Update stats
      setMaintenanceStats([
        { title: "Healthy Vehicles", value: healthyVehicles, icon: CheckCircle },
        { title: "Maintenance Due", value: maintenanceDue, icon: Wrench },
        { title: "Critical Alerts", value: alerts.length || criticalVehicles, icon: AlertTriangle },
        { title: "Avg Health Score", value: `${avgHealthScore}%`, icon: Activity },
      ]);

      // Update maintenance status data for donut chart
      const total = vehicles.length || 1;
      setMaintenanceStatusData([
        { name: "Healthy", value: Math.round((healthyVehicles / total) * 100) },
        { name: "Due", value: Math.round((maintenanceDue / total) * 100) },
        { name: "Critical", value: Math.round((criticalVehicles / total) * 100) },
      ]);

      // Map alerts to table format
      const mappedAlerts = alerts.map(alert => ({
        vehicleId: alert.regNo || alert.vehicleId || "N/A",
        issue: alert.type || alert.issue || "Unknown",
        severity: alert.severity || (alert.speed ? "Overspeeding" : "Warning"),
        action: alert.action || "Check Vehicle",
      }));
      setAlertTableData(mappedAlerts);
    } catch (error) {
      console.error("Error fetching maintenance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate health score based on vehicle metrics
  const calculateHealthScore = (vehicle) => {
    let score = 100;
    
    // Reduce score based on various factors
    if (vehicle.fuel !== undefined && vehicle.fuel < 20) score -= 20;
    if (vehicle.engineTemp !== undefined && vehicle.engineTemp > 100) score -= 15;
    if (vehicle.tireWear !== undefined && vehicle.tireWear > 70) score -= 15;
    if (vehicle.batteryHealth !== undefined && vehicle.batteryHealth < 50) score -= 15;
    if (vehicle.distanceCovered !== undefined && vehicle.distanceCovered > 10000) score -= 10;
    if (vehicle.status === "MAINTENANCE" || vehicle.status === "Maintenance") score -= 30;

    return Math.max(0, Math.min(100, score));
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
          <p className="mt-6 text-xl text-slate-600">Loading maintenance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto p-6 space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Predictive Maintenance Dashboard
          </h2>
          <p className="text-slate-600 mt-1">
            Monitor vehicle health and upcoming maintenance needs
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {maintenanceStats.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Line Chart */}
          <div className="lg:col-span-2 bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-green-800 mb-4">
              Vehicle Health Degradation Over Time
            </h3>
            <LineChart data={healthTrendData} />
          </div>

          {/* Donut Chart */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-green-800 mb-4">
              Maintenance Status Overview
            </h3>
            <DonutChart data={maintenanceStatusData} />
          </div>

        </div>

        {/* Alerts Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Maintenance Alerts
          </h3>
          <AlertTable data={alertTableData} />
        </div>

      </main>
    </div>
  );
};

export default MaintenanceDashboard;
