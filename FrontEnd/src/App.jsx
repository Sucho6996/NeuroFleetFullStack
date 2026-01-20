import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";

import "./App.css";

// Pages
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import AdminDashboard from "./pages/Dashboards/AdminDashboard.jsx";
import DriverDashboard from "./pages/Dashboards/DriverDashboard.jsx";
import CustomerDashboard from "./pages/Dashboards/CustomerDashboard.jsx";
import DriverProfile from "./pages/Profiles/DriverProfile.jsx";
import CustomerProfile from "./pages/Profiles/CustomerProfile.jsx";
import FleetManagerDashboard from "./pages/Dashboards/FleetManagerDashboard.jsx";
import FleetManagerAlerts from "./pages/Dashboards/FleetManagerAlerts.jsx";
import FleetInventory from "./pages/Inventory/FleetInventory.jsx";

// Layout
import MainLayout from "./layouts/MainLayout.jsx";
import RouteOptimization from "./pages/RouteOptimization.jsx";
import VehicleHealthDetails from "./components/VehicleHealthDetails.jsx";
import MaintenanceDashboard from "./pages/MaintenanceDashboard.jsx";
import AdminProfile from "./pages/Profiles/AdminProfile.jsx";
import FleetManagerProfile from "./pages/Profiles/FleetManagerProfile.jsx";
import RoleProtectedRoute from "./components/RoleProtectedRoute.jsx";

// Booking Module
import TripPlanning from "./pages/Booking/TripPlanning.jsx";
import BookingConfirmation from "./pages/Booking/BookingConfirmation.jsx";

// Analytics Module
import FleetAnalytics from "./pages/Analytics/FleetAnalytics.jsx";

// Route Optimization Module
import RouteOptimizationDashboard from "./pages/RouteOptimization/Dashboard.jsx";
import PlanRoute from "./pages/RouteOptimization/PlanRoute.jsx";
import RouteVisualization from "./pages/RouteOptimization/RouteVisualization.jsx";
import RouteComparison from "./pages/RouteOptimization/RouteComparison.jsx";
import LoadOptimization from "./pages/RouteOptimization/LoadOptimization.jsx";
import TrafficAnalytics from "./pages/RouteOptimization/TrafficAnalytics.jsx";
import LiveTracking from "./pages/RouteOptimization/LiveTracking.jsx";
import HistoryReports from "./pages/RouteOptimization/HistoryReports.jsx";
import AISettings from "./pages/RouteOptimization/AISettings.jsx";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>

        {/* Top Navbar will automatically detect user role
        <TopNavbar /> */}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <MainLayout>
                <AdminProfile />
              </MainLayout>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <FleetAnalytics />
                </MainLayout>
              </RoleProtectedRoute>
            }
          />

          {/* Fleet Manager Routes */}
          <Route
            path="/fleetmanager/dashboard"
            element={
              <MainLayout>
                <FleetManagerDashboard />
              </MainLayout>
            }
          />
          <Route
            path="/fleetmanager/inventory"
            element={
              <MainLayout>
                <FleetInventory />
              </MainLayout>
            }
          />

          <Route
            path="/fleetmanager/profile"
            element={
              <MainLayout>
                <FleetManagerProfile />
              </MainLayout>
            }
          />
          <Route
            path="/fleetmanager/alerts"
            element={
              <MainLayout>
                <FleetManagerAlerts />
              </MainLayout>
            }
          />

          {/* Driver Routes */}
          <Route
            path="/driver/dashboard"
            element={
              <MainLayout>
                <DriverDashboard />
              </MainLayout>
            }
          />
          <Route
            path="/driver/profile"
            element={
              <MainLayout>
                <DriverProfile />
              </MainLayout>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <MainLayout>
                <CustomerDashboard />
              </MainLayout>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <MainLayout>
                <CustomerProfile />
              </MainLayout>
            }
          />

          {/* Route Optimization Module Routes */}
          <Route
            path="/routes/dashboard"
            element={
              <MainLayout>
                <RouteOptimizationDashboard />
              </MainLayout>
            }
          />
          {/* Route Planning - Only for Customers (combined with vehicle booking) */}
          <Route
            path="/routes/plan"
            element={
              <RoleProtectedRoute allowedRoles={["customer"]}>
                <MainLayout>
                  <TripPlanning />
                </MainLayout>
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/routes/visualize"
            element={
              <MainLayout>
                <RouteVisualization />
              </MainLayout>
            }
          />
          <Route
            path="/routes/comparison"
            element={
              <MainLayout>
                <RouteComparison />
              </MainLayout>
            }
          />
          <Route
            path="/routes/load-optimization"
            element={
              <MainLayout>
                <LoadOptimization />
              </MainLayout>
            }
          />
          <Route
            path="/routes/traffic-analytics"
            element={
              <MainLayout>
                <TrafficAnalytics />
              </MainLayout>
            }
          />
          <Route
            path="/routes/live-tracking"
            element={
              <MainLayout>
                <LiveTracking />
              </MainLayout>
            }
          />
          <Route
            path="/routes/history"
            element={
              <MainLayout>
                <HistoryReports />
              </MainLayout>
            }
          />
          <Route
            path="/routes/settings"
            element={
              <MainLayout>
                <AISettings />
              </MainLayout>
            }
          />

          {/* Legacy route (keeping for backward compatibility) */}
          <Route
            path="/fleet/routes"
            element={
              <MainLayout>
                <RouteOptimizationDashboard />
              </MainLayout>
            }
          />
          {/* Maintenance Module Routes */}
          <Route
            path="/fleet/maintenance"
            element={
              <MainLayout>
                <MaintenanceDashboard />
              </MainLayout>
            }
          />
          <Route
            path="/fleet/maintenance/:vehicleId"
            element={
              <MainLayout>
                <VehicleHealthDetails />
              </MainLayout>
            }
          />

          {/* Booking Module Routes - Customer Trip Planning (Customers Only) */}
          <Route
            path="/booking"
            element={
              <RoleProtectedRoute allowedRoles={["customer"]}>
                <MainLayout>
                  <TripPlanning />
                </MainLayout>
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/booking/confirmation"
            element={
              <RoleProtectedRoute allowedRoles={["customer"]}>
                <MainLayout>
                  <BookingConfirmation />
                </MainLayout>
              </RoleProtectedRoute>
            }
          />
        </Routes>

         
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
