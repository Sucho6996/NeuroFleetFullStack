// src/services/authService.js

import userApi from "./userService";
import driverApi from "./driverService";
import fleetManagerApi from "./fleetManagerService";
import adminApi from "./adminService";

const getEndpoint = (role, type) => {
  // type: "login" or "signup"
  const lowerRole = role.toLowerCase();

  if (lowerRole === "customer") return `/user/${type}`;
  if (lowerRole === "admin") return `/admin/${type}`;
  if (lowerRole === "driver") return `/driver/${type}`;
  if (lowerRole === "fleet_manager") return `/fleetManager/${type}`;

  throw new Error("Invalid role");
};

export const login = async (role, credentials) => {
  let apiInstance;
  const endpoint = getEndpoint(role, "login");

  switch (role.toUpperCase()) {
    case "CUSTOMER":
      apiInstance = userApi;
      break;
    case "ADMIN":
      apiInstance = adminApi;
      break;
    case "FLEET_MANAGER":
      apiInstance = fleetManagerApi;
      break;
    case "DRIVER":
      apiInstance = driverApi;
      break;
    default:
      throw new Error("Invalid role for login");
  }

  const response = await apiInstance.post(endpoint, {
    email: credentials.email,
    password: credentials.password,
  });

  return response.data;
};

export const signupByRole = async (role, data) => {
  let apiInstance;
  const endpoint = getEndpoint(role, "signup");
  let payload = {};

  switch (role.toLowerCase()) {
    case "customer":
      apiInstance = userApi;
      payload = {
        email: data.email,
        name: data.fullName || data.name,
        password: data.password,
        role: "CUSTOMER",
        gender: data.gender,
        adharNo: data.adharNo,
        phNo: data.phoneNumber,
        city: data.city,
      };
      break;

    case "driver":
      apiInstance = driverApi;
      payload = {
        email: data.email,
        name: data.fullName || data.name,
        password: data.password,
        role: "DRIVER",
        gender: data.gender,
        licenseNumber: data.drivingLicenseNumber || data.licenseNumber,
        phNo: data.phoneNumber,
      };
      break;

    case "fleet_manager":
      apiInstance = fleetManagerApi;
      payload = {
        email: data.email,
        name: data.fullName || data.name,
        password: data.password,
        role: "FLEET_MANAGER",
        gender: data.gender,
        companyName: data.companyName,
      };
      break;

    case "admin":
      apiInstance = adminApi;
      payload = {
        email: data.email,
        name: data.fullName || data.name,
        password: data.password,
        role: "ADMIN",
        gender: data.gender,
        registrationNo: data.registrationNo,
      };
      break;

    default:
      throw new Error("Invalid role for signup");
  }

  const response = await apiInstance.post(endpoint, payload);
  return response.data;
};

// ==================== PROFILE FETCH ====================

// Fetch logged-in user's profile
export const getProfile = async () => {
  const storedRole = localStorage.getItem("role");

  if (!storedRole) {
    throw new Error("No role found. Please login again.");
  }

  let normalizedRole = storedRole.toLowerCase();

  const roleMap = {
    "customer": "customer",
    "user": "customer",
    "driver": "driver",
    "fleet_manager": "fleet_manager",
    "fleetmanager": "fleet_manager",
    "admin": "admin",
    "administrator": "admin",
  };

  const role = roleMap[normalizedRole];

  if (!role) {
    console.error("Unknown stored role:", storedRole);
    throw new Error("Invalid role detected. Please login again.");
  }

  let apiInstance;
  switch (role) {
    case "customer":
      apiInstance = userApi;
      break;
    case "driver":
      apiInstance = driverApi;
      break;
    case "fleet_manager":
      apiInstance = fleetManagerApi;
      break;
    case "admin":
      apiInstance = adminApi;
      break;
    default:
      throw new Error("Role mapping failed: " + role);
  }

  try {
    // Determine the correct profile endpoint and HTTP method based on role
    let profileEndpoint;
    let httpMethod = "post"; // default

    switch (role) {
      case "customer":
        profileEndpoint = "/user/profile";
        httpMethod = "post";   // <-- changed to POST for User/Customer role
        break;
      case "driver":
        profileEndpoint = "/driver/profile";
        httpMethod = "get";
        break;
      case "fleet_manager":
        profileEndpoint = "/fleetManager/profile";
        httpMethod = "post";
        break;
      case "admin":
        profileEndpoint = "/admin/profile";
        httpMethod = "post";
        break;
      default:
        throw new Error(`Unknown role for profile: ${role}`);
    }

    console.log(`Fetching profile for role: ${role}, method: ${httpMethod.toUpperCase()}, endpoint: ${profileEndpoint}`);

    let response;
    if (httpMethod === "get") {
      response = await apiInstance.get(profileEndpoint);
    } else {
      response = await apiInstance.post(profileEndpoint);
    }

    console.log(`Profile response received:`, response.data);

    // Handle different possible response structures
    return response.data?.data || response.data || response;
  } catch (error) {
    console.error(`Profile fetch error for role ${role}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });

    if (error.response?.status === 401) {
      await logout();
    }
    throw error;
  }
};

// ==================== LOGOUT ====================

export const logout = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    localStorage.clear();
    window.location.href = "/login";
    return;
  }

  const role = localStorage.getItem("role")?.toLowerCase();
  const roleMap = { customer: "customer", driver: "driver", fleet_manager: "fleet_manager", admin: "admin" };
  const normalizedRole = roleMap[role] || role;

  let apiInstance;
  switch (normalizedRole) {
    case "customer":
      apiInstance = userApi;
      break;
    case "driver":
      apiInstance = driverApi;
      break;
    case "fleet_manager":
      apiInstance = fleetManagerApi;
      break;
    case "admin":
      apiInstance = adminApi;
      break;
    default:
      apiInstance = null;
  }

  if (apiInstance) {
    try {
      await apiInstance.post("/logout");
    } catch (error) {
      console.warn("Server logout failed, proceeding locally:", error);
    }
  }

  // Always clear local data
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  window.location.href = "/login";
};