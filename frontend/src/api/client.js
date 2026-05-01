import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lms_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      if (!location.pathname.startsWith("/login") && !location.pathname.startsWith("/register"))
        location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
