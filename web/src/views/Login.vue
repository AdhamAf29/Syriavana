<template>
  <AuthLayout>
    <template #title>هل أنت مستعد للمغامرة القادمة؟</template>
    <template #subtitle>فضلاً أدخل بريدك الإلكتروني وكلمة المرور</template>
    <form @submit.prevent="submit">
      <label>البريد الإلكتروني<input v-model="email" type="email" placeholder="example@gmail.com" /></label>
      <label>كلمة المرور<input v-model="password" type="password" placeholder="••••••••" /></label>
      <button class="btn btn-primary" type="submit">تسجيل الدخول</button>
    </form>
    <template #meta>
      <div class="accent-meta">لا تملك حساباً؟ <router-link to="/register">إنشاء حساب</router-link></div>
    </template>
  </AuthLayout>
</template>
<script setup>
import { ref } from "vue";
import api from "../api.js";
import { useAuthStore } from "../store/auth.js";
import { useRouter } from "vue-router";
import AuthLayout from "../components/AuthLayout.vue";
const email = ref("");
const password = ref("");
const error = ref("");
const auth = useAuthStore();
const router = useRouter();
async function submit() {
  error.value = "";
  try {
    const r = await api.post("/api/auth/login", { email: email.value, password: password.value });
    auth.setAuth(r.data.token, r.data.user);
    router.push("/");
  } catch (e) {
    error.value = "بيانات الدخول غير صحيحة";
  }
}
</script>
<style scoped>
.accent-meta{color:var(--accent)}
.accent-meta a{color:var(--accent)}
</style>
