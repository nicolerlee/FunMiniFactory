import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSyncUiStore = defineStore('syncUi', () => {
  const lastTaskId = ref('')
  const lastTaskStatus = ref('')

  function setTask(task) {
    lastTaskId.value = task?.taskId || ''
    lastTaskStatus.value = task?.status || ''
  }

  return { lastTaskId, lastTaskStatus, setTask }
})
