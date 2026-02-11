<template>
  <div class="admin-page">
    <div class="page-header">
      <h1>إدارة الشركات</h1>
      <p>عرض وحذف الشركات المسجلة في النظام</p>
    </div>

    <div class="content-card">
      <div v-if="loading" class="loading">جاري التحميل...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>اسم الشركة</th>
            <th>المالك</th>
            <th>البريد الإلكتروني</th>
            <th>الحالة</th>
            <th>تاريخ التسجيل</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="company in companies" :key="company._id">
            <td>
              <div class="company-info">
                <img :src="apiBase + company.logo" v-if="company.logo" class="company-logo-sm" />
                <span>{{ company.name }}</span>
              </div>
            </td>
            <td>{{ company.name || 'N/A' }}</td>
            <td>{{ company.email || '-' }}</td>
            <td>
              <span class="status-badge active">{{ company.role }}</span>
            </td>
            <td>{{ new Date(company.createdAt).toLocaleDateString('ar-EG') }}</td>
            <td>
              <button class="btn-delete" @click="confirmDelete(company)">حذف</button>
            </td>
          </tr>
          <tr v-if="companies.length === 0">
            <td colspan="6" class="empty-state">لا توجد شركات مسجلة حالياً</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../api.js";

const companies = ref([]);
const loading = ref(true);
const error = ref("");
const apiBase = import.meta.env.VITE_API_URL;

onMounted(fetchCompanies);

async function fetchCompanies() {
  try {
    const res = await api.get("/api/admin/companies");
    companies.value = res.data;
  } catch (e) {
    error.value = "فشل تحميل قائمة الشركات";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function confirmDelete(company) {
  if (!confirm(`هل أنت متأكد من حذف شركة "${company.name}"؟ سيتم حذف جميع رحلاتها وإعادة المالك إلى رتبة مستخدم عادي.`)) return;

  try {
    await api.delete(`/api/admin/companies/${company._id}`);
    companies.value = companies.value.filter(c => c._id !== company._id);
    alert("تم حذف الشركة بنجاح");
  } catch (e) {
    alert("فشل حذف الشركة");
    console.error(e);
  }
}
</script>

<style scoped>
.admin-page { padding: 30px; direction: rtl; }
.page-header { margin-bottom: 30px; text-align: right; }
.page-header h1 { font-size: 24px; color: #2c3e50; margin-bottom: 8px; }
.page-header p { color: #7f8c8d; }

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
}

.data-table { width: 100%; border-collapse: collapse; direction: rtl; }
.data-table th, .data-table td { padding: 15px 20px; text-align: right; border-bottom: 1px solid #eee; }
.data-table th { background: #f8f9fa; color: #2c3e50; font-weight: 600; }
.data-table tr:hover { background: #f8f9fa; }

.company-info { display: flex; align-items: center; gap: 10px; }
.company-logo-sm { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.status-badge.active { background: #d4edda; color: #155724; }
.status-badge.pending { background: #fff3cd; color: #856404; }

.btn-delete {
  background: #ffebee;
  color: #c0392b;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-delete:hover { background: #ffcdd2; }

.loading, .error, .empty-state { padding: 40px; text-align: center; color: #7f8c8d; }
.error { color: #e74c3c; }
</style>
