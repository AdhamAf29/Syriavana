<template>
  <section class="hero">
    <div class="hero-bg">
      <img v-for="(src,i) in imgs" :key="src" :src="src" class="hero-bg-img" :class="{ active: i === idx }" />
    </div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">{{ title }}</h1>
      <p class="hero-subtitle">{{ subtitle }}</p>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const props = defineProps({ title: { type: String, default: "وجهتك المثالية للسفر" }, subtitle: { type: String, default: "اجعل رحلتك حلماً يتحقق بين أجمل المواقع في سوريا" } });
const imgs = [
  "/images/Ancient-City-of-Aleppo-1024x683.png",
  "/images/Norias_of_Hama,_Orontes_River,_Hama,_Syria.png",
  "/images/palmira.png",
  "/images/Syria--1024x683.png",
  "/images/Syria-Tour.png",
  "/images/syrian-nature-mountains-villages-damascus-region-1-1.png"
];
const idx = ref(0);
let t = null;
onMounted(() => { t = setInterval(() => { idx.value = (idx.value + 1) % imgs.length; }, 3000); });
onUnmounted(() => { if (t) clearInterval(t); });
</script>
