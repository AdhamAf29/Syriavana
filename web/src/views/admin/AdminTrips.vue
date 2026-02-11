<template>
  <div class="admin-page">
    <header class="page-header">
      <h1>Trips Management</h1>
      <p>Manage all trips created by companies</p>
    </header>

    <div v-if="loading" class="loading">Loading trips...</div>

    <div v-else-if="trips.length === 0" class="empty-state">
      <p>No trips found.</p>
    </div>

    <div v-else class="content-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Trip Title</th>
            <th>Company</th>
            <th>Price</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trip in trips" :key="trip._id">
            <td>
              <div class="trip-info">
                <img :src="trip.images?.[0] || '/images/placeholder.jpg'" alt="" style="width:40px; height:40px; border-radius:6px; object-fit:cover;">
                <span>{{ trip.title }}</span>
              </div>
            </td>
            <td>{{ trip.userId?.name || trip.companyId?.name || 'N/A' }}</td>
            <td>${{ trip.price }}</td>
            <td>{{ new Date(trip.startDate).toLocaleDateString() }}</td>
            <td>
              <span class="badge" :class="trip.active ? 'active' : 'inactive'">
                {{ trip.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <router-link :to="`/trips/${trip._id}`" class="btn-view" target="_blank">View</router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../api";

const trips = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get("/api/admin/trips");
    trips.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.page-header { margin-bottom: 30px; }
.page-header h1 { font-size: 24px; color: #235789; margin-bottom: 8px; }
.page-header p { color: #7f8c8d; }

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  overflow-x: auto;
}

.admin-page { direction: rtl; }

.data-table { width: 100%; border-collapse: collapse; min-width: 600px; direction: rtl; }
.data-table th, .data-table td {
  padding: 15px 20px;
  text-align: right;
  border-bottom: 1px solid #eee;
}
.data-table th { background: #f8f9fa; color: #2c3e50; font-weight: 600; }
.data-table tr:hover { background: #f8f9fa; }

.trip-info { display: flex; align-items: center; gap: 10px; }
.trip-img {
  width: 40px; height: 40px;
  border-radius: 6px;
  background-size: cover; background-position: center;
  background-color: #eee;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.badge.active { background: #d4edda; color: #155724; }
.badge.inactive { background: #f8d7da; color: #721c24; }

.btn-view {
  color: #235789; text-decoration: none; font-weight: 600; font-size: 14px;
}
.btn-view:hover { text-decoration: underline; }

.loading, .empty-state { padding: 40px; text-align: center; color: #7f8c8d; }
</style>