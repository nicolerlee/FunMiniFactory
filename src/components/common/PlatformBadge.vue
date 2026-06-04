<template>
  <span class="platform-badge" :class="`platform-${platform}`">
    {{ label }}
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
  gap: 6px;
  padding: 3px 10px 3px 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

/* 左侧彩色竖条 */
.platform-badge::before {
  content: '';
  width: 3px;
  height: 14px;
  border-radius: 99px;
  flex-shrink: 0;
}

/* 配色 */
.platform-weixin {
  color: #15803d;
  background: #f0fdf4;
}
.platform-weixin::before {
  background: #22c55e;
}

.platform-douyin {
  color: #4b5563;
  background: #f9fafb;
}
.platform-douyin::before {
  background: #9ca3af;
}

.platform-kuaishou {
  color: #c2410c;
  background: #fff7ed;
}
.platform-kuaishou::before {
  background: #f97316;
}

.platform-web {
  color: #a16207;
  background: #fefce8;
}
.platform-web::before {
  background: #eab308;
}

.platform-baidu {
  color: #1d4ed8;
  background: #eff6ff;
}
.platform-baidu::before {
  background: #3b82f6;
}

.platform-alipay {
  color: #0369a1;
  background: #f0f9ff;
}
.platform-alipay::before {
  background: #0ea5e9;
}

.platform-common {
  color: #4b5563;
  background: #f9fafb;
}
.platform-common::before {
  background: #9ca3af;
}
</style>
