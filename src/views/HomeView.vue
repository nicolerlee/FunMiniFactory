<template>
  <div class="app-frame">
    <AppTopbar />
    <main class="home-main">
      <section class="home-header">
        <div>
          <h1>FunMini 项目总览</h1>
          <p>统一查看公司内部小程序和 H5 项目，快速进入对应子系统。</p>
        </div>
        <RouterLink class="primary-link" to="/factory">进入小程序工厂</RouterLink>
      </section>

      <section class="stats-grid">
        <StatCard label="项目总数" :value="stats.total" icon="all" tone="dark" />
        <StatCard
          v-for="row in stats.byCategory"
          :key="row.category"
          :label="categoryLabel(row.category)"
          :value="row.count"
          :icon="row.category"
          :tone="row.category"
        />
      </section>

      <section class="recent-section">
        <div class="section-title">
          <h2>最近新增</h2>
          <RouterLink to="/factory">查看全部</RouterLink>
        </div>
        <ProjectTable :projects="stats.recent || []" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import ProjectTable from '@/components/project/ProjectTable.vue'
import StatCard from '@/components/stats/StatCard.vue'
import { getProjectStats } from '@/api/projects'
import { categoryLabel } from '@/utils/format'

const stats = ref({ total: 0, byCategory: [], byPlatform: [], recent: [] })

onMounted(async () => {
  stats.value = await getProjectStats()
})
</script>
