<template>
  <div class="page bookings-page">
    <h2>حجوزاتي</h2>
    <div v-if="!auth.loggedIn" class="card" style="max-width:600px">
      <div class="body">
        <p>يرجى تسجيل الدخول لرؤية حجوزاتك.</p>
        <div class="actions">
          <button class="btn btn-primary" @click="goLogin">تسجيل الدخول</button>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="grid" v-if="bookings.length > 0">
        <div v-for="b in bookings" :key="b.id" class="card">
          <div class="header"><h3 class="card-title">رحلة {{ String(b.tripId || '').replace(/^t/, '') }}</h3></div>
          <div class="body">
            <p class="card-desc">عدد الأشخاص: {{ b.numberOfPeople }}</p>
            <p class="card-desc">الحالة: {{ stateAr(b.bookingStatus) }}</p>
            <div class="actions">
              <button class="btn btn-outline" @click="cancel(b.id)">إلغاء</button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid" v-else>
        <div v-for="n in 4" :key="n" class="card">
          <div class="header"><h3 class="card-title">لا يوجد حجز</h3></div>
          <div class="body">
            <p class="card-desc">ابدأ بإضافة حجز جديد لرحلاتك القادمة.</p>
            <div class="actions">
              <button class="btn btn-primary" @click="addBooking">إضافة حجز</button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="msg" style="color:green">{{ msg }}</p>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import api from "../api.js";
import { useAuthStore } from "../store/auth.js";
import { useRouter } from "vue-router";
const auth = useAuthStore();
const router = useRouter();
const bookings = ref([]);
const loaded = ref(false);
const msg = ref("");
async function load() {
  if (!auth.loggedIn) return;
  try { const r = await api.get("/api/bookings/my"); bookings.value = Array.isArray(r.data) ? r.data : []; }
  catch (e) { bookings.value = []; }
  finally { loaded.value = true; }
}
async function cancel(id) { const r = await api.post(`/api/bookings/${id}/cancel`); msg.value = r.data.message; await load(); }
function goLogin(){ router.push("/login"); }
function addBooking(){ if (!auth.loggedIn) { router.push("/login"); return; } router.push("/trips"); }
function stateAr(s){ const m={ confirmed:"مؤكد", cancelled:"ملغى", pending:"قيد الانتظار" }; return m[s]||s; }
load();
</script>
