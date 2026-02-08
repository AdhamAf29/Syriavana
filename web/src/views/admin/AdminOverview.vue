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

// Top Stats Data
const topStats = [
  { label: 'Total Trips', value: '15', icon: PhAirplaneTilt },
  { label: 'Total Users', value: '1,200', icon: PhUsers },
  { label: 'Total Bookings', value: '450', icon: PhTicket },
  { label: 'Total Revenue', value: '$12,500', icon: PhCurrencyDollar },
  { label: 'Active Sites', value: '12', icon: PhGlobeHemisphereWest }
];

// Bottom Stats Data
const bottomStats = [
  { label: 'Revenue per User', value: '$10.4', trend: 2.5 },
  { label: 'Avg. Rating per Trip', value: '4.8', trend: 0.5 },
  { label: 'Bookings per Month', value: '38', trend: -5.2 },
  { label: 'Avg. Trip Price', value: '$120', trend: 1.2 }
];

// Charts Data
const pieChartData = {
  labels: ['Confirmed', 'Pending', 'Cancelled'],
  datasets: [{
    backgroundColor: ['#235789', '#FFC805', '#C6DCF0'],
    data: [65, 20, 15]
  }]
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' }
  }
};

const barChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    label: 'Bookings',
    backgroundColor: '#235789',
    data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
  }]
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true }
  }
};
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