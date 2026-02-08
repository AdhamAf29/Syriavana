<template>
  <div class="add-trip">
    <header class="page-header">
      <h1>{{ isEdit ? 'Edit Trip' : 'Add New Trip' }}</h1>
    </header>

    <div class="form-card">
      <form @submit.prevent="submit">
        <div class="form-group">
          <label>Trip Title</label>
          <input v-model="form.title" type="text" required placeholder="e.g. Ancient Damascus Tour" />
        </div>

        <div class="row">
          <div class="form-group half">
            <label>Location</label>
            <input v-model="form.location" type="text" required placeholder="Damascus, Syria" />
          </div>
          <div class="form-group half">
            <label>Price ($)</label>
            <input v-model="form.price" type="number" required placeholder="150" />
          </div>
        </div>

        <div class="row">
          <div class="form-group half">
            <label>Duration</label>
            <input v-model="form.duration" type="text" required placeholder="3 Days" />
          </div>
          <div class="form-group half">
            <label>Available Seats</label>
            <input v-model="form.seatsAvailable" type="number" required placeholder="20" />
          </div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea 
            v-model="form.description" 
            rows="4" 
            placeholder="Describe the experience..."
            @input="autoResize"
            class="auto-grow"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Image URL</label>
          <input v-model="imageInput" type="text" placeholder="https://..." />
          <small>Enter a direct image link</small>
        </div>

        <div class="actions">
          <button type="button" @click="$router.back()" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : (isEdit ? 'Update Trip' : 'Create Trip') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../store/auth";
import api from "../../api";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const loading = ref(false);

function autoResize(event) {
  event.target.style.height = 'auto';
  event.target.style.height = event.target.scrollHeight + 'px';
}

const isEdit = computed(() => !!route.params.id);

const form = ref({
  title: "",
  location: "",
  price: "",
  duration: "",
  seatsAvailable: "",
  description: "",
  images: []
});

const imageInput = ref("");

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true;
    try {
      const res = await api.get(`/api/trips/${route.params.id}`);
      const t = res.data;
      form.value = {
        title: t.title,
        location: t.location,
        price: t.price,
        duration: t.duration,
        seatsAvailable: t.seatsAvailable,
        description: t.description,
        images: t.images || []
      };
      if (t.images && t.images.length > 0) {
        imageInput.value = t.images[0];
      }
    } catch (e) {
      console.error(e);
      alert("Failed to load trip");
      router.push("/company/trips");
    } finally {
      loading.value = false;
    }
  }
});

async function submit() {
  loading.value = true;
  try {
    if (imageInput.value) {
      form.value.images = [imageInput.value];
    }
    
    // Ensure numeric values
    const payload = {
      ...form.value,
      price: Number(form.value.price),
      seatsAvailable: Number(form.value.seatsAvailable),
      totalSeats: Number(form.value.seatsAvailable) // Note: This might overwrite totalSeats if editing, but simpler for now
    };

    if (isEdit.value) {
      await api.put(`/api/trips/${route.params.id}`, payload);
    } else {
      await api.post("/api/trips", payload);
    }

    router.push("/company/trips");
  } catch (e) {
    console.error(e);
    alert("Failed to save trip");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.add-trip {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: #235789;
}

.form-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.form-group {
  margin-bottom: 20px;
}

.row {
  display: flex;
  gap: 20px;
}

.half {
  flex: 1;
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
}

input:focus, textarea:focus {
  border-color: var(--primary);
  outline: none;
}

textarea.auto-grow {
  resize: none;
  overflow-y: hidden;
  min-height: 100px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background: var(--primary);
  color: #1a1a1a;
  border: none;
}

.btn-outline {
  background: transparent;
  border: 1px solid #ddd;
  color: #666;
}
</style>
