import { computed, reactive, ref } from 'vue'
import { getProjects, getProjectStats } from '@/api/projects'
import { CATEGORY_META, DEFAULT_PAGE_SIZE } from '@/utils/constants'

export function useProjects() {
  const loading = ref(false)
  const projects = ref([])
  const stats = ref({
    total: 0,
    byCategory: [],
    byPlatform: [],
    byCategoryPlatform: [],
    newTrend: [],
    byStatus: [],
    byOwner: [],
    freshness: { updatedIn7Days: 0, staleOver30Days: 0, staleOver90Days: 0 },
    syncHealth: { success: 0, failed: 0, running: 0, unknown: 0 },
    dataQuality: { missingOwner: 0, missingVersion: 0, missingBuildConfig: 0, missingAfterFull: 0 },
    recent: []
  })
  const query = reactive({
    keyword: '',
    category: 'all',
    platform: '',
    page: 1,
    size: DEFAULT_PAGE_SIZE
  })
  const total = ref(0)

  const categoryCounts = computed(() => {
    const map = { all: stats.value.total || total.value }
    for (const row of stats.value.byCategory || []) {
      map[row.category] = row.count
    }
    return map
  })

  const visibleCategories = computed(() => {
    return Object.entries(CATEGORY_META).filter(([key]) => key === 'all' || categoryCounts.value[key] > 0)
  })

  async function loadProjects() {
    loading.value = true
    try {
      const data = await getProjects(query)
      projects.value = data.items || []
      total.value = data.total || 0
    } finally {
      loading.value = false
    }
  }

  async function loadStats() {
    stats.value = await getProjectStats()
  }

  async function refresh() {
    await Promise.all([loadProjects(), loadStats()])
  }

  function setCategory(category) {
    query.category = category
    query.page = 1
    return loadProjects()
  }

  function setKeyword(keyword) {
    query.keyword = keyword
    query.page = 1
    return loadProjects()
  }

  return {
    loading,
    projects,
    stats,
    query,
    total,
    categoryCounts,
    visibleCategories,
    refresh,
    loadProjects,
    loadStats,
    setCategory,
    setKeyword
  }
}
