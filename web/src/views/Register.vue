<template>
  <AuthLayout>
    <template #title>ابدأ رحلتك معنا</template>
    <template #subtitle>إنشئ حسابك للانضمام إلى الرحلات المنظمة</template>
    <form @submit.prevent="submit">
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div v-if="success" class="success-msg">{{ success }}</div>
      
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
  
  // Debug: Log input values
  console.log("Attempting registration with:", { name: name.value, email: email.value, password: password.value });

  try {
    const response = await api.post("/api/auth/register", { name: name.value, email: email.value, password: password.value });
    console.log("Registration successful:", response.data);
    success.value = "تم إنشاء الحساب بنجاح";
    // Optional: Redirect after delay or clear form
    name.value = ""; email.value = ""; password.value = "";
  } catch (e) {
    console.error("Registration error:", e);
    // Extract error message from API response if available
    const code = e.response?.data?.error || e.message;
    
    // Map error codes to friendly Arabic messages
    const messages = {
      "email_in_use": "البريد الإلكتروني مستخدم بالفعل. الرجاء تسجيل الدخول أو استخدام بريد آخر.",
      "invalid_input": "البيانات غير مكتملة. الرجاء التحقق من جميع الحقول.",
      "server_error": "حدث خطأ في الخادم. الرجاء المحاولة لاحقاً."
    };

    error.value = messages[code] || "فشل إنشاء الحساب: " + code;
  }
}
</script>

<style scoped>
.error-msg {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 10px;
}
.success-msg {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 10px;
}
</style>
