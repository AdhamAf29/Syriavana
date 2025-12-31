<template>
  <AuthLayout>
    <template #title>ابدأ رحلتك معنا</template>
    <template #subtitle>إنشئ حسابك للانضمام إلى الرحلات المنظمة</template>
    <form @submit.prevent="submit">
      <label>الاسم<input v-model="name" placeholder="الاسم الكامل" /></label>
      <label>البريد الإلكتروني<input v-model="email" type="email" placeholder="example@gmail.com" /></label>
      <label>كلمة المرور<input v-model="password" type="password" placeholder="••••••••" /></label>
      <button class="btn btn-primary" type="submit">إنشاء حساب</button>
    </form>
    <template #meta>
      <div>لديك حساب؟ <router-link to="/login">تسجيل الدخول</router-link></div>
    </template>
  </AuthLayout>
</template>
<script setup>
import { ref } from "vue";
import api from "../api.js";
import AuthLayout from "../components/AuthLayout.vue";
const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const success = ref("");
async function submit() {
  error.value = ""; success.value = "";
  try {
    await api.post("/api/auth/register", { name: name.value, email: email.value, password: password.value });
    success.value = "تم إنشاء الحساب بنجاح";
  } catch (e) {
    error.value = "فشل إنشاء الحساب";
  }
}
</script>
