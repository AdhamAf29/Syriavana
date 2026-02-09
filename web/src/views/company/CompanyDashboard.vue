<template>
  <div class="company-dashboard">
    <header class="page-header">
      <h1>Company Dashboard</h1>
      <p>Welcome back, {{ auth.user?.name }}</p>
    </header>

    <div class="dashboard-stats">
      <div class="stat-card">
        <h3>My Trips</h3>
        <p class="value">{{ trips.length }}</p>
        <router-link to="/company/trips" class="link">Manage Trips</router-link>
      </div>
      <div class="stat-card">
        <h3>Total Bookings</h3>
        <p class="value">{{ bookings.length }}</p>
        <router-link to="/company/bookings" class="link">View Requests</router-link>
      </div>
    </div>

    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <router-link to="/company/add-trip" class="action-card">
          <span class="icon">+</span>
          <span>Create New Trip</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../store/auth";
import api from "../../api";

const auth = useAuthStore();
const trips = ref([]);
const bookings = ref([]);

onMounted(async () => {
  try {
    const [tripsRes, bookingsRes] = await Promise.all([
      api.get("/api/trips/my-trips"),
      api.get("/api/bookings/company")
    ]);
    
    trips.value = tripsRes.data;
    bookings.value = bookingsRes.data;
  } catch (e) {
    console.error(e);
  }
});
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: #235789;
  margin-bottom: 5px;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.stat-card h3 {
  color: #666;
  font-size: 1rem;
  margin-bottom: 10px;
}

.stat-card .value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #235789;
  margin-bottom: 15px;
}

.link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}

.quick-actions h2 {
  color: #333;
  margin-bottom: 20px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-decoration: none;
  color: #666;
  transition: all 0.3s;
}

.action-card:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: #fff9e6;
}

.action-card .icon {
  font-size: 2rem;
  font-weight: bold;
}
</style>
