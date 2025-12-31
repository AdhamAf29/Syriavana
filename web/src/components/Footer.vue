<template>
  <footer class="footer">
    <div class="footer-grid">
      <div class="footer-col">
        <div class="brand-line">
          <img class="footer-logo" src="/images/logo.png" alt="Syriavana" />
          <span class="footer-brand">Syriavana</span>
        </div>
        <p class="footer-text">نأخذك في رحلة لا تُنسى عبر تاريخ وطبيعة سوريا</p>
      </div>
      <div class="footer-col">
        <h4 class="footer-title">روابط سريعة</h4>
        <ul class="footer-list">
          <li><router-link to="/">الرئيسية</router-link></li>
          <li><router-link to="/trips">الرحلات</router-link></li>
          <li><router-link to="/sites">المواقع</router-link></li>
          <li><router-link to="/reviews">التقييمات</router-link></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 class="footer-title">تواصل معنا</h4>
        <ul class="footer-list">
          <li class="phone"><PhPhone class="ico" /> <span class="num">+963 932 254 615</span></li>
          <li><PhEnvelopeSimple class="ico" /> info@syriavana.com</li>
          <li><PhMapPin class="ico" /> دمشق، سوريا</li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 class="footer-title">تابعنا</h4>
        <div class="footer-socials">
          <a href="#" aria-label="Facebook"><PhFacebookLogo class="ico" /></a>
          <a href="#" aria-label="Instagram"><PhInstagramLogo class="ico" /></a>
          <a href="#" aria-label="WhatsApp"><PhWhatsappLogo class="ico" /></a>
        </div>
      </div>
    </div>
    <div class="footer-bar">جميع الحقوق محفوظة © {{ year }}</div>
  </footer>
</template>
<script setup>
import { ref } from "vue";
import { PhPhone, PhEnvelopeSimple, PhMapPin, PhFacebookLogo, PhInstagramLogo, PhWhatsappLogo } from "@phosphor-icons/vue";
const year = ref(new Date().getFullYear());
</script>
<style scoped>
.phone .num{direction:ltr;unicode-bidi:bidi-override}
.ico{vertical-align:middle;color:#FFC805}
.footer-socials .ico{font-size:20px}
.footer{border-top-left-radius:20px;border-top-right-radius:20px;overflow:hidden}
</style>
