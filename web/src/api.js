import axios from "axios";
import { useAuthStore } from "./store/auth.js";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((cfg) => {
  const s = useAuthStore();
  const t = s.token || localStorage.getItem("token");
  if (t) cfg.headers["Authorization"] = "Bearer " + t;
  return cfg;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if 401 comes from a non-login endpoint
    if (error.response && error.response.status === 401 && !error.config.url.includes("/auth/login")) {
      const s = useAuthStore();
      s.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export async function uploadImage(file, folder = "sites") {
  const fd = new FormData();
  fd.append("folder", folder);
  fd.append("file", file);
  const r = await api.post("/api/uploads", fd);
  return r.data; // { url, filename }
}

export default api;
