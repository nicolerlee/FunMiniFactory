<template>
  <div class="quick-filter">
    <button
      v-for="item in items"
      :key="item.label"
      type="button"
      :class="{ on: isActive(item) }"
      @click="onSelect(item)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  platform: { type: String, default: '' },
  category: { type: String, default: 'all' }
})

const emit = defineEmits(['change'])

const items = [
  { label: '全部平台', kind: 'all' },
  { label: '微信', kind: 'platform', value: 'weixin' },
  { label: '抖音', kind: 'platform', value: 'douyin' },
  { label: '快手', kind: 'platform', value: 'kuaishou' },
  { label: '百度', kind: 'platform', value: 'baidu' },
  { label: '支付宝', kind: 'platform', value: 'alipay' },
  { label: '通用', kind: 'platform', value: 'common' }
]

function isActive(item) {
  if (item.kind === 'all') {
    return !props.platform
  }
  if (item.kind === 'platform') {
    return props.platform === item.value
  }
  return false
}

function onSelect(item) {
  if (item.kind === 'all') {
    emit('change', { platform: '' })
    return
  }
  if (item.kind === 'platform') {
    emit('change', { platform: item.value })
    return
  }
}
</script>
