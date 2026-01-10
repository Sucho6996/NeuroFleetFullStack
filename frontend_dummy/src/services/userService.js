// src/services/userService.js
import createServiceApi from "./api";

const userApi = createServiceApi(import.meta.env.VITE_USER_SERVICE_URL);

export default userApi;