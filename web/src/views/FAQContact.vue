<template>
  <div class="page offset-top">
    <div class="container">
      <h1 class="page-title">الأسئلة الشائعة وتواصل معنا</h1>
      <p class="page-subtitle">شاركنا رأيك أو استفسارك وسيظهر هنا لتعم الفائدة</p>

      <div class="grid-layout">
        <!-- Contact Form -->
        <div class="card form-card">
          <div class="header">
            <h2 class="card-title">أرسل استفسارك</h2>
          </div>
          <div class="body">
            <form @submit.prevent="submitMessage">
              <label>الاسم
                <input v-model="form.name" type="text" placeholder="اسمك الكريم" required />
              </label>
              <label>البريد الإلكتروني
                <input v-model="form.email" type="email" placeholder="example@email.com" required />
              </label>
              <label>الرسالة
                <textarea 
                  v-model="form.message" 
                  rows="1" 
                  placeholder="اكتب رسالتك هنا..." 
                  required
                  @input="autoResize"
                  ref="messageInput"
                  class="auto-grow-textarea"
                ></textarea>
              </label>
              <button class="btn btn-primary" type="submit" :disabled="loading">
                {{ loading ? 'جاري الإرسال...' : 'إرسال' }}
              </button>
              <p v-if="msg" :class="{'success-msg': !error, 'error-msg': error}">{{ msg }}</p>
            </form>
          </div>
        </div>

        <!-- FAQ List -->
        <div class="faq-list">
          <div class="card">
            <div class="header">
              <h2 class="card-title">مشاركات المجتمع</h2>
            </div>
            <div class="body">
              <div v-if="messages.length === 0" class="empty-state">
                لا توجد مشاركات حتى الآن. كن أول من يشارك!
              </div>
              <div v-else class="messages-container">
                <div v-for="msg in messages" :key="msg._id" class="message-item">
                  <div class="msg-header">
                    <span class="msg-author">{{ msg.name }}</span>
                    <span class="msg-date">{{ formatDate(msg.createdAt) }}</span>
                  </div>
                  <p class="msg-content">{{ msg.message }}</p>
                  <div v-if="msg.reply" class="msg-reply">
                    <strong>رد الإدارة:</strong> {{ msg.reply }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api.js';

const messages = ref([]);
const loading = ref(false);
const msg = ref("");
const error = ref(false);
const form = ref({
  name: "",
  email: "",
  message: ""
});

async function fetchMessages() {
  try {
    const res = await api.get('/api/messages');
    messages.value = res.data;
  } catch (e) {
    console.error("Failed to load messages", e);
  }
}

async function submitMessage() {
  loading.value = true;
  msg.value = "";
  error.value = false;
  
  try {
    await api.post('/api/messages', form.value);
    msg.value = "تم إرسال رسالتك بنجاح!";
    form.value = { name: "", email: "", message: "" };
    
    // Reset textarea height
    if (messageInput.value) {
      messageInput.value.style.height = 'auto';
    }

    await fetchMessages(); // Refresh list
  } catch (e) {
    error.value = true;
    msg.value = "حدث خطأ أثناء الإرسال. حاول مرة أخرى.";
  } finally {
    loading.value = false;
  }
}

function autoResize(event) {
  const element = event.target;
  element.style.height = 'auto';
  element.style.height = element.scrollHeight + 'px';
}

const messageInput = ref(null);

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ar-SY', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

onMounted(() => {
  fetchMessages();
});
</script>

<style scoped>
.page-title {
  text-align: center;
  margin-bottom: 8px;
}
.page-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 32px;
}

.grid-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.form-card {
  width: 100%;
  max-width: 600px;
}

.faq-list {
  width: 100%;
  max-width: 800px;
}

.auto-grow-textarea {
  resize: none;
  overflow-y: hidden;
  min-height: 100px;
}

@media (max-width: 768px) {
  .form-card, .faq-list {
    max-width: 100%;
  }
}

.success-msg { color: green; margin-top: 10px; font-weight: bold; }
.error-msg { color: red; margin-top: 10px; font-weight: bold; }

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  background: var(--bg-soft);
  padding: 16px;
  border-radius: 12px;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9em;
  color: #555;
}

.msg-author {
  font-weight: bold;
  color: var(--primary);
}

.msg-content {
  margin: 0;
  line-height: 1.6;
}

.msg-reply {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0,0,0,0.1);
  font-size: 0.95em;
  color: #444;
}
</style>
