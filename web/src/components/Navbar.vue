<template>

    <nav class="nav">
      <div class="nav-shell">
        <img class="brand-logo" src="/images/logo.png" alt="Syriavana" />
        <router-link to="/">الرئيسية</router-link>
        <router-link to="/sites">المواقع</router-link>
        <router-link to="/trips">الرحلات</router-link>
        <router-link to="/companies">الشركات</router-link>
        
        <!-- Role Based Links -->
        <template v-if="auth.loggedIn">
           <!-- User Links -->
           <router-link v-if="auth.user?.role === 'user'" to="/bookings">حجوزاتي</router-link>
           <router-link v-if="auth.user?.role === 'user'" to="/register-company" style="color: var(--secondary);">سجل شركتك</router-link>
           
           <!-- Company Links -->
           <router-link v-if="auth.user?.role === 'company'" to="/company/dashboard" style="color: var(--accent);">لوحة التحكم</router-link>
           
           <!-- Admin Links -->
           <router-link v-if="auth.user?.role === 'admin'" to="/admin/dashboard" style="color: var(--accent);">الإدارة</router-link>
        </template>
        
        <router-link to="/reviews">التقييمات</router-link>
        <router-link to="/faq">تواصل معنا</router-link>
        <span class="spacer"></span>
        <template v-if="auth.loggedIn">
          <div class="user-profile">
            <PhUserCircle :size="32" weight="duotone" class="avatar-icon" />
            <span class="username">{{ auth.user?.name || auth.user?.email }}</span>
          </div>
          <button class="btn btn-accent" @click="logout">تسجيل الخروج</button>
        </template>
        <template v-else>
          <router-link class="btn btn-primary" to="/login"> تسجيل الدخول</router-link>
        </template>
      </div>
    </nav>
 
</template>
<script setup>
import { useAuthStore } from "../store/auth.js";
import { useRouter } from "vue-router";
import { PhUserCircle } from "@phosphor-icons/vue";

defineProps({ onHero: { type: Boolean, default: false } });
const auth = useAuthStore();
const router = useRouter();
function logout(){ auth.logout(); router.push('/'); }

</script>
<style scoped>
.nav-shell a{color:var(--primary);font-weight:700}
.nav-shell .btn-primary{color:#1a1a1a}
.nav-shell .btn-outline{color:var(--primary);border-color:var(--primary)}
.nav-shell .badge{color:#1a1a1a}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
  font-weight: 600;
  margin-left: 12px;
}

.avatar-icon {
  color: var(--primary);
}
</style>
