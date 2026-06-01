import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStatsUiStore = defineStore('statsUi', () => {
  const selectedMetric = ref('total')
  return { selectedMetric }
})
