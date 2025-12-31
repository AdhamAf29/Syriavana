<template>
  <div>
    <Hero />
    <section class="page features">
      <h2 style="margin-bottom:12px">الخدمات والمزايا</h2>
      <div class="grid">
        <div class="feature-card" v-for="f in feats" :key="f.title">
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.desc }}</p>
        </div>
      </div>
      <div class="actions" style="margin-top:16px">
        <router-link class="btn btn-primary" to="/sites">تصفح المواقع</router-link>
        <router-link class="btn btn-outline" to="/trips">عرض الرحلات</router-link>
      </div>
    </section>
  </div>
</template>
<script setup>
import Hero from "../components/Hero.vue";
const feats = [
  { title: "حجوزات سهلة", desc: "نموذج حجز مبسط وإدارة كاملة لحجوزاتك" },
  { title: "أفضل الأسعار", desc: "عروض وخصومات محدثة على الرحلات" },
  { title: "مرشدون سياحيون", desc: "خبراء يقدمون معلومات مفصلة عن المواقع" },
  { title: "دعم متواصل", desc: "فريق دعم يعمل لمساعدتك في كل خطوة" }
];
</script>
