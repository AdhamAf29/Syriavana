<template>
  <div class="auth-page">
    <div class="auth-card rtl-form">
      <h2>إنشاء ملف شركة</h2>
      <p class="subtitle">قم بترقية حسابك لعرض الرحلات وإدارتها</p>
      
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label>اسم الشركة</label>
          <input v-model="form.name" type="text" placeholder="أدخل اسم الشركة" required />
        </div>

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
          <label>معلومات الاتصال</label>
          <input v-model="form.contactInfo" type="text" placeholder="رقم الهاتف، العنوان، الخ..." />
        </div>

        <div class="form-group">
          <label>شعار الشركة</label>
          <input type="file" accept="image/*" @change="handleFileChange" class="file-input" />
          <div v-if="uploading" class="uploading-text">جاري رفع الصورة...</div>
          <div v-if="form.logo" class="logo-preview-container">
            <img :src="apiBase + form.logo" class="preview-logo" alt="Logo Preview" />
          </div>
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button type="submit" class="btn-primary full-width" :disabled="loading || uploading">
          {{ loading ? 'جاري الإنشاء...' : 'إنشاء ملف الشركة' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api, { uploadImage } from "../api";
import { useAuthStore } from "../store/auth";

const router = useRouter();
const auth = useAuthStore();
const apiBase = import.meta.env.VITE_API_URL;

const form = ref({
  name: "",
  description: "",
  contactInfo: "",
  logo: ""
});

const loading = ref(false);
const uploading = ref(false);
const error = ref("");

function autoResize(event) {
  event.target.style.height = 'auto';
  event.target.style.height = event.target.scrollHeight + 'px';
}

async function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;
  try {
    const res = await uploadImage(file, "companies");
    form.value.logo = res.url;
  } catch (err) {
    console.error(err);
    error.value = "فشل رفع الصورة";
  } finally {
    uploading.value = false;
  }
}

onMounted(() => {
  if (!auth.loggedIn) {
    router.push("/login");
  } else if (auth.user?.role === 'company') {
    router.push("/company/dashboard");
  }
});

async function onSubmit() {
  loading.value = true;
  error.value = "";
  
  try {
    const payload = {
      name: form.value.name,
      description: form.value.description,
      contactInfo: form.value.contactInfo,
      logo: form.value.logo
    };

    const res = await api.post("/api/companies", payload);
    
    // Update local user role
    if (auth.user) {
      auth.user.role = "company";
      // Optionally refresh user profile from server if needed
    }
    
    router.push("/company/dashboard");
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.error || "حدث خطأ أثناء إنشاء الشركة";
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
  min-height: calc(100vh - 80px); /* Adjust for navbar */
  background-color: #f8f9fa;
  padding: 20px;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 500px;
}

.rtl-form {
  direction: rtl;
  text-align: right;
}

h2 {
  color: var(--primary);
  margin-bottom: 10px;
  text-align: center;
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

input:focus, textarea:focus {
  border-color: var(--primary);
  outline: none;
}

.auto-grow {
  min-height: 80px;
  resize: none;
  overflow-y: hidden;
}

.file-input {
  padding: 8px;
  background: #f1f1f1;
}

.uploading-text {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}

.logo-preview-container {
  margin-top: 10px;
  text-align: center;
}

.preview-logo {
  max-width: 100px;
  max-height: 100px;
  border-radius: 8px;
  border: 1px solid #ddd;
  object-fit: cover;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #1a4570; /* Darker shade of primary */
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.full-width {
  width: 100%;
}

.error-msg {
  color: #dc3545;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
}
</style>