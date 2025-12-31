<template>

    <nav class="nav">
      <div class="nav-shell">
        <img class="brand-logo" src="/images/logo.png" alt="Syriavana" />
        <router-link to="/">الرئيسية</router-link>
        <router-link to="/sites">المواقع</router-link>
        <router-link to="/trips">الرحلات</router-link>
        <router-link to="/bookings">حجوزاتي</router-link>
        <router-link to="/reviews">التقييمات</router-link>
        <span class="spacer"></span>
        <template v-if="auth.loggedIn">
          <span class="badge">{{ auth.user?.email }}</span>
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
defineProps({ onHero: { type: Boolean, default: false } });
const auth = useAuthStore();
const router = useRouter();
function logout(){ auth.logout(); router.push('/'); }

</script>
<style scoped>
.nav-shell a{color:var(--primary)}
.nav-shell .btn-primary{color:#1a1a1a}
.nav-shell .btn-outline{color:var(--primary);border-color:var(--primary)}
.nav-shell .badge{color:#1a1a1a}
</style>
