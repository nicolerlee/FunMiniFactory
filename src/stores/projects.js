import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectUiStore = defineStore('projectUi', () => {
  const lastCategory = ref('all')
  const lastKeyword = ref('')

  function remember({ category, keyword }) {
    lastCategory.value = category || 'all'
    lastKeyword.value = keyword || ''
  }

  return { lastCategory, lastKeyword, remember }
})
