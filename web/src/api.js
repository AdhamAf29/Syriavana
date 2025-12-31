import axios from "axios";
import { useAuthStore } from "./store/auth.js";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((cfg) => {
  const s = useAuthStore();
  const t = s.token || localStorage.getItem("token");
  if (t) cfg.headers["Authorization"] = "Bearer " + t;
  return cfg;
});

export async function uploadImage(file, folder = "sites") {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const r = await api.post("/api/uploads", fd, { headers: { "Content-Type": "multipart/form-data" } });
  return r.data; // { url, filename }
}

export default api;
