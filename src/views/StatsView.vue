<template>
  <div class="app-frame factory-frame">
    <AppTopbar />
    <main class="stats-main">
      <div class="stats-page-scroll">
        <div class="stats-page-header">
          <div>
            <h1>统计看板</h1>
            <p>按分类、H5 细分、分类内平台结构和新增趋势分析小程序资产</p>
          </div>
          <button class="sync-button" type="button" :disabled="loadingStats" @click="refreshStats">
            <RefreshCw :size="16" :class="{ spin: loadingStats }" />
            刷新统计
          </button>
        </div>

        <StatsCharts :stats="stats" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import StatsCharts from '@/components/stats/StatsCharts.vue'
import { useProjects } from '@/composables/useProjects'

const {
  stats,
  loadStats
} = useProjects()

const loadingStats = ref(false)

async function refreshStats() {
  loadingStats.value = true
  try {
    await loadStats()
  } finally {
    loadingStats.value = false
  }
}

onMounted(refreshStats)
</script>
