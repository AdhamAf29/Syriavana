<template>
  <div class="auth-page">
    <div class="decor deco-left">
      <svg width="140" height="80" viewBox="0 0 140 80"><path d="M5 60 C 35 20, 75 20, 135 60" fill="none" stroke="rgba(35,87,137,.25)" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 6"/></svg>
    </div>
    <div class="decor deco-right">
      <svg width="140" height="80" viewBox="0 0 140 80"><path d="M5 20 C 55 60, 95 60, 135 20" fill="none" stroke="rgba(35,87,137,.25)" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 6"/></svg>
    </div>

    <!-- Animated Flight Background -->
    <div class="flight-anim">
      <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="none">
        <defs>
          <path id="flyPath" d="M -100,400 C 200,500 400,100 600,300 S 1100,100 1200,200" />
        </defs>
        <!-- Dashed Flight Path -->
        <use href="#flyPath" fill="none" stroke="rgba(35,87,137,0.2)" stroke-width="2" stroke-dasharray="10 10" />
        
        <!-- Airplane Group -->
        <g>
          <!-- Airplane Icon (Rotated to point right for auto-rotation) -->
          <path fill="#235789" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="translate(-12, -12) rotate(90, 12, 12) scale(2)" />
          
          <!-- Animation along path -->
          <animateMotion dur="15s" repeatCount="indefinite" rotate="auto">
            <mpath href="#flyPath" />
          </animateMotion>
        </g>
      </svg>
    </div>

    <div class="auth-card">
      <div class="brand">Syriavana</div>
      <h1 class="title"><slot name="title" /></h1>
      <p class="subtitle"><slot name="subtitle" /></p>
      <slot />
      <div class="meta"><slot name="meta" /></div>
    </div>
  </div>
</template>
<style scoped>
.auth-card :deep(form){display:flex;flex-direction:column;gap:20px}
.auth-card :deep(label){display:flex;flex-direction:column;gap:16px;margin:0 0 20px}
.auth-card :deep(.btn){justify-content:center;text-align:center}

.flight-anim {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
</style>
