<template>
  <div class="page">
    <h2 style="margin-bottom:12px">آراء العملاء</h2>
    <div class="grid">
      <div v-for="(r,i) in reviews" :key="i" class="card reviews-card">
        <div class="header"><h3 class="card-title">{{ r.name }}</h3></div>
        <div class="avatar-container">
          <div class="avatar-circle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="avatar-icon">
              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="body">
          <div class="stars" :aria-label="'تقييم ' + r.rating + ' من 5'">
            <span v-for="n in 5" :key="n" :class="n<=r.rating?'star on':'star'">★</span>
          </div>
          <p class="card-desc">{{ r.text }}</p>
        </div>
      </div>
    </div>
    <div class="actions" style="margin-top:16px">
      <button class="btn btn-primary" @click="addReview">إضافة تقييم</button>
    </div>

    <div v-if="showForm" class="modal">
      <div class="modal-card">
        <h3 style="margin-top:0">إضافة تقييم</h3>
        <form @submit.prevent="submit">
          <label>الاسم<input v-model="form.name" /></label>
          <label>التقييم
            <select v-model.number="form.rating">
              <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
            </select>
          </label>
          <label>نص التقييم<textarea v-model="form.text" rows="4"></textarea></label>
          <div class="actions">
            <button class="btn btn-primary" type="submit">حفظ</button>
            <button class="btn btn-outline" type="button" @click="close">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useAuthStore } from "../store/auth.js";
import { useRouter } from "vue-router";
const auth = useAuthStore();
const router = useRouter();
const reviews = ref([
  { name: "أحمد", text: "منصة رائعة تسهّل التخطيط للرحلات واستكشاف المواقع الأثرية.", rating: 5 },
  { name: "سارة", text: "التصميم جميل والمعلومات واضحة ومفيدة.", rating: 4 },
  { name: "ليلى", text: "أعجبني ترتيب الصفحات وإتاحة الحجز بسهولة.", rating: 5 },
  { name: "يوسف", text: "التقييمات مفيدة، وأود رؤية المزيد من الصور لكل موقع.", rating: 4 },
  { name: "هبة", text: "دعم اللغة العربية ممتاز والواجهة مريحة.", rating: 5 },
  { name: "كريم", text: "ساعدتني المنصة في اختيار المواقع الأنسب لجدولي.", rating: 4 }
]);
const showForm = ref(false);
const form = ref({ name: "", rating: 5, text: "" });
function addReview(){ if (!auth.loggedIn) { router.push("/login"); return; } showForm.value = true; }
function close(){ showForm.value = false; }
function submit(){ reviews.value.unshift({ name: form.value.name || "زائر", text: form.value.text || "", rating: form.value.rating || 5 }); close(); }
</script>
<style>
.modal{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:50}
.modal-card{background:#fff;border:1px solid var(--bg-soft);border-radius:16px;box-shadow:var(--shadow);padding:18px;min-width:320px;max-width:520px;width:92%}
.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
}
.avatar-circle {
  width: 80px;
  height: 80px;
  background-color: var(--accent); /* Yellow accent */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.avatar-icon {
    width: 40px;
    height: 40px;
    color: #235789; /* Dark Blue primary */
  }
  .reviews-card .stars {
    color: var(--primary);
  }
</style>
