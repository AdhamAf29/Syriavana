<template>
  <div class="admin-page">
    <header class="page-header">
      <h1>Bookings Management</h1>
      <p>Monitor and manage trip bookings</p>
    </header>

    <div v-if="loading" class="loading">Loading bookings...</div>

    <div v-else-if="bookings.length === 0" class="empty-state">
      <p>No bookings found.</p>
    </div>

    <div v-else class="content-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Trip</th>
            <th>People</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking._id">
            <td>
              <div class="user-info">
                <span>{{ booking.userId?.name || 'Unknown User' }}</span>
                <span class="sub-text">{{ booking.userId?.email }}</span>
              </div>
            </td>
            <td>{{ booking.tripId?.title || 'Unknown Trip' }}</td>
            <td>{{ booking.numberOfPeople }}</td>
            <td>${{ (booking.tripId?.price || 0) * booking.numberOfPeople }}</td>
            <td>
              <span class="badge" :class="booking.bookingStatus">
                {{ booking.bookingStatus }}
              </span>
            </td>
            <td>{{ new Date(booking.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../api";

const bookings = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get("/api/admin/bookings");
    bookings.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.admin-page { direction: rtl; }
.page-header { margin-bottom: 30px; text-align: right; }
.page-header h1 { font-size: 24px; color: #235789; margin-bottom: 8px; }
.page-header p { color: #7f8c8d; }

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  overflow-x: auto;
}

.data-table { width: 100%; border-collapse: collapse; min-width: 600px; direction: rtl; }
.data-table th, .data-table td {
  padding: 15px 20px;
  text-align: right;
  border-bottom: 1px solid #eee;
}
.data-table th { background: #f8f9fa; color: #2c3e50; font-weight: 600; }
.data-table tr:hover { background: #f8f9fa; }

.user-info { display: flex; flex-direction: column; align-items: flex-start; }
.sub-text { font-size: 12px; color: #7f8c8d; }

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}
.badge.confirmed { background: #d4edda; color: #155724; }
.badge.pending { background: #fff3cd; color: #856404; }
.badge.cancelled { background: #f8d7da; color: #721c24; }

.loading, .empty-state { padding: 40px; text-align: center; color: #7f8c8d; }
</style>