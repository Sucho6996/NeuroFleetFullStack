import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Input from "../components/Input.jsx";
import SelectRole from "../components/SelectRole.jsx";
import Select from "../components/Select.jsx";
import { login, signupByRole } from "../services/authService.js";

const Auth = () => {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (token && role) {
      const roleUpper = role.toUpperCase();
      switch (roleUpper) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "FLEET_MANAGER":
          navigate("/fleetmanager/dashboard");
          break;
        case "DRIVER":
          navigate("/driver/dashboard");
          break;
        case "CUSTOMER":
          navigate("/customer/dashboard");
          break;
        default:
          // Stay on auth page if role is unknown
          break;
      }
    }
  }, [navigate]);
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form data
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form data
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const handleLoginChange = (field) => (e) => {
    setLoginData({ ...loginData, [field]: e.target.value });
  };

  const handleSignupChange = (field) => (e) => {
    setSignupData({ ...signupData, [field]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role");
      return;
    }

    if (!loginData.email || !loginData.password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await login(role.toUpperCase(), {
        email: loginData.email.trim(),
        password: loginData.password,
      });

      const token =
        response?.token ||
        response?.Message ||
        response?.data?.token ||
        response?.data?.Message;

      if (!token || typeof token !== "string") {
        throw new Error("Invalid response: No token received");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role.toUpperCase());
      localStorage.setItem("email", loginData.email.trim());

      // Redirect based on role
      const roleUpper = role.toUpperCase();
      switch (roleUpper) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "FLEET_MANAGER":
          navigate("/fleetmanager/dashboard");
          break;
        case "DRIVER":
          navigate("/driver/dashboard");
          break;
        case "CUSTOMER":
          navigate("/customer/dashboard");
          break;
        default:
          alert("Unknown role. Redirecting to home.");
          navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.message ||
        "Invalid email or password. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Prepare payload
    const payload = {
      fullName: signupData.name.trim(),
      email: signupData.email.trim(),
      password: signupData.password,
      gender: signupData.gender,
    };

    // Add role-specific fields
    if (role === "admin") {
      payload.registrationNo = signupData.registrationNo.trim();
    } else if (role === "fleet_manager") {
      payload.companyName = signupData.companyName.trim();
    } else if (role === "driver") {
      payload.drivingLicenseNumber = signupData.licenseNumber.trim();
      payload.phoneNumber = signupData.phoneNumber.trim();
    } else if (role === "customer") {
      payload.adharNo = signupData.adharNo.trim();
      payload.phoneNumber = signupData.phoneNumber.trim();
      payload.city = signupData.city.trim();
    }

    setLoading(true);

    try {
      await signupByRole(role, payload);
      alert("Signup successful! Please login to continue.");
      setIsLogin(true);
      setError("");
      // Reset signup form
      setSignupData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        registrationNo: "",
        companyName: "",
        licenseNumber: "",
        phoneNumber: "",
        city: "",
        adharNo: "",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.message ||
        "Signup failed. Please check your details and try again.";
      setError(errorMessage);
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
        {/* LEFT SIDE – Form */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center backdrop-blur-md bg-black/50 px-8">
          <div className="w-full max-w-md text-white">
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  isLogin
                    ? "bg-green-600 text-white"
                    : "bg-white/20 text-white/70 hover:bg-white/30"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  !isLogin
                    ? "bg-green-600 text-white"
                    : "bg-white/20 text-white/70 hover:bg-white/30"
                }`}
              >
                Sign Up
              </button>
            </div>

            <h3 className="text-3xl font-semibold text-center mb-2">
              {isLogin ? "Welcome back to NeuroFleetX" : "Create an account"}
            </h3>
            <p className="text-center text-white/80 mb-8">
              {isLogin
                ? "Please enter your details to login"
                : "Please enter your details to Sign Up"}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* LOGIN FORM */}
            {isLogin && (
              <form onSubmit={handleLogin} className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={handleLoginChange("email")}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange("password")}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-green-700/70 hover:bg-green-500/70 disabled:opacity-70 disabled:cursor-not-allowed transition rounded-lg font-medium"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            )}

            {/* SIGNUP FORM */}
            {!isLogin && (
              <form onSubmit={handleSignup} className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    type="text"
                    value={signupData.name}
                    onChange={handleSignupChange("name")}
                    required
                  />
                  <Input
                    label="Email Address"
                    placeholder="name@example.com"
                    type="email"
                    value={signupData.email}
                    onChange={handleSignupChange("email")}
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
                      value={signupData.gender}
                      onChange={(value) =>
                        setSignupData({ ...signupData, gender: value })
                      }
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
                      value={signupData.registrationNo}
                      onChange={handleSignupChange("registrationNo")}
                      required
                    />
                  )}

                  {role === "fleet_manager" && (
                    <Input
                      label="Company Name"
                      placeholder="ABC Logistics Pvt Ltd"
                      type="text"
                      value={signupData.companyName}
                      onChange={handleSignupChange("companyName")}
                      required
                    />
                  )}

                  {role === "driver" && (
                    <>
                      <Input
                        label="Driving License Number"
                        placeholder="DL-xx-xxxx-xxxx"
                        type="text"
                        value={signupData.licenseNumber}
                        onChange={handleSignupChange("licenseNumber")}
                        required
                      />
                      <Input
                        label="Phone Number"
                        placeholder="xxxx-xxx-xxxx"
                        type="text"
                        value={signupData.phoneNumber}
                        onChange={handleSignupChange("phoneNumber")}
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
                        value={signupData.phoneNumber}
                        onChange={handleSignupChange("phoneNumber")}
                      />
                      <Input
                        label="City"
                        type="text"
                        placeholder="e.g., Mumbai"
                        value={signupData.city}
                        onChange={handleSignupChange("city")}
                        required
                      />
                      <Input
                        label="Aadhar Number"
                        placeholder="xxxx xxxx xxxx"
                        type="text"
                        value={signupData.adharNo}
                        onChange={handleSignupChange("adharNo")}
                        required
                      />
                    </>
                  )}

                  <div className="col-span-1 md:col-span-2">
                    <Input
                      label="Password"
                      placeholder="Enter strong password"
                      type="password"
                      value={signupData.password}
                      onChange={handleSignupChange("password")}
                      required
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Input
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange("confirmPassword")}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-green-700/70 hover:bg-green-500/70 disabled:opacity-70 disabled:cursor-not-allowed transition rounded-lg font-medium"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT SIDE – App Description */}
        <div className="hidden lg:flex w-1/2 h-full items-center justify-center px-16">
          <div className="text-white max-w-xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight text-white">
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
      </div>
    </div>
  );
};

export default Auth;
