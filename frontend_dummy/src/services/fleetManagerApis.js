// src/services/fleetManagerApis.js
import fleetManagerApi from "./fleetManagerService";

// Add Vehicle
export const addVehicle = async (vehicleData) => {
  const response = await fleetManagerApi.post("/fleetManager/addVehicle", vehicleData);
  return response.data;
};

// Update Vehicle Fuel
export const updateVehicleFuel = async (regNo, fuel) => {
  const response = await fleetManagerApi.post(
    `/fleetManager/updateVehicle?regNo=${regNo}&fuel=${fuel}`,
    null
  );
  return response.data;
};

// Get All Vehicles ✅
export const getAllVehicles = async () => {
  try {
    const response = await fleetManagerApi.post("/fleetManager/seeVehicles");
    // Handle different response formats
    if (response && response.data) {
      // If response.data is already an array, return it
      if (Array.isArray(response.data)) {
        return response.data;
      }
      // If response.data has a data property, return that
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      // If response.data has a vehicles property, return that
      if (response.data.vehicles && Array.isArray(response.data.vehicles)) {
        return response.data.vehicles;
      }
      // Otherwise return the whole response.data object
      return response.data;
    }
    return response.data || [];
  } catch (error) {
    console.error("Error in getAllVehicles:", error);
    throw error;
  }
};

// Get Single Vehicle
export const getVehicleByRegNo = async (regNo) => {
  const response = await fleetManagerApi.post(
    "/fleetManager/seeVehicle",
    null,
    { params: { regNo } }
  );
  return response.data;
};

// Delete Vehicle
export const deleteVehicle = async (regNo) => {
  const response = await fleetManagerApi.post("/fleetManager/deleteVehicle", null, {
    params: { regNo },
  });
  return response.data;
};

// Add Alert
export const addAlert = async (alertData) => {
  const response = await fleetManagerApi.post("/addAllert", alertData);
  return response.data;
};

// Get All Alerts
export const getAllAlerts = async () => {
  const response = await fleetManagerApi.post("/showAllAllerts");
  return response.data;
};

// Report Overspeeding
export const reportOverspeeding = async (overspeedingData) => {
  const response = await fleetManagerApi.post("/fleetManager/overSpeeding", overspeedingData);
  return response.data;
};