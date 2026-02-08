<template>
  <div class="companies-page">
    <div class="header-section">
      <h1>Tourism Companies</h1>
      <p>Discover the best travel organizers in Syriavana</p>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else class="container">
      <div class="companies-grid">
        <div v-for="company in companies" :key="company._id" class="company-card">
          <div class="logo-wrapper">
            <div class="logo-placeholder">
              {{ company.name.charAt(0) }}
            </div>
          </div>
          <div class="card-content">
            <h3>{{ company.name }}</h3>
            <p class="desc">
              {{ truncate(company.companyProfile?.description || 'No description available.', 100) }}
            </p>
            <div class="actions">
              <router-link :to="`/companies/${company._id}`" class="btn-view">View Profile</router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-if="companies.length === 0" class="no-results">
        No companies found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api.js';

const companies = ref([]);
const loading = ref(true);

function truncate(text, length) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

onMounted(async () => {
  try {
    const res = await api.get('/api/companies');
    companies.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.companies-page {
  padding-bottom: 60px;
}

.header-section {
  background-color: #235789;
  color: white;
  padding: 60px 20px;
  text-align: center;
  margin-bottom: 40px;
}

.header-section h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  padding: 0 20px;
}

.company-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: transform 0.2s;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.company-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.logo-wrapper {
  height: 120px;
  background: #f4f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.logo-placeholder {
  width: 70px;
  height: 70px;
  background: #235789;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.card-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-content h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.desc {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
  flex-grow: 1;
}

.btn-view {
  display: block;
  text-align: center;
  background: transparent;
  color: #235789;
  border: 2px solid #235789;
  padding: 10px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-view:hover {
  background: #235789;
  color: white;
}

.loading, .no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
