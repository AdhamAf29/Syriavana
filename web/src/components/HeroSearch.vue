<template>
  <div class="hero-search">
    <div class="search-item">
      <span>التواريخ</span>
      <input v-model="dates" placeholder="تسجيل الدخول - تسجيل الخروج" />
    </div>
    <div class="divider"></div>
    <div class="search-item">
      <span>الأشخاص</span>
      <select v-model="persons">
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>
    <div class="divider"></div>
    <div class="search-item">
      <span>الغرف</span>
      <select v-model="rooms">
        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>
    <button class="btn btn-primary circle" @click="go">بحث</button>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const dates = ref("");
const persons = ref(1);
const rooms = ref(1);
const router = useRouter();
function go(){ router.push({ path: "/trips", query: { persons: String(persons.value), rooms: String(rooms.value) } }); }
</script>
