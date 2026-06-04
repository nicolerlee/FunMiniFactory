import { onBeforeUnmount, ref } from 'vue'
import { getSyncStatus, getSyncTask } from '@/api/sync'

const FINISHED_TASK_STATUSES = new Set(['success', 'failed', 'not_found'])

export function useSyncPolling(onChanged, interval = 30000) {
  const statuses = ref([])
  const loading = ref(false)
  let timer = null
  let lastKey = ''

  async function loadStatus() {
    loading.value = true
    try {
      const next = await getSyncStatus()
      statuses.value = next
      const key = next.map((item) => `${item.source}:${item.lastSuccessChangeId}:${item.lastStatus}`).join('|')
      if (lastKey && key !== lastKey && onChanged) {
        await onChanged()
      }
      lastKey = key
    } finally {
      loading.value = false
    }
  }

  function start() {
    stop()
    loadStatus()
    timer = window.setInterval(loadStatus, interval)
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer)
      timer = null
    }
  }

  onBeforeUnmount(stop)

  return { statuses, loading, start, stop, loadStatus }
}

export async function waitSyncTask(taskId, { attempts = 20, interval = 1000 } = {}) {
  if (!taskId) return null
  for (let i = 0; i < attempts; i += 1) {
    const task = await getSyncTask(taskId)
    if (FINISHED_TASK_STATUSES.has(task.status)) return task
    await new Promise((resolve) => window.setTimeout(resolve, interval))
  }
  return null
}
