// src/pages/customer/CustomerProfile.jsx
import { useState, useEffect } from "react";
import ProfileSection from "../../components/ProfileSection";
import UserLocationMap from "../../components/UserLocationMap";
import { getProfile, logout } from "../../services/authService"; // ← Added logout import

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      // No auth → redirect to login immediately
      window.location.href = "/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile(); // Calls POST /user/profile
        setProfile(data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout(); // Calls POST /user/logout → clears token → redirects to /login
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-green-700"></div>
          <p className="mt-4 text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12 bg-red-50 rounded-xl">
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.href = "/login"}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-12">No profile data found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-slate-50">
      {/* ---------- Header with Logout Button ---------- */}
      <div className="flex justify-between items-center bg-white border border-green-200 p-6 rounded-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center text-2xl font-bold text-green-800">
            {profile.name?.charAt(0).toUpperCase() || "C"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {profile.name || "Customer"}
            </h2>
            <p className="text-sm text-slate-600">Customer • NeuroFleetX</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-md"
        >
          Logout
        </button>
      </div>

      {/* ---------- Content Grid ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileSection
          title="Personal Information"
          className="bg-white border border-green-200 rounded-xl p-6"
        >
          <p>
            <span className="text-slate-600">Full Name:</span>{" "}
            {profile.name || "-"}
          </p>
          <p>
            <span className="text-slate-600">Gender:</span>{" "}
            {profile.gender || "-"}
          </p>
          <p>
            <span className="text-slate-600">Aadhar Number:</span>{" "}
            {profile.adharNo ? `•••• •••• ${profile.adharNo.slice(-4)}` : "-"}
          </p>
        </ProfileSection>

        <ProfileSection
          title="Contact Details"
          editable={true}
          className="bg-white border border-green-200 rounded-xl p-6"
        >
          <p>
            <span className="text-slate-600">Email:</span> {profile.email || "-"}
          </p>
          <p>
            <span className="text-slate-600">Phone:</span>{" "}
            {profile.phNo || profile.phoneNumber || "Not provided"}
          </p>
          <p>
            <span className="text-slate-600">City:</span>{" "}
            {profile.city || "Not specified"}
          </p>
        </ProfileSection>

        <ProfileSection
          title="Travel Preferences"
          editable={true}
          className="bg-white border border-green-200 rounded-xl p-6"
        >
          <p>
            <span className="text-slate-600">Preferred Vehicle:</span> Sedan
          </p>
          <p>
            <span className="text-slate-600">Favorite Route:</span> Home → Office
          </p>
          <p>
            <span className="text-slate-600">Peak Travel Time:</span> Morning
          </p>
        </ProfileSection>

        <ProfileSection
          title="Payment & Savings"
          editable={false}
          className="bg-white border border-green-200 rounded-xl p-6"
        >
          <p>
            <span className="text-slate-600">Default Payment:</span> UPI
          </p>
          <p>
            <span className="text-slate-600">Total Spent:</span> ₹42,500
          </p>
          <p>
            <span className="text-slate-600">Saved via Offers:</span> ₹3,200
          </p>
        </ProfileSection>

        <ProfileSection
          title="Account Status"
          editable={false}
          className="bg-white border border-green-200 rounded-xl p-6"
        >
          <p>
            <span className="text-slate-600">Account:</span>{" "}
            <span className="text-green-700 font-semibold">Active</span>
          </p>
          <p>
            <span className="text-slate-600">Member Since:</span>{" "}
            {new Date(profile.createdAt || Date.now()).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </ProfileSection>
      </div>

      {/* ---------- Map Section ---------- */}
      <div className="bg-white border border-green-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-green-800 mb-4">
          Saved Locations
        </h3>
        <div className="h-[480px] rounded-lg overflow-hidden border border-slate-200">
          <UserLocationMap />
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;