<template>
  <div>
    <Navbar :on-hero="onHero" />
    <main :class="['container', !onHero ? 'offset-top' : '']">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
const router = useRouter();
const route = useRoute();
const onHero = ref(false);
function update() { onHero.value = route.path === "/" && window.scrollY < (window.innerHeight - 80); }
onMounted(() => { update(); window.addEventListener("scroll", update); });
watch(() => route.path, update);
onUnmounted(() => { window.removeEventListener("scroll", update); });
</script>
<style>
.actions{display:flex;gap:10px;align-items:center}
</style>
