import { http } from './http'

const fallbackStatus = [
  { source: 'novel_miniapp', lastSuccessChangeId: 10086, lastStatus: 'success', lastSuccessTime: '2026-05-29T14:20:00+08:00' },
  { source: 'video_miniapp', lastSuccessChangeId: 12099, lastStatus: 'success', lastSuccessTime: '2026-05-29T14:19:00+08:00' },
  { source: 'h5', lastSuccessChangeId: 3021, lastStatus: 'success', lastSuccessTime: '2026-05-29T14:18:00+08:00' }
]

export async function getSyncStatus() {
  try {
    return (await http.get('/api/project-sync/status')).data
  } catch {
    return fallbackStatus
  }
}

export async function runSync(source) {
  const url = source ? `/api/project-sync/run/${source}` : '/api/project-sync/run'
  return (await http.post(url)).data
}

export async function getSyncTask(taskId) {
  return (await http.get(`/api/project-sync/tasks/${taskId}`)).data
}
