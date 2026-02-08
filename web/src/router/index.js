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
import FAQContact from "../views/FAQContact.vue";
import CompanyRegister from "../views/CompanyRegister.vue";
import CompanyLayout from "../views/CompanyLayout.vue";
import CompanyDashboard from "../views/company/CompanyDashboard.vue";
import CompanyTrips from "../views/company/CompanyTrips.vue";
import CompanyAddTrip from "../views/company/CompanyAddTrip.vue";
import CompanyBookings from "../views/company/CompanyBookings.vue";
import CompanyProfile from "../views/CompanyProfile.vue";
import CompaniesList from "../views/CompaniesList.vue";
import AdminLayout from "../views/AdminLayout.vue";
import AdminOverview from "../views/admin/AdminOverview.vue";
import AdminUsers from "../views/admin/AdminUsers.vue";
import AdminTrips from "../views/admin/AdminTrips.vue";
import AdminBookings from "../views/admin/AdminBookings.vue";
import AdminSites from "../views/admin/AdminSites.vue";
import AdminRevenue from "../views/admin/AdminRevenue.vue";
import AdminCompanies from "../views/admin/AdminCompanies.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/register-company", component: CompanyRegister },
  { path: "/sites", component: SitesList },
  { path: "/sites/:id", component: SiteDetails },
  { path: "/trips", component: TripsList },
  { path: "/trips/:id", component: TripDetails },
  { path: "/bookings", component: Bookings },
  { path: "/reviews", component: CustomerReviews },
  { path: "/faq", component: FAQContact },
  { path: "/companies", component: CompaniesList },
  { path: "/companies/:id", component: CompanyProfile },
  {
    path: "/company",
    component: CompanyLayout,
    children: [
      { path: "", redirect: "/company/dashboard" },
      { path: "dashboard", component: CompanyDashboard },
      { path: "trips", component: CompanyTrips },
      { path: "add-trip", component: CompanyAddTrip },
      { path: "edit-trip/:id", component: CompanyAddTrip },
      { path: "bookings", component: CompanyBookings }
    ]
  },
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
      { path: "companies", component: AdminCompanies },
      { path: "revenue", component: AdminRevenue }
    ]
  }
];

const router = createRouter({ history: createWebHistory(), routes });
export default router;
