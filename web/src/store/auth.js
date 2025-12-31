import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({ token: localStorage.getItem("token") || "", user: JSON.parse(localStorage.getItem("user") || "null") }),
  getters: { loggedIn: (s) => !!s.token },
  actions: {
    setAuth(t, u) { this.token = t; this.user = u; localStorage.setItem("token", t); localStorage.setItem("user", JSON.stringify(u)); },
    logout() { this.token = ""; this.user = null; localStorage.removeItem("token"); localStorage.removeItem("user"); }
  }
});
