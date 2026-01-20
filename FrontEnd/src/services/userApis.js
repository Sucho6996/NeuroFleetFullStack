// src/services/userApis.js
import userApi from "./userService";

// Get Available Vehicles for Customers
export const getAvailableVehicles = async () => {
  try {
    // Try customer-specific endpoint first
    const response = await userApi.post("/user/getAvailableVehicles");
    return response.data;
  } catch (error) {
    // Fallback: if customer endpoint doesn't exist, use the general endpoint
    // This might require backend implementation, but for now we'll handle it gracefully
    console.warn("Customer vehicles endpoint not available, using fallback:", error);
    throw error;
  }
};

// Book Vehicle
export const bookVehicle = async (bookingData) => {
  const response = await userApi.post("/user/bookVehicle", bookingData);
  return response.data;
};

// Get Customer Bookings
export const getCustomerBookings = async () => {
  const response = await userApi.post("/user/getBookings");
  return response.data;
};

