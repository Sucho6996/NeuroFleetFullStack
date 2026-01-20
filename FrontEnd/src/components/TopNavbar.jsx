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
      <div className="backdrop-blur-xl bg-green-800/95 border-b border-white/10 shadow-lg">
        <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Neuro<span className="text-green-300">FleetX</span>
            </h1>
          </div>

          {/* Navigation Links - Role Specific */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {linksToShow.map((link) => (
              <NavItem key={link.to} to={link.to} label={link.label} />
            ))}
          </nav>

          {/* User Section with Avatar & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-medium capitalize">{userName}</p>
              <p className="text-white/70 text-xs capitalize">{role.replace("_", " ")}</p>
            </div>

            {/* Avatar */}
            <div className="relative group">
              <img
                src="https://m.media-amazon.com/images/I/41ONa5HOwfL._AC_UF1000,1000_QL80_.jpg"
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-white/30 cursor-pointer hover:scale-105 transition"
              />

              {/* Dropdown on hover */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg"
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
      `relative transition-all duration-200 ${
        isActive
          ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-green-300"
          : "text-white/70 hover:text-white"
      }`
    }
  >
    {label}
  </NavLink>
);

export default TopNavbar;