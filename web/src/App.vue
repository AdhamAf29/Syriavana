<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import { PhAirplaneTilt } from "@phosphor-icons/vue";

const router = useRouter();
const route = useRoute();
const onHero = ref(false);
const isAdmin = computed(() => route.path.startsWith('/admin'));

function update() { 
  onHero.value = route.path === "/" && window.scrollY < (window.innerHeight - 80); 
}

onMounted(() => { update(); window.addEventListener("scroll", update); });
watch(() => route.path, update);
onUnmounted(() => { window.removeEventListener("scroll", update); });
</script>
<template>
  <div>
    <!-- Global Airplane Animation -->
    <div class="plane-container">
      <PhAirplaneTilt :size="48" weight="fill" class="plane-icon" />
    </div>

    <Navbar v-if="!isAdmin" :on-hero="onHero" />
    <main :class="isAdmin ? '' : ['container', !onHero ? 'offset-top' : '']">
      <router-view />
    </main>
    <Footer v-if="!isAdmin" />
  </div>
</template>
<style>
.actions{display:flex;gap:10px;align-items:center}

/* Airplane Animation */
.plane-container {
  position: fixed;
  top: 100px;
  left: 0;
  z-index: 2000;
  pointer-events: none;
  animation: airplane-fly 25s linear infinite;
  opacity: 0.9;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
}

.plane-icon {
  color: #235789; /* Hardcoded primary color to ensure visibility */
  transform: rotate(45deg); /* Points the NE airplane to East */
  display: block;
}

@keyframes airplane-fly {
  0% {
    transform: translateX(-10vw) translateY(0);
  }
  10% {
    transform: translateX(10vw) translateY(10px) rotate(5deg);
  }
  30% {
    transform: translateX(40vw) translateY(-15px) rotate(-5deg);
  }
  50% {
    transform: translateX(60vw) translateY(10px) rotate(5deg);
  }
  70% {
    transform: translateX(80vw) translateY(-10px) rotate(-5deg);
  }
  90% {
    transform: translateX(100vw) translateY(5px);
  }
  100% {
    transform: translateX(110vw) translateY(0);
  }
}
</style>
