import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Input from '../components/Input.jsx';
import { Link, useNavigate } from 'react-router-dom';
import SelectRole from '../components/SelectRole.jsx';
import { login } from '../services/authService.js';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(''); // e.g., "customer", "admin"
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Clear any old auth data on mount
  // useEffect(() => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('role');
  //   localStorage.removeItem('email');
  // }, []);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setRole(value); // value is lowercase: "customer", "driver", etc.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert('Please select a role');
      return;
    }

    if (!formData.email || !formData.password) {
      alert('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      // Call our new login function from authService
      const response = await login(role.toUpperCase(), {
        email: formData.email.trim(),
        password: formData.password,
      });

      // Extract token — handle both possible formats
      const token =
        response?.token ||           // Standard { token: "..." }
        response?.Message ||         // Your current format { Message: "<JWT>" }
        response?.data?.token ||
        response?.data?.Message;

      if (!token || typeof token !== 'string') {
        throw new Error('Invalid response: No token received');
      }

      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('role', role.toUpperCase());
      localStorage.setItem('email', formData.email.trim());

      console.log("✅ BEFORE STORE:", localStorage);


      // Redirect based on role
      const roleUpper = role.toUpperCase();
      switch (roleUpper) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'FLEET_MANAGER':
          navigate('/fleetmanager/dashboard');
          break;
        case 'DRIVER':
          navigate('/driver/dashboard');
          break;
        case 'CUSTOMER':
          navigate('/customer/dashboard');
          break;
        default:
          alert('Unknown role. Redirecting to home.');
          navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.message ||
        'Invalid email or password. Please try again.';

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
        {/* LEFT SIDE – Login Form */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center backdrop-blur-md bg-black/50 px-8">
          <div className="w-full max-w-md text-white">
            <h3 className="text-3xl font-semibold text-center mb-2">
              Welcome back to NeuroFleetX
            </h3>
            <p className="text-center text-white/80 mb-8">
              Please enter your details to login
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange('password')}
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
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <p className="text-sm text-center text-white/70 mt-6">
                Don’t have an account?{' '}
                <Link to="/signup" className="underline font-medium hover:text-white">
                  Signup
                </Link>
              </p>
            </form>
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

export default Login;