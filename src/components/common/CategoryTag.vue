<template>
  <span class="category-tag" :class="`category-${category}`">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { categoryLabel } from '@/utils/format'

const props = defineProps({
  category: { type: String, required: true }
})

const label = computed(() => categoryLabel(props.category))
</script>
