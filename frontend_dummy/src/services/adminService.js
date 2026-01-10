// src/services/adminService.js
import createServiceApi from "./api";

const adminApi = createServiceApi(import.meta.env.VITE_ADMIN_SERVICE_URL);

export default adminApi;