import { onBeforeUnmount, ref } from 'vue'
import { getSyncStatus } from '@/api/sync'

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
