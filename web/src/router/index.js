import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import SitesList from "../views/SitesList.vue";
import SiteDetails from "../views/SiteDetails.vue";
import TripsList from "../views/TripsList.vue";
import TripDetails from "../views/TripDetails.vue";
import Bookings from "../views/Bookings.vue";
import CustomerReviews from "../views/CustomerReviews.vue";
import AdminLayout from "../views/AdminLayout.vue";
import AdminOverview from "../views/admin/AdminOverview.vue";
import AdminUsers from "../views/admin/AdminUsers.vue";
import AdminTrips from "../views/admin/AdminTrips.vue";
import AdminBookings from "../views/admin/AdminBookings.vue";
import AdminSites from "../views/admin/AdminSites.vue";
import AdminRevenue from "../views/admin/AdminRevenue.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/sites", component: SitesList },
  { path: "/sites/:id", component: SiteDetails },
  { path: "/trips", component: TripsList },
  { path: "/trips/:id", component: TripDetails },
  { path: "/bookings", component: Bookings },
  { path: "/reviews", component: CustomerReviews },
  { 
    path: "/admin", 
    component: AdminLayout,
    children: [
      { path: "", redirect: "/admin/dashboard" },
      { path: "dashboard", component: AdminOverview },
      { path: "users", component: AdminUsers },
      { path: "trips", component: AdminTrips },
      { path: "bookings", component: AdminBookings },
      { path: "sites", component: AdminSites },
      { path: "revenue", component: AdminRevenue }
    ]
  }
];

const router = createRouter({ history: createWebHistory(), routes });
export default router;
