import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the admin token (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sd_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 so a stale/expired token doesn't loop forever
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("sd_admin_token");
      localStorage.removeItem("sd_admin");
    }
    return Promise.reject(err);
  }
);

export default api;
