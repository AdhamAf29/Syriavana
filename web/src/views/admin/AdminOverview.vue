<template>
  <div class="admin-page">
    <header class="page-header">
      <h1>Dashboard Overview</h1>
    </header>

    <!-- Top Stats Cards -->
    <section class="stats-grid">
      <div class="stat-card" v-for="(stat, index) in topStats" :key="index">
        <div class="stat-icon-wrapper">
          <component :is="stat.icon" class="stat-icon" />
        </div>
        <div class="stat-info">
          <h3>{{ stat.value }}</h3>
          <p>{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Middle Charts Section -->
    <section class="charts-section">
      <div class="chart-container pie-chart">
        <h3>Booking Status Distribution</h3>
        <div class="chart-wrapper">
          <Doughnut :data="pieChartData" :options="pieChartOptions" />
        </div>
      </div>
      <div class="chart-container bar-chart">
        <h3>Monthly Bookings</h3>
        <div class="chart-wrapper">
          <Bar :data="barChartData" :options="barChartOptions" />
        </div>
      </div>
    </section>

    <!-- Bottom Stats Cards -->
    <section class="bottom-stats-grid">
      <div class="bottom-stat-card" v-for="(stat, index) in bottomStats" :key="index">
        <h4>{{ stat.label }}</h4>
        <p class="value">{{ stat.value }}</p>
        <div class="trend" :class="stat.trend > 0 ? 'positive' : 'negative'">
          <span v-if="stat.trend > 0">↑ {{ stat.trend }}%</span>
          <span v-else>↓ {{ Math.abs(stat.trend) }}%</span>
          <span class="vs">vs last month</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api';
import { 
  PhUsers, 
  PhAirplaneTilt, 
  PhTicket, 
  PhCurrencyDollar, 
  PhGlobeHemisphereWest 
} from '@phosphor-icons/vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js';
import { Doughnut, Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

console.log("AdminOverview mounted");

// Reactive Stats Data
const topStats = ref([
  { label: 'Total Trips', value: '0', icon: PhAirplaneTilt },
  { label: 'Total Users', value: '0', icon: PhUsers },
  { label: 'Total Bookings', value: '0', icon: PhTicket },
  { label: 'Total Revenue', value: '$0', icon: PhCurrencyDollar },
  { label: 'Active Sites', value: '0', icon: PhGlobeHemisphereWest }
]);

// Bottom Stats Data
const bottomStats = ref([
  { label: 'Revenue per User', value: '$0', trend: 0 },
  { label: 'Avg. Rating per Trip', value: '0', trend: 0 },
  { label: 'Bookings per Month', value: '0', trend: 0 },
  { label: 'Avg. Trip Price', value: '$0', trend: 0 }
]);

// Charts Data
const pieChartData = ref({
  labels: ['Confirmed', 'Pending', 'Cancelled'],
  datasets: [{
    backgroundColor: ['#235789', '#FFC805', '#C6DCF0'],
    data: [0, 0, 0]
  }]
});

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' }
  }
};

const barChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    label: 'Bookings',
    backgroundColor: '#235789',
    data: Array(12).fill(0)
  }]
});

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true }
  }
};

onMounted(async () => {
  try {
    const { data } = await api.get('/api/admin/stats');
    
    // Update Top Stats
    topStats.value = [
      { label: 'Total Trips', value: data.trips.toString(), icon: PhAirplaneTilt },
      { label: 'Total Users', value: data.users.toLocaleString(), icon: PhUsers },
      { label: 'Total Bookings', value: data.bookings.toString(), icon: PhTicket },
      { label: 'Total Revenue', value: `$${data.revenue.toLocaleString()}`, icon: PhCurrencyDollar },
      { label: 'Active Sites', value: data.sites.toString(), icon: PhGlobeHemisphereWest }
    ];

    // Update Pie Chart (Booking Status)
    const statusMap = { confirmed: 0, pending: 0, cancelled: 0 };
    data.bookingStatus.forEach(item => {
      if (statusMap[item._id] !== undefined) {
        statusMap[item._id] = item.count;
      }
    });
    pieChartData.value = {
      labels: ['Confirmed', 'Pending', 'Cancelled'],
      datasets: [{
        backgroundColor: ['#235789', '#FFC805', '#C6DCF0'],
        data: [statusMap.confirmed, statusMap.pending, statusMap.cancelled]
      }]
    };

    // Update Bar Chart (Monthly Bookings)
    const monthlyData = Array(12).fill(0);
    data.monthlyBookings.forEach(item => {
      // item._id is month number (1-12)
      if (item._id >= 1 && item._id <= 12) {
        monthlyData[item._id - 1] = item.count;
      }
    });
    barChartData.value = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Bookings',
        backgroundColor: '#235789',
        data: monthlyData
      }]
    };

    // Update Bottom Stats (Calculated)
    const revenuePerUser = data.users > 0 ? (data.revenue / data.users).toFixed(1) : '0';
    // const avgTripPrice = data.trips > 0 ? (data.revenue / data.bookings).toFixed(0) : '0'; // Roughly revenue / bookings as proxy
    
    bottomStats.value = [
      { label: 'Revenue per User', value: `$${revenuePerUser}`, trend: 0 },
      { label: 'Avg. Rating per Trip', value: '4.8', trend: 0 }, // Mock for now or fetch from trips agg
      { label: 'Bookings per Month', value: (data.bookings / 12).toFixed(1), trend: 0 },
      { label: 'Avg. Trip Price', value: '$150', trend: 0 } // Mock or fetch
    ];

  } catch (e) {
    console.error("Failed to load dashboard stats", e);
  }
});
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}
.page-header h1 {
  color: #235789;
  font-size: 24px;
  font-weight: 700;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  background-color: #C6DCF0;
  border-radius: 10px;
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
  color: #235789;
  margin: 0;
}

.stat-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-container {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.chart-container h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #235789;
  font-size: 18px;
}

.chart-wrapper {
  height: 300px;
  position: relative;
}

/* Bottom Stats */
.bottom-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.bottom-stat-card {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.bottom-stat-card h4 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.bottom-stat-card .value {
  font-size: 28px;
  font-weight: bold;
  color: #235789;
  margin: 0 0 10px 0;
}

.trend {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.trend.positive { color: #2ecc71; }
.trend.negative { color: #e74c3c; }
.trend .vs { color: #999; margin-left: 4px; }

@media (max-width: 1024px) {
  .charts-section { grid-template-columns: 1fr; }
  .bottom-stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>