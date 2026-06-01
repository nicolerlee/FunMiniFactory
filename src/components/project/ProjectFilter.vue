<template>
  <div class="quick-filter">
    <button
      v-for="platform in platforms"
      :key="platform.value"
      type="button"
      :class="{ on: modelValue === platform.value }"
      @click="$emit('update:modelValue', platform.value)"
    >
      {{ platform.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' }
})

defineEmits(['update:modelValue'])

const platforms = [
  { value: '', label: '全部平台' },
  { value: 'weixin', label: '微信' },
  { value: 'douyin', label: '抖音' },
  { value: 'kuaishou', label: '快手' },
  { value: 'baidu', label: '百度' },
  { value: 'alipay', label: '支付宝' },
  { value: 'web', label: 'H5' }
]
</script>
