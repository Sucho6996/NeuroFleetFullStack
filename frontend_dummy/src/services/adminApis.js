// src/services/adminApis.js
import adminApi from "./adminService";

// Get Dashboard Summary (KPIs)
export const getDashboardSummary = async () => {
  try {
    const response = await adminApi.get("/admin/stats/summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    // Return mock data if API fails
    return {
      totalFleet: 342,
      activeVehicles: 127,
      tripsToday: 156,
      activeRoutes: 89,
      evUtilization: 42.5,
    };
  }
};

// Get Fleet Distribution/Locations
export const getFleetLocations = async () => {
  try {
    const response = await adminApi.get("/admin/fleet/locations");
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet locations:", error);
    return [];
  }
};

// Get Heatmap Data (Pickup/Drop-off density)
export const getHeatmapData = async () => {
  try {
    const response = await adminApi.get("/admin/trips/heatmap");
    return response.data;
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    // Return mock heatmap data
    return [
      { lat: 23.2599, lng: 77.4126, trip_count: 15, type: "pickup" },
      { lat: 23.2635, lng: 77.4162, trip_count: 12, type: "dropoff" },
      { lat: 23.2650, lng: 77.4200, trip_count: 8, type: "pickup" },
      { lat: 23.2620, lng: 77.4140, trip_count: 20, type: "pickup" },
      { lat: 23.2610, lng: 77.4135, trip_count: 18, type: "dropoff" },
      { lat: 23.2640, lng: 77.4185, trip_count: 10, type: "pickup" },
      { lat: 23.2580, lng: 77.4100, trip_count: 7, type: "dropoff" },
    ];
  }
};

// Get Hourly Activity Data
export const getHourlyActivity = async () => {
  try {
    const response = await adminApi.get("/admin/trips/hourly");
    return response.data;
  } catch (error) {
    console.error("Error fetching hourly activity:", error);
    // Return mock hourly data
    return [
      { hour: "00:00", trips: 2 },
      { hour: "02:00", trips: 1 },
      { hour: "04:00", trips: 0 },
      { hour: "06:00", trips: 4 },
      { hour: "08:00", trips: 12 },
      { hour: "10:00", trips: 18 },
      { hour: "12:00", trips: 25 },
      { hour: "14:00", trips: 22 },
      { hour: "16:00", trips: 28 },
      { hour: "18:00", trips: 31 },
      { hour: "20:00", trips: 15 },
      { hour: "22:00", trips: 8 },
    ];
  }
};

// Export CSV Report
export const exportCSV = async (reportType = "trips") => {
  try {
    const response = await adminApi.get(`/admin/export/csv?type=${reportType}`, {
      responseType: "blob",
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `fleet_report_${reportType}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error("Error exporting CSV:", error);
    alert("Failed to export CSV report. Please try again.");
    return false;
  }
};

// Export PDF Report
export const exportPDF = async (reportType = "summary") => {
  try {
    const response = await adminApi.get(`/admin/export/pdf?type=${reportType}`, {
      responseType: "blob",
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `fleet_report_${reportType}_${new Date().toISOString().split("T")[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error("Error exporting PDF:", error);
    alert("Failed to export PDF report. Please try again.");
    return false;
  }
};

