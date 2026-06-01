<template>
  <div class="pagination" v-if="pageCount > 1">
    <button type="button" :disabled="page <= 1" @click="$emit('change', page - 1)">上一页</button>
    <span>{{ page }} / {{ pageCount }}</span>
    <button type="button" :disabled="page >= pageCount" @click="$emit('change', page + 1)">下一页</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: Number, required: true },
  size: { type: Number, required: true },
  total: { type: Number, required: true }
})

defineEmits(['change'])

const pageCount = computed(() => Math.ceil(props.total / props.size))
</script>
