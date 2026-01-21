// src/components/TopNavbar.jsx  (or wherever your Navbar is)
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../services/authService"; // For logout functionality

const TopNavbar = () => {
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Read role & basic user info from localStorage on mount and when it changes
  useEffect(() => {
    const updateUser = () => {
      const storedRole = localStorage.getItem("role");
      const storedEmail = localStorage.getItem("email");

      if (storedRole) {
        const normalized = storedRole.toLowerCase();
        setRole(normalized);

        // Optional: extract name from email or fetch from profile
        setUserName(storedEmail?.split("@")[0] || "User");
      } else {
        setRole(""); // not logged in
      }
    };

    updateUser();

    // Listen for storage changes (in case logout/login happens in another tab)
    window.addEventListener("storage", updateUser);

    return () => window.removeEventListener("storage", updateUser);
  }, []);

  // Role-specific navigation links
  const navLinks = {
    admin: [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/analytics", label: "Fleet Analytics" },
      { to: "/routes/traffic-analytics", label: "Traffic Analytics" },
      { to: "/routes/history", label: "Route Reports" },
      { to: "/routes/settings", label: "AI Settings" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/profile", label: "Profile" },
    ],
    customer: [
      { to: "/customer/dashboard", label: "Dashboard" },
      { to: "/booking", label: "Plan Trip & Book" },
      { to: "/customer/bookings", label: "My Bookings" },
      { to: "/customer/trips", label: "My Trips" },
      { to: "/customer/profile", label: "Profile" },
      { to: "/customer/settings", label: "Settings" },
    ],
    driver: [
      { to: "/driver/dashboard", label: "Dashboard" },
      { to: "/routes/live-tracking", label: "Live Tracking" },
      { to: "/driver/trips", label: "Trips" },
      { to: "/driver/earnings", label: "Earnings" },
      { to: "/driver/profile", label: "Profile" },
      { to: "/driver/settings", label: "Settings" },
    ],
    fleet_manager: [
      { to: "/fleetmanager/dashboard", label: "Dashboard" },
      { to: "/routes/dashboard", label: "Route Optimization" },
      { to: "/fleet/maintenance", label: "Maintenance" },
      { to: "/fleetmanager/inventory", label: "Vehicles" },
      { to: "/fleetmanager/alerts", label: "Alerts" },
      { to: "/fleetmanager/profile", label: "Profile" },
      { to: "/fleetmanager/settings", label: "Settings" },
    ],
  };

  const linksToShow = navLinks[role] || []; // fallback to empty if not logged in

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout(); // This calls the correct role's /logout endpoint and clears localStorage
    }
  };

  // If not logged in → redirect to login
  if (!role) {
    return null; // or a minimal public navbar
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="backdrop-blur-xl bg-white/90 border-b border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-400/60 flex items-center justify-center">
              <span className="text-xs font-semibold text-emerald-600">NF</span>
            </div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
              Neuro<span className="text-emerald-600">FleetX</span>
            </h1>
          </div>

          {/* Navigation Links - Role Specific */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {linksToShow.map((link) => (
              <NavItem key={link.to} to={link.to} label={link.label} />
            ))}
          </nav>

          {/* User Section with Avatar & Logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium capitalize text-slate-900">{userName}</p>
              <p className="text-xs capitalize text-slate-500">{role.replace("_", " ")}</p>
            </div>

            {/* Avatar */}
            <div className="relative group">
              <img
                src="https://m.media-amazon.com/images/I/41ONa5HOwfL._AC_UF1000,1000_QL80_.jpg"
                alt="User"
                className="w-9 h-9 rounded-full border border-slate-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
              />

              {/* Dropdown on hover */}
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 border border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/80 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Reusable NavItem
const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative px-1 transition-colors duration-200 ${
        isActive
          ? "text-emerald-700 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:rounded-full after:bg-emerald-500"
          : "text-slate-500 hover:text-slate-900"
      }`
    }
  >
    {label}
  </NavLink>
);

export default TopNavbar;