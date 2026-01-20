// src/services/driverService.js
import createServiceApi from "./api";

const driverApi = createServiceApi(import.meta.env.VITE_DRIVER_SERVICE_URL);

export default driverApi;