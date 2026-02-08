<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src="/images/logo.png" alt="Logo" class="logo" />
        <h2>Syriavana</h2>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item" active-class="active">
          <PhSquaresFour class="icon" />
          <span>Dashboard</span>
        </router-link>
        <router-link to="/admin/users" class="nav-item" active-class="active">
          <PhUsers class="icon" />
          <span>Users</span>
        </router-link>
        <router-link to="/admin/trips" class="nav-item" active-class="active">
          <PhAirplaneTilt class="icon" />
          <span>Trips</span>
        </router-link>
        <router-link to="/admin/bookings" class="nav-item" active-class="active">
          <PhTicket class="icon" />
          <span>Bookings</span>
        </router-link>
        <router-link to="/admin/sites" class="nav-item" active-class="active">
          <PhMapPin class="icon" />
          <span>Sites</span>
        </router-link>
        <router-link to="/admin/companies" class="nav-item" active-class="active">
          <PhBuildings class="icon" />
          <span>Companies</span>
        </router-link>
        <router-link to="/admin/revenue" class="nav-item" active-class="active">
          <PhCurrencyDollar class="icon" />
          <span>Revenue</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <a href="#" class="nav-item logout">
          <PhSignOut class="icon" />
          <span>Logout</span>
        </a>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="top-header">
        <div class="user-profile">
          <span>Admin User</span>
          <div class="avatar">A</div>
        </div>
      </header>

      <router-view />
    </main>
  </div>
</template>

<script setup>
import { 
  PhSquaresFour, 
  PhUsers, 
  PhAirplaneTilt, 
  PhTicket, 
  PhMapPin, 
  PhSignOut,
  PhCurrencyDollar,
  PhBuildings
} from '@phosphor-icons/vue';
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
}

.logo {
  width: 40px;
  height: 40px;
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
  justify-content: flex-end; /* Align profile to right */
  align-items: center;
  margin-bottom: 30px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: #FFC805;
  color: #235789;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>