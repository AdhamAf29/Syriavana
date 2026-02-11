<template>
  <div class="admin-page">
    <header class="page-header">
      <h1>Users Management</h1>
      <p>Manage registered users and their roles</p>
    </header>

    <div v-if="loading" class="loading">Loading users...</div>

    <div v-else-if="users.length === 0" class="empty-state">
      <p>No users found.</p>
    </div>

    <div v-else class="content-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>
              <div class="user-info">
                <div class="avatar-sm">{{ user.name.charAt(0).toUpperCase() }}</div>
                <span>{{ user.name }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge" :class="user.role">{{ user.role }}</span>
            </td>
            <td>{{ new Date(user.createdAt || Date.now()).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../api";

const users = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get("/api/admin/users");
    users.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.admin-page { direction: rtl; }
.page-header { margin-bottom: 30px; text-align: right; }
.page-header h1 { font-size: 24px; color: #235789; margin-bottom: 8px; }
.page-header p { color: #7f8c8d; }

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  overflow-x: auto;
}

.data-table { width: 100%; border-collapse: collapse; min-width: 600px; direction: rtl; }
.data-table th, .data-table td {
  padding: 15px 20px;
  text-align: right;
  border-bottom: 1px solid #eee;
}
.data-table th { background: #f8f9fa; color: #2c3e50; font-weight: 600; }
.data-table tr:hover { background: #f8f9fa; }

.user-info { display: flex; align-items: center; gap: 10px; }
.avatar-sm {
  width: 32px; height: 32px;
  background: #235789; color: white;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 14px;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}
.badge.admin { background: #e3f2fd; color: #1976d2; }
.badge.company { background: #e8f5e9; color: #2e7d32; }
.badge.user { background: #f5f5f5; color: #616161; }

.loading, .empty-state { padding: 40px; text-align: center; color: #7f8c8d; }
</style>