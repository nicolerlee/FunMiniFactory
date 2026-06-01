<template>
  <span class="platform-badge" :class="`platform-${platform}`">
    <!-- 微信 -->
    <svg v-if="platform === 'weixin'" class="plat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.09 3.58 2.78 4.69L4 17l2.94-1.59c.79.18 1.61.28 2.46.28.27 0 .54-.01.81-.03-.13-.46-.21-.93-.21-1.41 0-2.97 2.91-5.37 6.5-5.37.31 0 .61.02.91.06C16.96 6.43 13.55 4 9.5 4zM7 8.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4.5 1.93c-3.04 0-5.5 1.99-5.5 4.43 0 2.45 2.46 4.44 5.5 4.44.66 0 1.3-.1 1.91-.27L20 20l-.57-1.49C20.96 17.69 22 16.4 22 14.86c0-2.44-2.46-4.43-5.5-4.43zm-2 2.62c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zm4 0c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75z" />
    </svg>
    <!-- 抖音 -->
    <svg v-else-if="platform === 'douyin'" class="plat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.93a4.85 4.85 0 0 1-1.84-.24z" />
    </svg>
    <!-- 快手 -->
    <svg v-else-if="platform === 'kuaishou'" class="plat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
    </svg>
    <!-- 百度 / 支付宝 / 默认其它平台都用一个圆点 -->
    <svg v-else-if="platform === 'baidu' || platform === 'alipay'" class="plat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="6" />
    </svg>
    <!-- H5 / web -->
    <svg v-else class="plat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18" />
    </svg>
    <span>{{ label }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { platformLabel } from '@/utils/format'

const props = defineProps({
  platform: { type: String, required: true }
})

const label = computed(() => platformLabel(props.platform))
</script>

<style scoped>
.platform-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.plat-icon {
  width: 11px;
  height: 11px;
  flex-shrink: 0;
}

/* 配色：与原型 docs/首页.html 一致 */
.platform-weixin {
  color: #15803d;
  background: #dcfce7;
}

.platform-douyin {
  color: #ffffff;
  background: #1a1a2e;
}

.platform-kuaishou {
  color: #c2410c;
  background: #fff7ed;
}

.platform-web {
  color: #a16207;
  background: #fef9c3;
}

.platform-baidu {
  color: #1d4ed8;
  background: #dbeafe;
}

.platform-alipay {
  color: #0369a1;
  background: #e0f2fe;
}
</style>
