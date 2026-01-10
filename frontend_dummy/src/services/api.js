// src/services/api.js
import axios from "axios";

const createServiceApi = (baseURL) => {
  const instance = axios.create({
    baseURL: baseURL || "",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor: add JWT token except for login/signup
  instance.interceptors.request.use((config) => {
    const isAuthEndpoint = config.url?.includes("/login") || config.url?.includes("/signup");
    if (!isAuthEndpoint) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Response interceptor: handle 401 globally
  // Inside the response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("🔴 API Error Details:", {
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      console.warn("🔴 401 Detected – Clearing auth and redirecting to login");
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("role");
    //   localStorage.removeItem("email");
    //   window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

  return instance;
};

export default createServiceApi;