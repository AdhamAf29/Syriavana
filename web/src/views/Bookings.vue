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
        <div v-for="b in bookings" :key="b._id || b.id" class="card">
          <div class="header"><h3 class="card-title">رحلة {{ b.tripId?.title || 'غير متوفرة' }}</h3></div>
          <div class="body">
            <div class="booking-info" style="display:grid; gap:8px; margin-bottom:16px">
              <div style="display:flex; justify-content:space-between">
                <span>📅 التاريخ:</span>
                <strong>{{ formatDate(b.createdAt || b.bookingDate) }}</strong>
              </div>
              <div style="display:flex; justify-content:space-between">
                <span>👥 العدد:</span>
                <strong>{{ b.numberOfPeople }} أشخاص</strong>
              </div>
              <div style="display:flex; justify-content:space-between">
                <span>🚌 الباص:</span>
                <strong>{{ busAr(b.busType) }}</strong>
              </div>
              <div style="display:flex; justify-content:space-between">
                <span>💳 الدفع:</span>
                <strong>{{ paymentAr(b.paymentMethod) }}</strong>
              </div>
              <div v-if="b.notes" style="background:#f5f5f5; padding:8px; border-radius:4px; margin-top:4px">
                <span style="display:block; font-size:0.85em; color:#666">ملاحظات:</span>
                {{ b.notes }}
              </div>
              <div style="display:flex; justify-content:space-between; margin-top:4px; border-top:1px solid #eee; padding-top:8px">
                <span>الحالة:</span>
                <strong :style="{color: statusColor(b.status || b.bookingStatus)}">{{ stateAr(b.status || b.bookingStatus) }}</strong>
              </div>
            </div>
            <div class="actions">
              <button class="btn btn-outline" @click="cancel(b._id || b.id)" v-if="(b.status || b.bookingStatus) !== 'cancelled'">إلغاء الحجز</button>
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
function paymentAr(p){ const m={ cash:"نقدي", card:"بطاقة" }; return m[p]||p; }
function busAr(b){ const m={ standard:"سياحي عادي", vip:"رجال أعمال (VIP)" }; return m[b]||b; }
function formatDate(d){ if(!d) return ""; return new Date(d).toLocaleDateString("ar-SY"); }
function statusColor(s){ return s==='confirmed'?'#2ecc71':(s==='cancelled'?'#e74c3c':'#f39c12'); }
load();
</script>
