<template>
  <div class="company-trips">
    <header class="page-header">
      <h1>My Trips</h1>
      <router-link to="/company/add-trip" class="btn btn-primary">Add New Trip</router-link>
    </header>

    <div v-if="loading" class="loading">Loading trips...</div>
    
    <div v-else-if="trips.length === 0" class="empty-state">
      <p>You haven't created any trips yet.</p>
      <router-link to="/company/add-trip" class="btn btn-outline">Create your first trip</router-link>
    </div>

    <div v-else class="trips-grid">
      <div v-for="trip in trips" :key="trip.id || trip._id" class="trip-card">
        <div class="trip-img">
          <img :src="trip.images?.[0] || trip.image || '/images/placeholder.jpg'" alt="" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div class="trip-info">
          <h3>{{ trip.title }}</h3>
          <p class="location">{{ trip.location }}</p>
          <div class="meta">
            <span>{{ trip.duration }}</span>
            <span class="price">${{ trip.price }}</span>
          </div>
          <div class="actions">
            <button @click="editTrip(trip.id)" class="btn-sm edit">Edit</button>
            <button @click="deleteTrip(trip.id)" class="btn-sm delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../store/auth";
import api from "../../api";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();
const trips = ref([]);
const loading = ref(true);

async function fetchTrips() {
  loading.value = true;
  try {
    const res = await api.get("/api/trips/my-trips");
    trips.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function deleteTrip(id) {
  if (!confirm("Are you sure you want to delete this trip?")) return;
  try {
    await api.delete(`/api/trips/${id}`);
    trips.value = trips.value.filter(t => t.id !== id);
  } catch (e) {
    alert("Failed to delete trip");
  }
}

function editTrip(id) {
  router.push(`/company/edit-trip/${id}`);
}

onMounted(fetchTrips);
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #235789;
  margin: 0;
}

.btn-primary {
  background: var(--primary);
  color: #1a1a1a;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.trip-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.trip-img {
  height: 200px;
  background-size: cover;
  background-position: center;
}

.trip-info {
  padding: 20px;
}

.trip-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  color: #333;
}

.location {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-weight: 600;
}

.price {
  color: var(--primary);
  font-size: 1.2rem;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-sm {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.edit {
  background: #f0f0f0;
  color: #333;
}

.delete {
  background: #fee;
  color: #e74c3c;
}
</style>
