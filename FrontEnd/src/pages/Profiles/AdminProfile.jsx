// src/pages/admin/AdminProfile.jsx
import { useState, useEffect } from "react";
import ProfileSection from "../../components/ProfileSection";
import { getProfile, logout } from "../../services/authService";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("Fetching Admin profile...");
      try {
        setLoading(true);
        const data = await getProfile(); // This will use adminApi → /admin/profile
        console.log("✅ Admin profile data received:", data);
        setProfile(data);
        setError("");
      } catch (err) {
        console.error("❌ Failed to fetch admin profile:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url,
          baseURL: err.config?.baseURL,
        });
        
        const errorMessage = err.response?.data?.message || 
                           err.response?.data?.Message || 
                           err.message || 
                           "Failed to load profile. Session may have expired.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
          <p className="mt-6 text-xl text-slate-600">Loading Admin Profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-20 bg-red-50 rounded-2xl">
          <p className="text-red-700 text-xl font-medium mb-6">{error}</p>
          <button
            onClick={() => window.location.href = "/login"}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 bg-gradient-to-br from-slate-50 to-red-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-red-200 flex items-center justify-center text-4xl font-bold text-red-800 shadow-inner">
              {profile.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                {profile.name || "Administrator"}
              </h1>
              <p className="text-xl text-red-700 font-medium mt-1">System Administrator • NeuroFleetX</p>
              <p className="text-slate-600 mt-2">Managing platform operations and oversight</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ProfileSection title="Account Details" className="bg-white shadow-md rounded-2xl p-8 border border-red-100">
          <p><span className="font-semibold text-slate-700">Email:</span> {profile.email || "-"}</p>
          <p><span className="font-semibold text-slate-700">Role:</span> <span className="text-red-700 font-bold">ADMIN</span></p>
          <p><span className="font-semibold text-slate-700">Status:</span> <span className="text-green-700 font-bold">Active</span></p>
        </ProfileSection>

        <ProfileSection title="Personal Information" className="bg-white shadow-md rounded-2xl p-8 border border-red-100">
          <p><span className="font-semibold text-slate-700">Full Name:</span> {profile.name || "-"}</p>
          <p><span className="font-semibold text-slate-700">Gender:</span> {profile.gender || "-"}</p>
          <p><span className="font-semibold text-slate-700">Registration No:</span> {profile.registrationNo || "-"}</p>
        </ProfileSection>

        <ProfileSection title="Platform Stats" className="bg-white shadow-md rounded-2xl p-8 border border-red-100">
          <p><span className="font-semibold text-slate-700">Total Users:</span> <span className="text-2xl font-bold text-blue-600">1,247</span></p>
          <p><span className="font-semibold text-slate-700">Active Drivers:</span> <span className="text-2xl font-bold text-green-600">89</span></p>
          <p><span className="font-semibold text-slate-700">Fleet Managers:</span> <span className="text-2xl font-bold text-purple-600">12</span></p>
        </ProfileSection>
      </div>

      {/* Admin Actions */}
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-red-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Admin Controls</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button className="p-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
            Manage Users
          </button>
          <button className="p-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium">
            View Reports
          </button>
          <button className="p-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium">
            System Settings
          </button>
          <button className="p-6 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition font-medium">
            Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;