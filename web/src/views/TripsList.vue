<template>
  <div class="trips-page">
    <!-- Controls -->
    <div class="controls">
      <button 
        v-for="limit in limits" 
        :key="limit" 
        @click="selectedLimit = limit"
        :class="['limit-btn', selectedLimit === limit ? 'active' : '']"
      >
        {{ limit }}
      </button>
    </div>

    <h2>الرحلات</h2>
    <div class="grid">
      <div v-for="t in filteredTrips" :key="t.id" :class="['card','trips-card', t.discount?.active ? 'offer-card' : '']">
        <div class="header">
          <h3 class="card-title">{{ t.title }}</h3>
          <div v-if="t.companyId" class="company-link" style="margin-top: 5px; font-size: 0.9em;">
            <span style="color: #666;">Organized by: </span>
            <router-link :to="'/companies/' + t.companyId._id" style="color: #235789; font-weight: 600; text-decoration: none;">
              {{ t.companyId.name }}
            </router-link>
          </div>
        </div>
        <div class="card-media">
          <img class="card-img" :src="t.images?.[0] || ''" alt="" />
        </div>
        <div class="body">
          <p>من {{ format(t.startDate) }} إلى {{ format(t.endDate) }}</p>
          <p>السعر: ${{ t.price }}</p>
          <p>الانطلاق: {{ t.departurePoint }}</p>
          <p v-if="t.discount?.active"><span class="badge">خصم {{ t.discount.amount }}%</span></p>
          <div class="actions">
            <router-link class="btn btn-outline" :to="'/trips/' + t.id">تفاصيل</router-link>
            <button class="btn btn-primary" @click="bookNow(t.id)">احجز الآن</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import api from "../api.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth.js";

const trips = ref([]);
const selectedLimit = ref('All');
const limits = [3, 6, 9, 'All'];

const router = useRouter();
const auth = useAuthStore();

const filteredTrips = computed(() => {
  if (selectedLimit.value === 'All') {
    return trips.value;
  }
  return trips.value.slice(0, selectedLimit.value);
});

function format(s) { return new Date(s).toLocaleDateString("ar-SY"); }
function num(t){ return String(t.id || '').replace(/^t/, '') }
async function load() { const r = await api.get("/api/trips"); trips.value = r.data; }
async function bookNow(id) { if (!auth.loggedIn) { router.push("/login"); return; } router.push("/trips/" + id); }
load();
</script>

<style scoped>
.trips-page {
  padding: 20px;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px; /* Separate from Navbar */
  margin-bottom: 30px;
}

.limit-btn {
  padding: 8px 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s ease;
  color: #555;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.limit-btn:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
}

.limit-btn.active {
  background-color: #FFC805; /* Yellow accent */
  color: #235789; /* Dark Blue text */
  border-color: #FFC805;
  box-shadow: 0 4px 8px rgba(255, 200, 5, 0.3);
}

/* Ensure global grid styles work well with the page container */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
</style>
