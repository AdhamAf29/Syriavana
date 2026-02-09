<template>
  <div class="page">
    <div class="card">
      <div class="trip-hero" v-if="trip?.images?.[0]">
        <img class="trip-hero-img" :src="trip.images[0]" alt="" />
      </div>
      <div class="body">
        <h2 style="margin:0 0 8px">{{ trip?.title }}</h2>
        
        <div v-if="trip?.companyId" class="company-info" style="margin: 0 0 15px; padding: 10px; background: #f8f9fa; border-radius: 8px; display: flex; align-items: center; gap: 10px; border: 1px solid #eee;">
          <div class="company-logo" style="width: 40px; height: 40px; background: #235789; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem;">
            {{ trip.companyId.name.charAt(0) }}
          </div>
          <div>
            <div style="font-size: 0.8rem; color: #666;">Organized by</div>
            <router-link :to="'/companies/' + trip.companyId._id" style="color: #235789; font-weight: bold; text-decoration: none; font-size: 1rem;">
              {{ trip.companyId.name }}
            </router-link>
          </div>
        </div>

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
        <label>ملاحظات<textarea v-model="notes" @input="autoResize" class="auto-grow"></textarea></label>
        <button class="btn btn-primary" type="submit">تأكيد الحجز</button>
      </form>
      <p v-if="msg" :style="{ color: isError ? 'red' : 'green' }">{{ msg }}</p>
      <h3>تقييم الرحلة</h3>
      <form @submit.prevent="review">
        <label>التقييم
            <div class="star-rating-input">
              <span 
                v-for="n in 5" 
                :key="n" 
                class="star-input" 
                :class="{ active: n <= (hoverRating || rating) }"
                @click="rating = n"
                @mouseover="hoverRating = n"
                @mouseleave="hoverRating = 0"
              >★</span>
            </div>
        </label>
        <label>تعليق<textarea v-model="comment" @input="autoResize" class="auto-grow"></textarea></label>
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
const isError = ref(false);
const rating = ref(5);
const hoverRating = ref(0);
const comment = ref("");
const rmsg = ref("");
const rerr = ref(false);

function autoResize(event) {
  event.target.style.height = 'auto';
  event.target.style.height = event.target.scrollHeight + 'px';
}

async function load() { const r = await api.get("/api/trips/" + route.params.id); trip.value = r.data; }
async function book() {
  msg.value = "";
  isError.value = false;
  console.log("Sending booking request...", {
    numberOfPeople: numberOfPeople.value,
    paymentMethod: paymentMethod.value,
    busType: busType.value,
    notes: notes.value
  });
  try {
    const r = await api.post(`/api/trips/${route.params.id}/book`, { numberOfPeople: numberOfPeople.value, paymentMethod: paymentMethod.value, busType: busType.value, notes: notes.value });
    msg.value = r.data.message;
    await load();
  } catch (e) {
    console.error("Booking failed:", e);
    isError.value = true;
    const serverMsg = e.response?.data?.message || e.message;
    msg.value = "Error: " + serverMsg;
  }
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

textarea.auto-grow {
  resize: none;
  overflow-y: hidden;
  min-height: 80px;
}

.star-rating-input {
  display: flex;
  gap: 5px;
  font-size: 2rem;
  cursor: pointer;
  margin-top: 5px;
  direction: ltr;
  justify-content: flex-end;
}

.star-input {
  color: #ccc;
  transition: color 0.2s;
}

.star-input.active {
  color: #f39c12;
}

.star-input:hover {
  transform: scale(1.1);
}
</style>
