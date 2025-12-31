<template>
  <div class="auth-page">
    <div class="decor deco-left">
      <svg width="140" height="80" viewBox="0 0 140 80"><path d="M5 60 C 35 20, 75 20, 135 60" fill="none" stroke="rgba(35,87,137,.25)" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 6"/></svg>
    </div>
    <div class="decor deco-right">
      <svg width="140" height="80" viewBox="0 0 140 80"><path d="M5 20 C 55 60, 95 60, 135 20" fill="none" stroke="rgba(35,87,137,.25)" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 6"/></svg>
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
.auth-card :deep(label){display:flex;flex-direction:column;gap:12px;margin:0 0 14px}
.auth-card :deep(.btn){justify-content:center;text-align:center}
</style>
