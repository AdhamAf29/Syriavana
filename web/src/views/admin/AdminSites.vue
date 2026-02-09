<template>
  <div class="admin-page">
    <header class="page-header">
      <h1>Sites Management</h1>
      <p>Manage tourist sites and locations</p>
    </header>

    <div v-if="loading" class="loading">Loading sites...</div>

    <div v-else-if="sites.length === 0" class="empty-state">
      <p>No sites found.</p>
    </div>

    <div v-else class="content-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Site Name</th>
            <th>Province</th>
            <th>Type</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="site in sites" :key="site._id">
            <td>
              <div class="site-info">
                <div class="site-img" :style="{ backgroundImage: `url(${site.images?.[0] || '/images/placeholder.jpg'})` }"></div>
                <span>{{ site.name }}</span>
              </div>
            </td>
            <td>{{ site.province }}</td>
            <td>
              <span class="badge type">{{ site.type }}</span>
            </td>
            <td>{{ site.ratingAverage?.toFixed(1) || 'N/A' }}</td>
            <td>
              <div class="actions">
                <router-link :to="`/site/${site._id}`" class="btn-view" target="_blank">View</router-link>
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

const sites = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get("/api/admin/sites");
    sites.value = res.data;
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

.data-table { width: 100%; border-collapse: collapse; min-width: 600px; }
.data-table th, .data-table td {
  padding: 15px 20px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.data-table th { background: #f8f9fa; color: #2c3e50; font-weight: 600; }
.data-table tr:hover { background: #f8f9fa; }

.site-info { display: flex; align-items: center; gap: 10px; }
.site-img {
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
  text-transform: capitalize;
}
.badge.type { background: #e3f2fd; color: #1976d2; }

.btn-view {
  color: #235789; text-decoration: none; font-weight: 600; font-size: 14px;
}
.btn-view:hover { text-decoration: underline; }

.loading, .empty-state { padding: 40px; text-align: center; color: #7f8c8d; }
</style>