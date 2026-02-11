<template>
  <div class="company-bookings">
    <header class="page-header">
      <h1>Booking Requests</h1>
    </header>

    <div v-if="loading" class="loading">Loading bookings...</div>
    
    <div v-else-if="bookings.length === 0" class="empty-state">
      <p>No bookings received yet.</p>
    </div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>Trip</th>
            <th>Customer</th>
            <th>People</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in bookings" :key="b._id">
            <td>{{ b.tripId?.title || 'Unknown Trip' }}</td>
            <td>
              <div class="customer-info">
                <strong>{{ b.userId?.name }}</strong>
                <span>{{ b.userId?.email }}</span>
                <span>{{ b.userId?.phone }}</span>
              </div>
            </td>
            <td>{{ b.numberOfPeople }}</td>
            <td>{{ new Date(b.createdAt).toLocaleDateString() }}</td>
            <td>
              <span :class="['badge', b.bookingStatus]">{{ b.bookingStatus }}</span>
            </td>
            <td>
              <!-- Future: Confirm/Cancel actions -->
              <span class="text-muted">No actions</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../store/auth";
import api from "../../api";

const auth = useAuthStore();
const bookings = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get("/api/bookings/company");
    bookings.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: #235789;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px 20px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.customer-info {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.customer-info span {
  color: #666;
  font-size: 0.8rem;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge.confirmed { background: #e6f7e6; color: #2ecc71; }
.badge.pending { background: #fff9e6; color: #f39c12; }
.badge.cancelled { background: #fee; color: #e74c3c; }

.empty-state {
  text-align: center;
  padding: 50px;
  color: #666;
  background: white;
  border-radius: 12px;
}
</style>