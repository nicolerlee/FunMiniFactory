import { http, unwrapPage } from './http'
// import { buildMockStats, mockProjects } from './mockData'
// import { DEFAULT_PAGE_SIZE } from '@/utils/constants'

// 拉不到数据时不再回退到 mock 假数据，相关逻辑已注释。
// function filterLocal(params = {}) {
//   const keyword = (params.keyword || '').trim().toLowerCase()
//   const category = params.category || 'all'
//   const platform = params.platform || ''
//   const page = Number(params.page || 1)
//   const size = Number(params.size || DEFAULT_PAGE_SIZE)
//
//   // 首页侧栏「H5」是一个聚合类，覆盖 4 个 h5_* 子类
//   const H5_CATEGORIES = ['h5_novel', 'h5_yingshi', 'h5_fenxiao', 'h5_laxin']
//
//   const filtered = mockProjects.filter((item) => {
//     let matchesCategory = true
//     if (category && category !== 'all') {
//       if (category === 'h5_group') {
//         matchesCategory = H5_CATEGORIES.includes(item.category)
//       } else {
//         matchesCategory = item.category === category
//       }
//     }
//     const matchesPlatform = !platform || item.platform === platform
//     const matchesKeyword = !keyword ||
//       item.appName.toLowerCase().includes(keyword) ||
//       item.appId.toLowerCase().includes(keyword)
//     return matchesCategory && matchesPlatform && matchesKeyword
//   })
//
//   return {
//     items: filtered.slice((page - 1) * size, page * size),
//     total: filtered.length,
//     page,
//     size
//   }
// }

export async function getProjects(params = {}) {
  return unwrapPage(await http.get('/api/projects', { params }))
  // 拉不到数据时不再回退到 mock 假数据
  // try {
  //   return unwrapPage(await http.get('/api/projects', { params }))
  // } catch {
  //   return filterLocal(params)
  // }
}

export async function getProjectStats() {
  return (await http.get('/api/projects/stats')).data
  // 拉不到数据时不再回退到 mock 假数据
  // try {
  //   return (await http.get('/api/projects/stats')).data
  // } catch {
  //   return buildMockStats()
  // }
}
