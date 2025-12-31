<template>
  <div class="page">
    <div class="card">
      <div class="trip-hero" v-if="trip?.images?.[0]">
        <img class="trip-hero-img" :src="trip.images[0]" alt="" />
      </div>
      <div class="body">
        <h2 style="margin:0 0 8px">{{ trip?.title }}</h2>
        <p class="card-desc">{{ trip?.description }}</p>
        <div class="section" style="display:flex;flex-wrap:wrap;gap:12px;margin-top:8px">
          <div>المكان: <strong>{{ trip?.location }}</strong></div>
          <div>المدة: <strong>{{ trip?.duration }}</strong></div>
          <div>الجو العام: <strong>{{ trip?.atmosphere }}</strong></div>
          <div>المقاعد المتاحة: <strong>{{ trip?.seatsAvailable }}</strong></div>
        </div>
        <h3 style="margin-top:16px">برنامج الرحلة</h3>
        <div class="itinerary">
          <div v-for="(st,idx) in trip?.itinerary || []" :key="idx" class="it-step">
            <div class="it-icon">{{ st.icon }}</div>
            <div>
              <h4 class="it-title">{{ st.title }}</h4>
              <p class="it-desc">{{ st.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="auth.loggedIn" class="card" style="margin-top:12px">
      <h3>نموذج الحجز</h3>
      <form @submit.prevent="book">
        <label>عدد الركاب<input v-model.number="numberOfPeople" type="number" min="1" /></label>
        <label>طريقة الدفع<select v-model="paymentMethod"><option value="cash">نقدي</option><option value="card">بطاقة</option></select></label>
        <label>نوع الباص<select v-model="busType"><option value="standard">اعتيادي</option><option value="vip">فاخر</option></select></label>
        <label>ملاحظات<textarea v-model="notes"></textarea></label>
        <button class="btn btn-primary" type="submit">تأكيد الحجز</button>
      </form>
      <p v-if="msg" style="color:green">{{ msg }}</p>
      <h3>تقييم الرحلة</h3>
      <form @submit.prevent="review">
        <label>التقييم<input v-model.number="rating" type="number" min="1" max="5" /></label>
        <label>تعليق<textarea v-model="comment"></textarea></label>
        <button class="btn btn-accent" type="submit">إرسال</button>
      </form>
      <p v-if="rmsg" :style="rerr ? 'color:red' : 'color:green'">{{ rmsg }}</p>
    </div>
    <div v-else class="card" style="margin-top:12px">
      <div class="body">
        <p class="card-desc">المعلومات وبرنامج الرحلة متاحة للجميع. للحجز أو إضافة تقييم، يرجى تسجيل الدخول.</p>
        <div class="actions">
          <router-link class="btn btn-primary" to="/login">تسجيل الدخول</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import api from "../api.js";
import { useAuthStore } from "../store/auth.js";
const route = useRoute();
const auth = useAuthStore();
const trip = ref(null);
const numberOfPeople = ref(1);
const paymentMethod = ref("cash");
const busType = ref("standard");
const notes = ref("");
const msg = ref("");
const rating = ref(5);
const comment = ref("");
const rmsg = ref("");
const rerr = ref(false);
async function load() { const r = await api.get("/api/trips/" + route.params.id); trip.value = r.data; }
async function book() {
  msg.value = "";
  const r = await api.post(`/api/trips/${route.params.id}/book`, { numberOfPeople: numberOfPeople.value, paymentMethod: paymentMethod.value, busType: busType.value, notes: notes.value });
  msg.value = r.data.message;
  await load();
}
async function review() {
  rmsg.value = ""; rerr.value = false;
  try {
    await api.post("/api/reviews", { tripId: route.params.id, rating: rating.value, comment: comment.value });
    rmsg.value = "تم إرسال التقييم";
  } catch (e) {
    rerr.value = true;
    rmsg.value = e?.response?.data?.message || "يجب الحجز قبل التقييم";
  }
}
load();
</script>

<style scoped>
.trip-hero {
  width: 100%;
  margin: 0;
  padding: 0;
}

.trip-hero-img {
  width: 100%;
  height: 50vh;
  min-height: 450px;
  object-fit: cover;
  object-position: center;
  display: block;
}
</style>
