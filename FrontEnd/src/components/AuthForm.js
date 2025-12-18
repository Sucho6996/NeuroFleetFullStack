import React, { useState } from "react";
import "../styles/style.css";

export default function AuthForm({ setLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [phNo, setPhNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [adhar, setAdhar] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [registrationNo, setRegistrationNo] = useState(""); 
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const SERVICE_URLS = {
  "Customer": "http://localhost:8080/user",
  "Driver": "http://localhost:8082/driver",
  "Fleet Manager": "http://localhost:8081/fleetManager", 
  "Admin": "http://localhost:8083/admin",
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPass) {
      setError("Passwords do not match");
      return;
    }

    if (!role) {
      setError("Please select a role");
      return;
    }

    const baseUrl = SERVICE_URLS[role];
    const url = isLogin ? `${baseUrl}/login` : `${baseUrl}/signup`;

    const payload = isLogin
      ? { email, password }
      : { email,
        password,
        name,
        gender,
        role,
        adhar: role === "Customer" ? adhar : undefined,
        licenceNumber: role=== "Driver" ? licenceNumber : undefined,
        companyName: role=== "Fleet manager" ? companyName : undefined,
        registrationNo: role=== "Admin" ? registrationNo : undefined, 
  };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.Message);
        localStorage.setItem("role", role);
        setLoggedIn(true);
      } else {
        alert("Signup successful! Please login now.");
        setIsLogin(true);
      }
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-toggle">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <h2>NeuroFleet</h2>

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {!isLogin && (
            <>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phNo}
                onChange={(e) => setPhNo(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </>
          )}
          

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Customer">Customer</option>
            <option value="Fleet Manager">Fleet Manager</option>
            <option value="Admin">Admin</option>
            <option value="Driver">Driver</option>
          </select>

          {!isLogin && role=== "Customer" && (
            <input
              type="text"
              placeholder="Adhar Number"
              value={adhar}
              onChange={(e) => setAdhar(e.target.value)}
              required
            />
          )}

          {!isLogin && role=== "Driver" && (
            <input
              type="text"
              placeholder="License Number"
              value={licenceNumber}
              onChange={(e) => setLicenceNumber(e.target.value)}
              required
            />
          )}

          {!isLogin && role=== "Fleet Manager" && (
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          )}

          {!isLogin && role=== "Admin" && (
            <input
              type="text"
              placeholder="Company Registration Number"
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          )}

          {isLogin && <a href="#" className="forgot">Forgot Password?</a>}

          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>

          {isLogin && (
            <p>
              Not a member?{" "}
              <a href="#" onClick={() => setIsLogin(false)}>
                Signup now
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
