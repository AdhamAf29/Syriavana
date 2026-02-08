<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src="/images/logo.png" alt="Logo" class="logo" />
        <h2>Syriavana</h2>
        <span class="badge">Partner</span>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/company/dashboard" class="nav-item" active-class="active">
          <PhSquaresFour class="icon" />
          <span>Dashboard</span>
        </router-link>
        <router-link to="/company/trips" class="nav-item" active-class="active">
          <PhAirplaneTilt class="icon" />
          <span>My Trips</span>
        </router-link>
        <router-link to="/company/bookings" class="nav-item" active-class="active">
          <PhUsers class="icon" />
          <span>Bookings</span>
        </router-link>
        <router-link to="/company/add-trip" class="nav-item" active-class="active">
          <PhPlusCircle class="icon" />
          <span>Add New Trip</span>
        </router-link>
        <router-link :to="`/companies/${auth.user?.id}`" class="nav-item" active-class="active">
          <PhStorefront class="icon" />
          <span>Public Profile</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <a href="#" @click.prevent="logout" class="nav-item logout">
          <PhSignOut class="icon" />
          <span>Logout</span>
        </a>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="top-header">
        <div class="user-profile">
          <span>{{ auth.user?.name }}</span>
          <div class="avatar">{{ auth.user?.name?.charAt(0) }}</div>
        </div>
      </header>

      <router-view />
    </main>
  </div>
</template>

<script setup>
import { 
  PhSquaresFour, 
  PhAirplaneTilt, 
  PhPlusCircle, 
  PhStorefront, 
  PhSignOut,
  PhUsers
} from '@phosphor-icons/vue';
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push("/login");
}
</script>

<style scoped>
/* Layout */
.dashboard-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #F5F7FA;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #235789;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  flex-shrink: 0;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
}

.sidebar-header h2 {
  font-size: 1.2rem;
  margin: 0;
}

.badge {
  background: #FFC805;
  color: #1a1a1a;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
}

.logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
  font-weight: 500;
}

.nav-item:hover, .nav-item.active {
  background-color: rgba(255, 200, 5, 0.1);
  color: #FFC805;
}

.nav-item .icon {
  font-size: 20px;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  height: 100%;
}

.top-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 8px 16px;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.avatar {
  width: 32px;
  height: 32px;
  background-color: #235789;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>
