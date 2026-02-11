<template>
  <div>
    <h2>المواقع</h2>
    <div class="actions filters">
      <label>المحافظة<select v-model="province"><option value="">{{ provincePlaceholder }}</option><option v-for="p in provinces" :key="p.value" :value="p.value">{{ p.label }}</option></select></label>
      <label>النوع<select v-model="type"><option value="">{{ typePlaceholder }}</option><option v-for="t in types" :key="t.value" :value="t.value">{{ t.label }}</option></select></label>
      <button class="btn btn-accent" @click="load">تصفية</button>
    </div>
    <div class="grid">
      <div v-for="s in sites" :key="s._id || s.id" class="card sites-card">
        <div class="header">
          <h3 class="card-title">{{ s.nameAr || s.name }}</h3>
        </div>
        <div class="card-media">
          <img class="card-img" :src="imageSrc(s)" @error="onImgError($event)" alt="" />
        </div>
        <div class="body">
          <p class="card-desc">{{ s.descriptionAr || s.description }}</p>
          <div class="actions">
            <router-link class="btn btn-outline" :to="'/sites/' + (s._id || s.id)">تفاصيل</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import api from "../api.js";
const sites = ref([]);
const province = ref("");
const type = ref("");
const provincePlaceholder = "اختر المحافظة";
const typePlaceholder = "اختر النوع";
const provinces = [
  { label: "دمشق", value: "Damascus" },
  { label: "حلب", value: "Aleppo" },
  { label: "حمص", value: "Homs" },
  { label: "اللاذقية", value: "Latakia" },
  { label: "طرطوس", value: "Tartus" },
  { label: "درعا", value: "Daraa" },
  { label: "ريف دمشق", value: "Rif Dimashq" },
  { label: "السويداء", value: "As-Suwayda" }
];
const types = [
  { label: "أثري", value: "archaeological" },
  { label: "ديني", value: "religious" },
  { label: "طبيعي", value: "natural" },
  { label: "ترفيهي", value: "recreational" }
];
async function load() {
  const r = await api.get("/api/sites", { params: { province: province.value || undefined, type: type.value || undefined } });
  sites.value = r.data;
}
function imageSrc(s) {
  const p = Array.isArray(s.images) && s.images.length ? s.images[0] : "";
  if (!p) return "/images/fallback-site.svg";
  if (/^https?:\/\//.test(p)) return p;
  const path = p.startsWith("/") ? p : "/" + p;
  const bust = path.includes("?") ? "" : "?v=2";
  return path + bust;
}
function onImgError(e) { e.target.src = "/images/fallback-site.svg"; }
load();
</script>
<style scoped>
.filters{gap:16px;margin-bottom:28px;align-items:flex-end}
.filters label{display:flex;flex-direction:column;gap:10px;margin:0}
.filters select{padding:12px 24px;color:var(--text);font-weight:600}
.filters .btn{padding:10px 18px;border-radius:10px}
</style>
