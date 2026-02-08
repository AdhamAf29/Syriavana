<template>
  <AuthLayout>
    <template #title>هل أنت مستعد للمغامرة القادمة؟</template>
    <template #subtitle>فضلاً أدخل بريدك الإلكتروني وكلمة المرور</template>
    <form @submit.prevent="submit">
      <div v-if="error" class="error-msg">{{ error }}</div>
      
      <label>
        البريد الإلكتروني
        <input v-model="email" type="email" placeholder="example@gmail.com" :class="{ 'input-error': emailError }" />
        <span v-if="emailError" class="field-error-text">{{ emailError }}</span>
      </label>
      
      <label>
        كلمة المرور
        <input v-model="password" type="password" placeholder="••••••••" :class="{ 'input-error': passwordError }" />
        <span v-if="passwordError" class="field-error-text">{{ passwordError }}</span>
      </label>
      
      <button class="btn btn-primary" type="submit">تسجيل الدخول</button>
    </form>
    <template #meta>
      <div class="accent-meta">لا تملك حساباً؟ <router-link to="/register">إنشاء حساب</router-link></div>
    </template>
  </AuthLayout>
</template>
<script setup>
import { ref, onMounted } from "vue";
import api from "../api.js";
import { useAuthStore } from "../store/auth.js";
import { useRouter } from "vue-router";
import AuthLayout from "../components/AuthLayout.vue";
const email = ref("");
const password = ref("");
const error = ref("");
const emailError = ref("");
const passwordError = ref("");
const auth = useAuthStore();
const router = useRouter();

onMounted(() => {
  auth.logout(); // Ensure clean state
});

async function submit() {
  error.value = "";
  emailError.value = "";
  passwordError.value = "";
  
  try {
    const r = await api.post("/api/auth/login", { email: email.value, password: password.value });
    auth.setAuth(r.data.token, r.data.user);
    router.push("/");
  } catch (e) {
    const code = e.response?.data?.error;
    if (code === "user_not_found") {
      emailError.value = "البريد الإلكتروني غير مسجل لدينا";
    } else if (code === "wrong_password") {
      passwordError.value = "كلمة المرور غير صحيحة";
    } else {
      error.value = "بيانات الدخول غير صحيحة";
    }
    // Clear fields as requested
    email.value = "";
    password.value = "";
  }
}
</script>
<style scoped>
.accent-meta{color:var(--accent)}
.accent-meta a{color:var(--accent)}
.error-msg {
  color: #d9534f;
  background-color: #f2dede;
  border: 1px solid #ebccd1;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
}
.field-error-text {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 4px;
}
.input-error {
  border-color: #dc3545 !important;
  background-color: #fff8f8;
}
</style>
