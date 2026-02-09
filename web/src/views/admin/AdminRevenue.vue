<template>
  <div class="admin-page">
    <header class="page-header">
      <h1>Revenue Analysis</h1>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading revenue data...</p>
    </div>

    <div v-else class="content">
      <!-- Summary Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper">
            <PhCurrencyDollar class="stat-icon" />
          </div>
          <div class="stat-info">
            <h3>${{ totalRevenue.toLocaleString() }}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div class="stat-card">
           <div class="stat-icon-wrapper">
            <PhTrendUp class="stat-icon" />
          </div>
          <div class="stat-info">
            <h3>{{ bookings.length }}</h3>
            <p>Total Transactions</p>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="table-container">
        <h2>Transactions</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Trip</th>
              <th>Company</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in bookings" :key="item._id">
              <td>{{ new Date(item.createdAt).toLocaleDateString() }}</td>
              <td>{{ item.tripId?.title || 'Unknown Trip' }}</td>
              <td>{{ item.tripId?.companyId?.name || 'Unknown Company' }}</td>
              <td>{{ item.userId?.name || 'Unknown User' }}</td>
              <td>${{ ((item.tripId?.price || 0) * item.numberOfPeople).toLocaleString() }}</td>
              <td>
                <span class="badge" :class="item.bookingStatus">
                  {{ item.bookingStatus }}
                </span>
              </td>
            </tr>
            <tr v-if="bookings.length === 0">
              <td colspan="6" class="empty-cell">No revenue data found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../api';
import { PhCurrencyDollar, PhTrendUp } from '@phosphor-icons/vue';

const bookings = ref([]);
const loading = ref(true);

const totalRevenue = computed(() => {
  return bookings.value.reduce((sum, item) => {
    return sum + ((item.tripId?.price || 0) * item.numberOfPeople);
  }, 0);
});

onMounted(async () => {
  try {
    const res = await api.get('/api/admin/bookings');
    bookings.value = res.data;
  } catch (e) {
    console.error("Failed to fetch revenue data", e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.admin-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: #235789;
  font-size: 24px;
  font-weight: 700;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #235789;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #eef2f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  font-size: 24px;
  color: #235789;
}

.stat-info h3 {
  font-size: 24px;
  font-weight: 700;
  color: #235789;
  margin: 0;
}

.stat-info p {
  color: #666;
  margin: 4px 0 0 0;
  font-size: 14px;
}

.table-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.table-container h2 {
  font-size: 18px;
  color: #235789;
  margin-bottom: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 12px 16px;
  background: #f8f9fa;
  color: #666;
  font-weight: 600;
  font-size: 14px;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.badge.confirmed { background: #e3f2fd; color: #1976d2; }
.badge.pending { background: #fff8e1; color: #f57c00; }
.badge.cancelled { background: #ffebee; color: #d32f2f; }
.badge.completed { background: #e8f5e9; color: #2e7d32; }

.empty-cell {
  text-align: center;
  color: #999;
  padding: 40px;
}
</style>
