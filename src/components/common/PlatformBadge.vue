<template>
  <span class="platform-badge" :class="`platform-${platform}`">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { platformLabel } from '@/utils/format'

const props = defineProps({
  platform: { type: String, required: true }
})

const label = computed(() => platformLabel(props.platform))
</script>
