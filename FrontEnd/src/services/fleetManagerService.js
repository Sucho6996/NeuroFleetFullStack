// src/services/fleetManagerService.js
import createServiceApi from "./api";

const fleetManagerApi = createServiceApi(import.meta.env.VITE_FLEET_MANAGER_SERVICE_URL);

export default fleetManagerApi;