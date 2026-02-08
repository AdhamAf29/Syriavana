<template>
  <div class="auth-page">
    <div class="auth-card rtl-form">
      <h2>تسجيل شركة سياحية جديدة</h2>
      <p class="subtitle">انضم إلى Syrianava لعرض رحلاتك</p>
      
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label>اسم الشركة</label>
          <input v-model="form.name" type="text" placeholder="أدخل اسم الشركة" required />
        </div>

        <div class="form-group">
          <label>البريد الإلكتروني</label>
          <input v-model="form.email" type="email" placeholder="company@example.com" required />
        </div>

        <div class="form-group">
          <label>كلمة المرور</label>
          <input v-model="form.password" type="password" placeholder="أنشئ كلمة مرور قوية" required />
        </div>

        <div class="form-group">
          <label>رقم الهاتف</label>
          <input v-model="form.phone" type="tel" placeholder="+963 ..." />
        </div>

        <div class="form-group">
          <label>العنوان</label>
          <input v-model="form.address" type="text" placeholder="دمشق، سوريا" />
        </div>

        <!-- Company Specifics -->
        <div class="form-group">
          <label>نبذة عن الشركة</label>
          <textarea 
            v-model="form.description" 
            placeholder="أخبرنا عن شركتك وخدماتك..." 
            rows="3"
            @input="autoResize"
            class="auto-grow"
          ></textarea>
        </div>

        <div class="form-group">
          <label>شعار الشركة (رابط الصورة)</label>
          <input v-model="form.contactInfo" type="text" placeholder="رابط الشعار (اختياري)" />
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button type="submit" class="btn-primary full-width" :disabled="loading">
          {{ loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب' }}
        </button>
      </form>
      
      <p class="switch-auth">
        لديك حساب بالفعل؟ <router-link to="/login">تسجيل الدخول</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../store/auth";

const router = useRouter();
const auth = useAuthStore();

const form = ref({
  name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  description: "",
  contactInfo: ""
});

const loading = ref(false);
const error = ref("");

const API_URL = "http://localhost:3001/api";

function autoResize(event) {
  event.target.style.height = 'auto';
  event.target.style.height = event.target.scrollHeight + 'px';
}

async function onSubmit() {
  loading.value = true;
  error.value = "";
  
  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      phone: form.value.phone,
      address: form.value.address,
      role: "company",
      companyProfile: {
        description: form.value.description,
        contactInfo: form.value.contactInfo,
        logo: "" // Logo upload can be added later
      }
    };

    const res = await axios.post(`${API_URL}/auth/register`, payload);
    
    // Auto login after register
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: form.value.email,
      password: form.value.password
    });

    auth.setAuth(loginRes.data.token, loginRes.data.user);
    router.push("/company/dashboard");

  } catch (e) {
    if (e.response && e.response.data.error === "email_in_use") {
      error.value = "This email is already registered.";
    } else {
      error.value = "Registration failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 40px 20px;
  background-color: #f9f9f9;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 500px;
}

.rtl-form {
  direction: rtl;
  text-align: right;
}

h2 {
  color: var(--primary);
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

input, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

textarea.auto-grow {
  resize: none;
  overflow-y: hidden;
  min-height: 80px;
}

input:focus, textarea:focus {
  border-color: var(--primary);
  outline: none;
}

.btn-primary {
  background-color: var(--primary);
  color: #1a1a1a;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.3s;
  margin-top: 10px;
}

.btn-primary:hover {
  opacity: 0.9;
}

.full-width {
  width: 100%;
}

.error-msg {
  color: #e74c3c;
  background-color: #fdecea;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
}

.switch-auth {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.switch-auth a {
  color: var(--primary);
  font-weight: 700;
  text-decoration: none;
}
</style>
