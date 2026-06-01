<template>
  <nav class="topbar">
    <div class="topbar-inner">
      <RouterLink to="/" class="brand">
        <span class="brand-mark"><AppIcon name="monitor" :size="18" /></span>
        <span>FunMini</span>
      </RouterLink>
      <div class="nav-links">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/factory">小程序工厂</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import AppIcon from '@/components/common/AppIcon.vue'
</script>
