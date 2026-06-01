<template>
  <label class="search-field">
    <Search :size="16" :stroke-width="2.4" />
    <input
      :value="modelValue"
      type="search"
      placeholder="搜索小程序..."
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>

<script setup>
import { Search } from 'lucide-vue-next'

defineProps({
  modelValue: { type: String, default: '' }
})

defineEmits(['update:modelValue'])
</script>
