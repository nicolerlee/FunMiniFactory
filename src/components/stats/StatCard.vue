<template>
  <button class="stat-card" type="button" @click="$emit('select')">
    <span class="stat-icon" :class="tone">
      <AppIcon :name="icon" :size="20" />
    </span>
    <span class="stat-copy">
      <span>{{ label }}</span>
      <strong>{{ value }}</strong>
    </span>
  </button>
</template>

<script setup>
import AppIcon from '@/components/common/AppIcon.vue'

defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: 'stats' },
  tone: { type: String, default: 'neutral' }
})

defineEmits(['select'])
</script>
