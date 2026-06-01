<template>
  <aside class="sidebar">
    <div class="sidebar-section-title">品类筛选</div>
    <button
      v-for="[key, meta] in categories"
      :key="key"
      class="sidebar-filter"
      :class="{ on: modelValue === key }"
      type="button"
      @click="$emit('update:modelValue', key)"
    >
      <span class="filter-icon" :class="`filter-${meta.tone}`">
        <AppIcon :name="key" :size="15" />
      </span>
      <span class="filter-name">{{ meta.label }}</span>
      <span class="filter-count">{{ counts[key] || 0 }}</span>
    </button>
  </aside>
</template>

<script setup>
import AppIcon from '@/components/common/AppIcon.vue'

defineProps({
  modelValue: { type: String, required: true },
  categories: { type: Array, required: true },
  counts: { type: Object, required: true }
})

defineEmits(['update:modelValue'])
</script>
