// src/pages/fleetmanager/FleetManagerProfile.jsx
import { useState, useEffect } from "react";
import ProfileSection from "../../components/ProfileSection";
import { getProfile, logout } from "../../services/authService";

const FleetManagerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile(); // Calls POST /fleetManager/profile
        console.log("Fleet Manager profile:", data);
        setProfile(data);
        setError("");
      } catch (err) {
        console.error("Failed to load fleet manager profile:", err);
        setError("Unable to load profile. Session may have expired.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout(); // Calls POST /fleetManager/logout
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center py-20">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
        <p className="mt-6 text-xl text-slate-600">Loading Fleet Manager Profile...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center py-20 bg-red-50 rounded-2xl">
        <p className="text-red-700 text-xl mb-6">{error}</p>
        <button
          onClick={() => window.location.href = "/login"}
          className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Back to Login
        </button>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-20">No profile data found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
      {/* Header with Logout */}
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-green-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center text-4xl font-bold text-purple-800 shadow-inner">
              {profile.name?.charAt(0).toUpperCase() || "F"}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                {profile.name || "Fleet Manager"}
              </h1>
              <p className="text-xl text-purple-700 font-medium mt-1">
                {profile.companyName || "Company"} • Fleet Manager
              </p>
              <p className="text-slate-600 mt-2">Managing fleet operations and vehicle tracking</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600/60 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ProfileSection title="Account Details" className="bg-white shadow-md rounded-2xl p-8 border border-purple-100" editable={true}>
          <p><span className="font-semibold text-slate-700">Email:</span> {profile.email || "-"}</p>
          <p><span className="font-semibold text-slate-700">Role:</span> <span className="text-slate-700 ">FLEET MANAGER</span></p>
          <p><span className="font-semibold text-slate-700">Status:</span> <span className="text-slate-700 ">Active</span></p>
        </ProfileSection>

        <ProfileSection title="Personal Information" className="bg-white shadow-md rounded-2xl p-8 border border-purple-100" editable={true}>
          <p><span className="font-semibold text-slate-700">Full Name:</span> {profile.name || "-"}</p>
          <p><span className="font-semibold text-slate-700">Gender:</span> {profile.gender || "-"}</p>
          <p><span className="font-semibold text-slate-700">Company:</span> <span className="font-medium">{profile.companyName || "-"}</span></p>
        </ProfileSection>

        <ProfileSection title="Fleet Overview" className="bg-white shadow-md rounded-2xl p-8 border border-purple-100" editable={false}>
          <p><span className="font-semibold text-slate-700">Total Vehicles:</span> <span className="  text-slate-600">342</span></p>
          <p><span className="font-semibold text-slate-700">Active Drivers:</span> <span className="  text-slate-600">89</span></p>
          <p><span className="font-semibold text-slate-700">Alerts Today:</span> <span className=" text-slate-600">14</span></p>
        </ProfileSection>
      </div>

      {/* Fleet Actions */}
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-purple-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Fleet Management Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button className="p-6 border border-green-400 bg-green-100 text-green-900 rounded-xl hover:bg-green-500/70 transition font-medium">
            Add Vehicle
          </button>
          <button className="p-6 border border-green-400 bg-green-100 text-green-900 rounded-xl hover:bg-green-500/70 transition font-medium">
            View Vehicles
          </button>
          <button className="p-6 border border-green-400 bg-green-100 text-green-900 rounded-xl hover:bg-green-500/70 transition font-medium">
            Manage Drivers
          </button>
          <button className="p-6 border border-green-400 bg-green-100 text-green-900 rounded-xl hover:bg-green-500/70 transition font-medium">
            View Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default FleetManagerProfile;