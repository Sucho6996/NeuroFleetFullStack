// src/pages/driver/DriverProfile.jsx
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import ProfileSection from "../../components/ProfileSection";
import UserLocationMap from "../../components/UserLocationMap";
import { getProfile, logout } from "../../services/authService"; // ← Added logout import

const DriverProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        console.log("Driver profile data:", data);
        setProfile(data);
        setError("");
      } catch (err) {
        console.error("Failed to load driver profile:", err);
        setError("Unable to load profile. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout(); // This calls POST /driver/logout and clears session
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center py-20">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
        <p className="mt-6 text-xl text-slate-600">Loading Driver Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center py-20 bg-red-50 rounded-2xl">
        <p className="text-red-700 text-xl mb-6">{error}</p>
        <button
          onClick={() => window.location.href = "/login"}
          className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-20">No profile data available.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-slate-50">
      {/* ---------- Header Card ---------- */}
      <div className="flex justify-between items-center bg-white border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <img
            src="https://m.media-amazon.com/images/I/41ONa5HOwfL._AC_UF1000,1000_QL80_.jpg"
            className="w-16 h-16 rounded-full border border-green-200 object-cover"
            alt="Driver"
          />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {profile.name || "Driver"}
            </h2>
            <p className="text-sm text-slate-600">Driver • Active</p>
            <div className="flex items-center gap-1 mt-1 text-green-700">
              <Star size={16} fill="currentColor" />
              <span className="text-sm text-slate-700">4.6 Rating</span>
            </div>
          </div>
        </div>

        {/* Replaced Edit with Logout Button */}
        <button
          onClick={handleLogout}
          className="h-fit px-6 py-2.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium shadow-md"
        >
          Logout
        </button>
      </div>

      {/* ---------- Info Sections ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ProfileSection title="Personal Info" editable={true}>
          <Row label="Email" value={profile.email || "-"} />
          <Row label="Phone" value={profile.phNo ? `+91 ${profile.phNo}` : "-"} />
          <Row label="Gender" value={profile.gender || "-"} />
        </ProfileSection>

        <ProfileSection title="Driver Details" editable={false}>
          <Row label="License No." value={profile.licenseNumber || "-"} />
          <Row label="Experience" value="4 Years" />
          <Row label="Acceptance Rate" value="92%" />
        </ProfileSection>

        <ProfileSection title="Vehicle Info" editable={false}>
          <Row label="Vehicle No." value="KA-05-MN-4455" />
          <Row label="Type" value="Mini Truck" />
          <Row label="Fuel" value="Diesel" />
        </ProfileSection>

        <ProfileSection title="Performance" editable={false}>
          <Row label="Completed Trips" value="1,248" />
          <Row label="Distance" value="18,430 km" />
          <Row label="Today Earnings" value="₹1,850" />
        </ProfileSection>

        {/* ---------- Map Section (Full Width) ---------- */}
        <div className="xl:col-span-3">
          <ProfileSection title="Saved Locations">
            <p className="text-sm text-slate-700 mb-3">
              This is your primary service & pickup area.
            </p>
            <div className="h-[420px] rounded-lg overflow-hidden border border-green-200">
              <UserLocationMap />
            </div>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
};

/* ---------- Row Component ---------- */
const Row = ({ label, value }) => (
  <div className="flex justify-between text-sm border-b border-green-100 pb-2 last:border-0">
    <span className="text-slate-600">{label}</span>
    <span className="text-slate-900 font-medium">{value}</span>
  </div>
);

export default DriverProfile;