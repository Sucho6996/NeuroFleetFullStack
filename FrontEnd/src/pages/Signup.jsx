import React, { useState } from "react";
import { assets } from "../assets/assets";
import Input from "../components/Input.jsx";
import { Link, useNavigate } from "react-router-dom";
import SelectRole from "../components/SelectRole.jsx";
import Select from "../components/Select.jsx";
import { signupByRole } from "../services/authService.js"; // Already correct import

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(""); // e.g., "customer", "driver", etc.
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    registrationNo: "",
    companyName: "",
    licenseNumber: "",
    phoneNumber: "",
    city: "",
    adharNo: "",
  });

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role");
      return;
    }

    // Prepare payload exactly as expected by authService.signupByRole
    const payload = {
      fullName: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      gender: formData.gender,
    };

    // Add role-specific fields
    if (role === "admin") {
      payload.registrationNo = formData.registrationNo.trim();
    } else if (role === "fleet_manager") {
      payload.companyName = formData.companyName.trim();
    } else if (role === "driver") {
      payload.drivingLicenseNumber = formData.licenseNumber.trim();
      payload.phoneNumber = formData.phoneNumber.trim();
    } else if (role === "customer") {
      payload.adharNo = formData.adharNo.trim();
      payload.phoneNumber = formData.phoneNumber.trim(); // optional for customer?
      payload.city = formData.city.trim();
    }

    setLoading(true);

    try {
      await signupByRole(role, payload); // This now uses the correct service per role

      alert("Signup successful! Please login to continue.");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.message ||
        "Signup failed. Please check your details and try again.";

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background Image */}
      <img
        src={assets.background_img}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Split Layout */}
      <div className="relative z-10 h-full w-full flex flex-col lg:flex-row">
        {/* LEFT SIDE – Description */}
        <div className="hidden lg:flex w-full lg:w-1/2 h-full items-center justify-center px-16">
          <div className="text-white max-w-xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Smart Fleet & Traffic <br /> Management Platform
            </h1>
            <p className="text-xl leading-relaxed mb-6">
              NeuroFleetX is an AI-powered platform designed to manage fleets,
              monitor drivers, optimize routes, and enable seamless pickup-drop
              services with real-time intelligence.
            </p>
            <p className="mt-6 text-white/80 text-base leading-relaxed">
              Built for Admins, Fleet Managers, Drivers, and Customers.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE – Signup Form */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center backdrop-blur-md bg-black/50 px-8">
          <div className="w-full max-w-md text-white max-h-[85vh] overflow-y-auto pr-2 hide-scrollbar">
            <h3 className="text-3xl font-semibold text-center mb-2">
              Create an account
            </h3>
            <p className="text-center text-white/80 mb-8">
              Please enter your details to Sign Up
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  type="text"
                  value={formData.name}
                  onChange={handleChange("name")}
                  required
                />
                <Input
                  label="Email Address"
                  placeholder="name@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                />

                <div>
                  <label className="text-sm text-white/70 block mb-1">Role</label>
                  <SelectRole value={role} onChange={handleRoleChange}>
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="fleet_manager">Fleet Manager</option>
                    <option value="driver">Driver</option>
                    <option value="customer">Customer</option>
                  </SelectRole>
                </div>

                <div>
                  <label className="text-sm text-white/70 block mb-1">Gender</label>
                  <Select
                    value={formData.gender}
                    onChange={(value) => setFormData({ ...formData, gender: value })}
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                    placeholder="Select Gender"
                  />
                </div>

                {/* Role-specific fields */}
                {role === "admin" && (
                  <Input
                    label="Registration Number"
                    placeholder="Enter registration number"
                    type="text"
                    value={formData.registrationNo}
                    onChange={handleChange("registrationNo")}
                    required
                  />
                )}

                {role === "fleet_manager" && (
                  <Input
                    label="Company Name"
                    placeholder="ABC Logistics Pvt Ltd"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange("companyName")}
                    required
                  />
                )}

                {role === "driver" && (
                  <>
                    <Input
                      label="Driving License Number"
                      placeholder="DL-xx-xxxx-xxxx"
                      type="text"
                      value={formData.licenseNumber}
                      onChange={handleChange("licenseNumber")}
                      required
                    />
                    <Input
                      label="Phone Number"
                      placeholder="xxxx-xxx-xxxx"
                      type="text"
                      value={formData.phoneNumber}
                      onChange={handleChange("phoneNumber")}
                      required
                    />
                  </>
                )}

                {role === "customer" && (
                  <>
                    <Input
                      label="Phone Number"
                      placeholder="xxxx-xxx-xxxx"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange("phoneNumber")}
                    />
                    <Input
                      label="City"
                      type="text"
                      placeholder="e.g., Mumbai"
                      value={formData.city}
                      onChange={handleChange("city")}
                      required
                    />
                    <Input
                      label="Aadhar Number"
                      placeholder="xxxx xxxx xxxx"
                      type="text"
                      value={formData.adharNo}
                      onChange={handleChange("adharNo")}
                      required
                    />
                  </>
                )}

                <div className="col-span-1 md:col-span-2">
                  <Input
                    label="Password"
                    placeholder="Enter strong password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-green-700/70 hover:bg-green-500/70 disabled:opacity-70 disabled:cursor-not-allowed transition rounded-lg font-medium"
              >
                {loading ? "Creating Account..." : "Signup"}
              </button>

              <p className="text-sm text-center text-white/70 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="underline font-medium hover:text-white">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;