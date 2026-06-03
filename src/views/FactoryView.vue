<template>
  <div class="app-frame">
    <AppTopbar />
    <div class="workspace">
      <AppSidebar
        :model-value="query.category"
        :categories="visibleCategories"
        :counts="categoryCounts"
        @update:model-value="setCategory"
      />

      <main class="main-panel">
        <div class="page-heading">
          <div>
            <h1>小程序列表</h1>
            <p>管理所有平台的小程序代码包，查看状态并进入对应子系统</p>
          </div>
          <button class="sync-button" type="button" :disabled="syncing" @click="handleRunSync">
            <RefreshCw :size="16" :class="{ spin: syncing }" />
            {{ syncLabel }}
          </button>
        </div>

        <div class="toolbar">
          <ProjectSearch v-model="keyword" />
          <ProjectFilter
            :platform="query.platform"
            :category="query.category"
            @change="onFilterChange"
          />
        </div>

        <ProjectTable :projects="projects" :loading="loading" />
        <Pagination
          :page="query.page"
          :size="query.size"
          :total="total"
          @change="changePage"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import Pagination from '@/components/common/Pagination.vue'
import ProjectFilter from '@/components/project/ProjectFilter.vue'
import ProjectSearch from '@/components/project/ProjectSearch.vue'
import ProjectTable from '@/components/project/ProjectTable.vue'
import { runSync, getSyncTask } from '@/api/sync'
import { useProjects } from '@/composables/useProjects'
import { useSyncPolling } from '@/composables/useSyncPolling'

const {
  loading,
  projects,
  query,
  total,
  categoryCounts,
  visibleCategories,
  refresh,
  loadProjects,
  setCategory,
  setKeyword
} = useProjects()

const keyword = ref('')
const syncing = ref(false)
const taskStatus = ref('')
const syncLabel = computed(() => syncing.value ? '同步中' : '同步/刷新')

let keywordTimer = null
watch(keyword, (value) => {
  window.clearTimeout(keywordTimer)
  keywordTimer = window.setTimeout(() => setKeyword(value), 220)
})

function onFilterChange({ platform, category }) {
  query.platform = platform || ''
  query.category = category || 'all'
  query.page = 1
  loadProjects()
}

function changePage(page) {
  query.page = page
  loadProjects()
}

async function pollTask(taskId) {
  for (let i = 0; i < 20; i += 1) {
    const task = await getSyncTask(taskId)
    taskStatus.value = task.status
    if (task.status === 'success' || task.status === 'failed') return task
    await new Promise((resolve) => window.setTimeout(resolve, 1000))
  }
  return null
}

async function handleRunSync() {
  syncing.value = true
  try {
    const task = await runSync('novel_miniapp')
    if (task?.taskId) {
      await pollTask(task.taskId)
    }
    await refresh()
  } finally {
    syncing.value = false
  }
}

const polling = useSyncPolling(refresh)

onMounted(async () => {
  await refresh()
  polling.start()
})
</script>
