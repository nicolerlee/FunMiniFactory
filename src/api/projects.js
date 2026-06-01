import { http, unwrapPage } from './http'
import { buildMockStats, mockProjects } from './mockData'
import { DEFAULT_PAGE_SIZE } from '@/utils/constants'

function filterLocal(params = {}) {
  const keyword = (params.keyword || '').trim().toLowerCase()
  const category = params.category || 'all'
  const platform = params.platform || ''
  const page = Number(params.page || 1)
  const size = Number(params.size || DEFAULT_PAGE_SIZE)

  const filtered = mockProjects.filter((item) => {
    const matchesCategory = category === 'all' || !category || item.category === category
    const matchesPlatform = !platform || item.platform === platform
    const matchesKeyword = !keyword ||
      item.appName.toLowerCase().includes(keyword) ||
      item.appId.toLowerCase().includes(keyword)
    return matchesCategory && matchesPlatform && matchesKeyword
  })

  return {
    items: filtered.slice((page - 1) * size, page * size),
    total: filtered.length,
    page,
    size
  }
}

export async function getProjects(params = {}) {
  try {
    return unwrapPage(await http.get('/api/projects', { params }))
  } catch {
    return filterLocal(params)
  }
}

export async function getProjectStats() {
  try {
    return (await http.get('/api/projects/stats')).data
  } catch {
    return buildMockStats()
  }
}
