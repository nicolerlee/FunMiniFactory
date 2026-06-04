<template>
  <nav class="topbar">
    <div class="topbar-inner">
      <RouterLink to="/" class="brand">
        <span class="brand-mark">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2.5"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <rect x="2" y="3" width="20" height="14" rx="3" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </span>
        <span class="brand-text">FunMini Factory</span>
      </RouterLink>
      <div class="topbar-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="topbar-tab"
          :class="{ active: isActive(item) }"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { to: '/', label: '首页', match: (path) => path === '/' },
  { to: '/factory', label: '小程序工厂', match: (path) => path.startsWith('/factory') },
  { to: '/stats', label: '资产大盘', match: (path) => path.startsWith('/stats') }
]

function isActive(item) {
  return item.match(route.path)
}
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background:
    radial-gradient(circle at 86% 220%, rgba(255, 183, 135, 0.28), transparent 42%),
    radial-gradient(circle at 8% 220%, rgba(168, 85, 247, 0.08), transparent 42%),
    linear-gradient(110deg, #faf6f1 0%, #faf6f1 46%, #fbeee3 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 0;
  /* 锁定字体，避免被父级（HomeView 的 Plus Jakarta Sans / FactoryView 的 Inter）继承差异影响 */
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.topbar-inner {
  width: 100%;
  padding: 0 48px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b6b, #f43f5e);
  box-shadow: 0 12px 24px rgba(244, 63, 94, 0.3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.01em;
  color: #1a1a2e;
}

.topbar-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.topbar-tab {
  position: relative;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #8b8b9e;
  text-decoration: none;
  transition: color 0.3s;
}

.topbar-tab:hover {
  color: #1a1a2e;
}

.topbar-tab.active {
  color: #1a1a2e;
}

.topbar-tab.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 16px;
  right: 16px;
  height: 2px;
  border-radius: 2px;
  background: #ff6b6b;
}

@media (max-width: 560px) {
  .topbar-inner {
    padding: 0 16px;
  }
  .topbar-nav {
    gap: 12px;
  }
  .topbar-tab {
    padding: 6px 8px;
  }
  .topbar-tab.active::after {
    left: 8px;
    right: 8px;
  }
}
</style>
