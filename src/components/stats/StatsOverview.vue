<template>
  <section class="stats-overview" aria-label="项目统计">
    <div class="overview-metrics">
      <StatCard label="项目总数" :value="number(stats.total)" icon="stats" tone="dark" />
      <StatCard label="7天更新" :value="number(stats.freshness?.updatedIn7Days)" icon="sync" tone="novel" />
      <StatCard label="30天未更新" :value="number(stats.freshness?.staleOver30Days)" icon="monitor" tone="h5" />
      <StatCard label="异常数据" :value="number(issueTotal)" icon="warning" :tone="issueTotal ? 'danger' : 'novel'" />
    </div>

    <div class="overview-details">
      <div class="mini-panel">
        <div class="mini-panel-head">
          <span>平台分布</span>
          <strong>{{ topPlatformLabel }}</strong>
        </div>
        <div class="rank-list">
          <div v-for="item in topPlatforms" :key="item.platform" class="rank-row">
            <span>{{ platformLabel(item.platform) }}</span>
            <i :style="{ width: percent(item.count, stats.total) }"></i>
            <strong>{{ item.count }}</strong>
          </div>
        </div>
      </div>

      <div class="mini-panel">
        <div class="mini-panel-head">
          <span>状态分布</span>
          <strong>{{ primaryStatus }}</strong>
        </div>
        <div class="pill-list">
          <span v-for="item in visibleStatuses" :key="item.status" class="status-pill">
            {{ statusLabel(item.status) }} {{ item.count }}
          </span>
        </div>
      </div>

      <div class="mini-panel">
        <div class="mini-panel-head">
          <span>同步健康</span>
          <strong>{{ syncText }}</strong>
        </div>
        <div class="sync-dots">
          <span class="sync-dot success">成功 {{ number(stats.syncHealth?.success) }}</span>
          <span class="sync-dot failed">失败 {{ number(stats.syncHealth?.failed) }}</span>
          <span class="sync-dot running">进行中 {{ number(stats.syncHealth?.running) }}</span>
          <span class="sync-dot unknown">未知 {{ number(stats.syncHealth?.unknown) }}</span>
        </div>
      </div>

      <div class="mini-panel">
        <div class="mini-panel-head">
          <span>数据治理</span>
          <strong>{{ qualityText }}</strong>
        </div>
        <div class="quality-list">
          <span>负责人空 {{ number(stats.dataQuality?.missingOwner) }}</span>
          <span>版本空 {{ number(stats.dataQuality?.missingVersion) }}</span>
          <span>构建配置缺失 {{ number(stats.dataQuality?.missingBuildConfig) }}</span>
          <span>同步缺失 {{ number(stats.dataQuality?.missingAfterFull) }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import StatCard from '@/components/stats/StatCard.vue'
import { platformLabel } from '@/utils/format'

const props = defineProps({
  stats: { type: Object, required: true }
})

const topPlatforms = computed(() => {
  return [...(props.stats.byPlatform || [])]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const visibleStatuses = computed(() => {
  return [...(props.stats.byStatus || [])]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const issueTotal = computed(() => {
  const quality = props.stats.dataQuality || {}
  return ['missingOwner', 'missingVersion', 'missingBuildConfig', 'missingAfterFull']
    .reduce((sum, key) => sum + Number(quality[key] || 0), 0)
})

const topPlatformLabel = computed(() => {
  const first = topPlatforms.value[0]
  return first ? platformLabel(first.platform) : '-'
})

const primaryStatus = computed(() => {
  const first = visibleStatuses.value[0]
  return first ? `${statusLabel(first.status)} ${first.count}` : '-'
})

const syncText = computed(() => {
  const sync = props.stats.syncHealth || {}
  const failed = Number(sync.failed || 0)
  const running = Number(sync.running || 0)
  if (failed > 0) return `${failed} 个失败`
  if (running > 0) return `${running} 个同步中`
  return '正常'
})

const qualityText = computed(() => issueTotal.value ? `${issueTotal.value} 项` : '完整')

function number(value) {
  return Number(value || 0).toLocaleString('zh-CN')
}

function percent(count, total) {
  const base = Number(total || 0)
  if (!base) return '0%'
  return `${Math.max(8, Math.round((Number(count || 0) / base) * 100))}%`
}

function statusLabel(value) {
  const labels = {
    online: '在线',
    offline: '下线',
    active: '正常',
    inactive: '停用',
    success: '成功',
    failed: '失败',
    unknown: '未知'
  }
  return labels[value] || value || '未知'
}
</script>
