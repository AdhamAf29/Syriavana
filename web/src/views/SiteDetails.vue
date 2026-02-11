<template>
  <div class="page">
    <div class="card">
      <div class="site-hero" v-if="images.length">
        <img :src="images[current]" @error="imgError($event)" class="site-hero-img" />
      </div>
      <div class="body">
        <h2 style="margin:0 0 8px">{{ siteTitle }}</h2>
        <p style="margin:0 0 12px;color:#5b6a7c">{{ siteDetails }}</p>
        <div class="section" style="display:flex;flex-wrap:wrap;gap:12px">
          <div>النوع: <strong>{{ typeAr }}</strong></div>
          <div>المحافظة: <strong>{{ provinceAr }}</strong></div>
          <div>التقييم: <strong>{{ site?.ratingAverage }}</strong></div>
          <div v-if="site?.builtAr">سنة/العصر: <strong>{{ site.builtAr }}</strong></div>
          <div v-if="site?.location">الإحداثيات: <a :href="mapUrl" target="_blank">{{ site.location.lat.toFixed(3) }}, {{ site.location.lng.toFixed(3) }}</a></div>
        </div>
        <div class="actions" style="margin-top:14px">
          <button class="btn btn-outline" @click="prevSite">الموقع السابق</button>
          <button class="btn btn-outline" @click="nextSite">الموقع التالي</button>
        </div>
        <div class="actions" v-if="auth.loggedIn" style="margin-top:12px">
          <button class="btn btn-outline" @click="toggleFavorite">إضافة إلى المفضلة</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api.js";
import { useAuthStore } from "../store/auth.js";
const route = useRoute();
const router = useRouter();
const site = ref(null);
const auth = useAuthStore();
const images = ref([]);
const current = ref(0);
const allSites = ref([]);
const currentIndex = ref(0);
async function load() {
  const r = await api.get("/api/sites/" + route.params.id);
  site.value = r.data;
  images.value = Array.isArray(r.data.images) && r.data.images.length ? r.data.images.map(p => (p.startsWith("/") ? p : "/" + p)) : ["/images/fallback-site.svg"];
  await loadAll();
  computeIndex();
}
async function toggleFavorite() {
  if (!auth.user) return;
  await api.post(`/api/users/${auth.user.id}/favorites`, { siteId: route.params.id });
}
function imgError(e){ e.target.src = "/images/fallback-site.svg"; }
function prev(){ current.value = (current.value - 1 + images.value.length) % images.value.length; }
function next(){ current.value = (current.value + 1) % images.value.length; }

const siteTitle = computed(() => site.value?.nameAr || site.value?.name || "");
const siteDetails = computed(() => site.value?.detailsAr || site.value?.descriptionAr || site.value?.description || "");
const typeAr = computed(() => site.value?.typeAr || translateType(site.value?.type));
const provinceAr = computed(() => site.value?.provinceAr || translateProv(site.value?.province));
const mapUrl = computed(() => site.value?.location ? `https://www.google.com/maps?q=${site.value.location.lat},${site.value.location.lng}` : "#");

function translateType(t){
  const m = { archaeological: "أثري", religious: "ديني", natural: "طبيعي", recreational: "ترفيهي" };
  return m[t] || t || "";
}
function translateProv(p){
  const m = { Damascus: "دمشق", Aleppo: "حلب", Homs: "حمص", Latakia: "اللاذقية", Tartus: "طرطوس", Daraa: "درعا", "Rif Dimashq": "ريف دمشق", "As-Suwayda": "السويداء" };
  return m[p] || p || "";
}
load();

async function loadAll(){ const res = await api.get("/api/sites"); allSites.value = res.data; }
function computeIndex(){ const idx = allSites.value.findIndex(s => String(s._id || s.id) === String(route.params.id)); currentIndex.value = idx >= 0 ? idx : 0; }
function prevSite(){ const idx = (currentIndex.value - 1 + allSites.value.length) % allSites.value.length; const id = allSites.value[idx]._id || allSites.value[idx].id; router.push("/sites/" + id); }
function nextSite(){ const idx = (currentIndex.value + 1) % allSites.value.length; const id = allSites.value[idx]._id || allSites.value[idx].id; router.push("/sites/" + id); }
watch(() => route.params.id, async () => { await load(); });
</script>

<style scoped>
.site-hero {
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
}

.site-hero-img {
  width: 100%;
  height: 50vh;
  min-height: 450px;
  object-fit: cover;
  object-position: center;
  display: block;
}
</style>
