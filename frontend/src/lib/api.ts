import axios from "axios";
import { useAuthStore } from "./stores/auth-store";
import { API_CONFIG } from "../config/api.config";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      useAuthStore.getState().logout();
    }
    // Suspended account: logout and clear token so user cannot use app
    if (
      status === 403 &&
      error.response?.data?.error?.toLowerCase().includes("suspended")
    ) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export const apiClient = api;
export default api;
