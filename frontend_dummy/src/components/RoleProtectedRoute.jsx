// src/components/RoleProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem("role")?.toLowerCase();
  
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role names
  const normalizedRole = role === "fleet_manager" || role === "fleetmanager" ? "fleet_manager" : role;

  if (!allowedRoles.includes(normalizedRole)) {
    // Redirect to appropriate dashboard based on role
    const dashboardMap = {
      admin: "/admin/dashboard",
      customer: "/customer/dashboard",
      driver: "/driver/dashboard",
      fleet_manager: "/fleetmanager/dashboard",
    };

    return <Navigate to={dashboardMap[normalizedRole] || "/login"} replace />;
  }

  return children;
};

export default RoleProtectedRoute;

