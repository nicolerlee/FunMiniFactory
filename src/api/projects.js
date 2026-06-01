import { http, unwrapPage } from './http'
import { buildMockStats, mockProjects } from './mockData'
import { DEFAULT_PAGE_SIZE } from '@/utils/constants'

function filterLocal(params = {}) {
  const keyword = (params.keyword || '').trim().toLowerCase()
  const category = params.category || 'all'
  const platform = params.platform || ''
  const page = Number(params.page || 1)
  const size = Number(params.size || DEFAULT_PAGE_SIZE)

  // 首页侧栏「H5」是一个聚合类，覆盖 4 个 h5_* 子类
  const H5_CATEGORIES = ['h5_novel', 'h5_yingshi', 'h5_fx', 'h5_lx']

  const filtered = mockProjects.filter((item) => {
    let matchesCategory = true
    if (category && category !== 'all') {
      if (category === 'h5_group') {
        matchesCategory = H5_CATEGORIES.includes(item.category)
      } else {
        matchesCategory = item.category === category
      }
    }
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
