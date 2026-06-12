import axios from "axios";
import { BASE_URL } from "./apiPaths";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Logout helper
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// Request Interceptor — attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Login/Register endpoints shouldn't trigger logout
    const isAuthRoute =
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/register");

    if (status === 401) {
      const token = localStorage.getItem("token");
      if (token && !isAuthRoute) {
        logout();
      }
    } else if (status === 403) {
      toast.error("You don't have permission to perform this action.")
    } else if (status === 404) {
      toast.error("Resource not found.")
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.")
    } else if (error.code === "ECONNABORTED") {
      toast.error("Request timed out.")
    } else if (error.request) {
      toast.error("Unable to connect to the server.")
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;