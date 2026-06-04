<template>
  <div class="app-frame factory-frame stats-frame">
    <AppTopbar />
    <main class="stats-main">
      <div class="stats-page-scroll">
        <div class="stats-page-header">
          <div>
            <h1>资产大盘</h1>
            <p>一览小程序资产的分类、平台分布与新增趋势</p>
          </div>
          <button class="sync-button" type="button" :disabled="loadingStats" @click="refreshStats">
            <RefreshCw :size="16" :class="{ spin: loadingStats }" />
            刷新统计
          </button>
        </div>

        <section class="bento" aria-label="统计概览">
          <div class="bento-card hero-card">
            <div>
              <div class="label">总项目数</div>
              <div class="number">{{ number(stats.total) }}</div>
              <div class="trend">
                <TrendingUp :size="16" />
                最近 30 天新增 {{ number(trendTotal) }}
              </div>
            </div>
            <div class="meta">
              覆盖 {{ number(categoryTotal) }} 个分类 · {{ number(platformTotal) }} 个平台<br>
              最近更新 {{ lastUpdatedText }}
            </div>
          </div>

          <div class="bento-card rank-card">
            <div class="card-head">
              <h3>分类分布</h3>
              <span>按项目数量排序</span>
            </div>
            <div v-if="rankItems.length" class="rank-list">
              <div v-for="item in rankItems" :key="item.category" class="rank-item">
                <span class="name">{{ item.label }}</span>
                <div class="bar-track">
                  <div
                    class="bar-fill"
                    :style="{ width: percent(item.count, maxCategoryCount), '--bar-color': item.color }"
                  ></div>
                </div>
                <strong class="count">{{ number(item.count) }}</strong>
              </div>
            </div>
            <div v-else class="empty-state">暂无分类数据</div>
          </div>
        </section>

        <section class="trend-section" aria-label="新增趋势">
          <div class="echart-panel">
            <div class="echart-head">
              <div>
                <h2>最近新增趋势</h2>
                <span>{{ trendSubtitle }}</span>
              </div>
              <div class="trend-toggle" role="tablist" aria-label="趋势模式">
                <button
                  type="button"
                  :class="{ on: trendMode === 'total' }"
                  @click="setTrendMode('total')"
                >
                  总量
                </button>
                <button
                  type="button"
                  :class="{ on: trendMode === 'category' }"
                  @click="setTrendMode('category')"
                >
                  按分类
                </button>
              </div>
            </div>
            <div ref="trendChartRef" class="trend-chart-box"></div>
            <div class="trend-legend" :class="{ show: trendMode === 'category' }">
              <button
                type="button"
                class="legend-pill legend-all"
                :class="{ selected: isAllCategoriesActive }"
                :aria-pressed="isAllCategoriesActive"
                @click="showAllTrendCategories"
              >
                全部
              </button>
              <button
                v-for="item in categoryRows"
                :key="item.category"
                type="button"
                class="legend-pill"
                :class="{
                  inactive: !activeCategoryKeys.includes(item.category),
                  selected: isOnlyCategoryActive(item.category)
                }"
                :aria-pressed="activeCategoryKeys.includes(item.category)"
                @click="selectTrendCategory(item.category)"
              >
                <span class="dot" :style="{ background: item.color }"></span>
                {{ item.label }}
              </button>
            </div>
          </div>
        </section>

        <section class="detail-section" aria-label="小程序类详情">
          <div class="section-title">
            <span class="dot" style="background: #e85d4c"></span>
            <h2>小程序类</h2>
            <span class="count">{{ miniappRows.length }} 个分类 · {{ number(miniappTotal) }} 个项目</span>
          </div>
          <div v-if="miniappRows.length" class="cat-grid">
            <article
              v-for="(item, index) in miniappRows"
              :key="item.category"
              class="cat-card"
              :style="{ '--cat-color': item.color, animationDelay: `${index * 0.05}s` }"
            >
              <CategoryCard :item="item" />
            </article>
          </div>
          <div v-else class="empty-state panel-empty">暂无小程序类数据</div>
        </section>

        <section class="detail-section" aria-label="H5 页面类详情">
          <div class="section-title">
            <span class="dot" style="background: #f59e0b"></span>
            <h2>H5 页面类</h2>
            <span class="count">{{ h5Rows.length }} 个分类 · {{ number(h5Total) }} 个项目</span>
          </div>
          <div v-if="h5Rows.length" class="cat-grid">
            <article
              v-for="(item, index) in h5Rows"
              :key="item.category"
              class="cat-card"
              :style="{ '--cat-color': item.color, animationDelay: `${(index + miniappRows.length) * 0.05}s` }"
            >
              <CategoryCard :item="item" />
            </article>
          </div>
          <div v-else class="empty-state panel-empty">暂无 H5 页面类数据</div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RefreshCw, TrendingUp } from 'lucide-vue-next'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { useProjects } from '@/composables/useProjects'
import { categoryLabel, platformLabel, relativeTime } from '@/utils/format'

const { stats, loadStats } = useProjects()

const loadingStats = ref(false)
const lastUpdatedAt = ref(null)
const trendMode = ref('total')
const trendChartRef = ref(null)
const activeCategoryKeys = ref([])

let trendChart = null
let resizeObserver = null
let echarts = null

const h5Keys = ['h5_novel', 'h5_yingshi', 'h5_fenxiao', 'h5_laxin']

const categoryColors = {
  yingshi: '#e85d4c',
  novel: '#10b981',
  playlet: '#3b82f6',
  manju: '#8b5cf6',
  h5_novel: '#f59e0b',
  h5_yingshi: '#f97316',
  h5_fenxiao: '#d97706',
  h5_laxin: '#92400e',
  unknown: '#9ca3af'
}

const platformMeta = {
  common: { color: '#9ca3af', abbr: '通' },
  baidu: { color: '#3b82f6', abbr: '百' },
  douyin: { color: '#1f2937', abbr: '抖' },
  kuaishou: { color: '#f97316', abbr: '快' },
  weixin: { color: '#22c55e', abbr: '微' },
  alipay: { color: '#1677ff', abbr: '支' },
  web: { color: '#c44a1c', abbr: 'H5' },
  unknown: { color: '#9ca3af', abbr: '?' }
}

const categoryRows = computed(() => {
  const total = Number(stats.value.total || 0)
  const platformGroups = new Map()
  for (const row of stats.value.byCategoryPlatform || []) {
    const category = row.category || 'unknown'
    if (!platformGroups.has(category)) platformGroups.set(category, [])
    platformGroups.get(category).push(row)
  }

  return [...(stats.value.byCategory || [])]
    .filter((item) => Number(item.count || 0) > 0)
    .map((item) => {
      const category = item.category || 'unknown'
      const count = Number(item.count || 0)
      const platforms = buildPlatformRows(platformGroups.get(category) || [], count)
      return {
        category,
        label: categoryLabel(category),
        count,
        pct: total ? Number(((count / total) * 100).toFixed(1)) : 0,
        color: categoryColors[category] || categoryColors.unknown,
        group: h5Keys.includes(category) ? 'h5' : 'miniapp',
        platforms
      }
    })
    .sort((a, b) => b.count - a.count)
})

const rankItems = computed(() => categoryRows.value)
const miniappRows = computed(() => categoryRows.value.filter((item) => item.group === 'miniapp'))
const h5Rows = computed(() => categoryRows.value.filter((item) => item.group === 'h5'))

const maxCategoryCount = computed(() => {
  return Math.max(1, ...categoryRows.value.map((item) => item.count))
})

const categoryTotal = computed(() => categoryRows.value.length)
const platformTotal = computed(() => (stats.value.byPlatform || []).filter((item) => Number(item.count || 0) > 0).length)
const trendTotal = computed(() => (stats.value.newTrend || []).reduce((sum, item) => sum + Number(item.count || 0), 0))
const miniappTotal = computed(() => miniappRows.value.reduce((sum, item) => sum + item.count, 0))
const h5Total = computed(() => h5Rows.value.reduce((sum, item) => sum + item.count, 0))
const lastUpdatedText = computed(() => lastUpdatedAt.value ? relativeTime(lastUpdatedAt.value) : '-')
const isAllCategoriesActive = computed(() => {
  return categoryRows.value.length > 0 && activeCategoryKeys.value.length === categoryRows.value.length
})
const trendSubtitle = computed(() => {
  return trendMode.value === 'category' ? '按分类统计的 30 天趋势' : '最近 30 天每日新增项目走势'
})

watch(categoryRows, (rows) => {
  const keys = rows.map((item) => item.category)
  activeCategoryKeys.value = activeCategoryKeys.value.filter((key) => keys.includes(key))
  if (!activeCategoryKeys.value.length) activeCategoryKeys.value = keys
}, { immediate: true })

watch([stats, trendMode, activeCategoryKeys], () => {
  renderTrendChart()
}, { deep: true })

onMounted(async () => {
  await nextTick()
  echarts = await import('echarts')
  trendChart = echarts.init(trendChartRef.value)
  resizeObserver = new ResizeObserver(() => trendChart?.resize())
  resizeObserver.observe(trendChartRef.value)
  await refreshStats()
  renderTrendChart()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  trendChart?.dispose()
})

async function refreshStats() {
  loadingStats.value = true
  try {
    await loadStats()
    lastUpdatedAt.value = new Date().toISOString()
  } finally {
    loadingStats.value = false
  }
}

function setTrendMode(mode) {
  trendMode.value = mode
  if (mode === 'category' && !activeCategoryKeys.value.length) {
    activeCategoryKeys.value = categoryRows.value.map((item) => item.category)
  }
}

function showAllTrendCategories() {
  activeCategoryKeys.value = categoryRows.value.map((item) => item.category)
}

function selectTrendCategory(category) {
  if (isOnlyCategoryActive(category)) {
    showAllTrendCategories()
    return
  }
  activeCategoryKeys.value = [category]
}

function isOnlyCategoryActive(category) {
  return activeCategoryKeys.value.length === 1 && activeCategoryKeys.value[0] === category
}

function renderTrendChart() {
  if (!trendChart || !echarts) return
  trendChart.setOption(buildTrendOption(), true)
}

function buildTrendOption() {
  const rows = stats.value.newTrend || []
  const days = rows.map((item) => shortDate(item.date))
  const series = trendMode.value === 'category' ? buildCategoryTrendSeries(rows) : [buildTotalTrendSeries(rows)]

  return {
    color: trendMode.value === 'category' ? categoryRows.value.map((item) => item.color) : ['#c44a1c'],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: 'rgba(0,0,0,0.06)',
      borderWidth: 1,
      textStyle: { color: '#1a1a2e', fontSize: 13, fontWeight: 600 },
      padding: [12, 16],
      extraCssText: 'box-shadow: 0 8px 30px rgba(0,0,0,0.08); border-radius: 12px;',
      valueFormatter: (value) => `${value} 个`
    },
    legend: { show: false },
    grid: { top: 16, left: 16, right: 16, bottom: 8, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: days,
      axisLabel: { color: '#cbd5e1', fontWeight: 500, fontSize: 11, interval: 4 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#f1f5f9' } }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: '#cbd5e1', fontWeight: 500, fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    series
  }
}

function buildTotalTrendSeries(rows) {
  return {
    name: '新增总量',
    type: 'line',
    smooth: 0.35,
    symbol: 'none',
    lineStyle: { width: 3, color: '#c44a1c' },
    itemStyle: { color: '#c44a1c' },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(196,74,28,0.14)' },
        { offset: 1, color: 'rgba(196,74,28,0)' }
      ])
    },
    data: rows.map((item) => Number(item.count || 0))
  }
}

function buildCategoryTrendSeries(rows) {
  return categoryRows.value
    .filter((item) => activeCategoryKeys.value.includes(item.category))
    .map((item) => {
      return {
        name: item.label,
        type: 'line',
        smooth: 0.35,
        symbol: 'none',
        lineStyle: { width: 2.5, color: item.color },
        itemStyle: { color: item.color },
        emphasis: { focus: 'series' },
        data: rows.map((row) => Number((row.byCategory && row.byCategory[item.category]) || 0))
      }
    })
}

function buildPlatformRows(rows, categoryCount) {
  const sorted = [...rows]
    .map((row) => ({
      platform: row.platform || 'unknown',
      label: platformLabel(row.platform || 'unknown'),
      count: Number(row.count || 0),
      meta: platformMeta[row.platform || 'unknown'] || platformMeta.unknown
    }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count)
  const max = Math.max(1, ...sorted.map((item) => item.count))
  return sorted.map((row) => ({
    ...row,
    pct: categoryCount ? Math.round((row.count / categoryCount) * 100) : 0,
    width: percent(row.count, max)
  }))
}

function number(value) {
  return Number(value || 0).toLocaleString('zh-CN')
}

function percent(count, total) {
  const base = Number(total || 0)
  if (!base) return '0%'
  return `${Math.max(2, Math.round((Number(count || 0) / base) * 100))}%`
}

function shortDate(value) {
  return value ? value.slice(5).replace('-', '/') : '-'
}

const CategoryCard = defineComponent({
  name: 'CategoryCard',
  props: {
    item: { type: Object, required: true }
  },
  setup(props) {
    return () => [
      h('div', { class: 'cat-card-head' }, [
        h('div', { class: 'cat-name' }, props.item.label),
        h('div', { class: 'cat-count-row' }, [
          h('span', { class: 'cat-count' }, number(props.item.count)),
          h('span', { class: 'cat-unit' }, '个项目'),
          h('span', { class: 'cat-pct' }, `${props.item.pct}%`)
        ])
      ]),
      h('div', { class: 'cat-card-body' }, props.item.platforms.length
        ? props.item.platforms.map((platform) => h('div', { class: 'plat-row', key: platform.platform }, [
          h('div', { class: 'plat-icon', style: { background: platform.meta.color } }, platform.meta.abbr),
          h('div', { class: 'plat-info' }, [
            h('div', { class: 'plat-name-line' }, [
              h('span', platform.label),
              h('span', { class: 'plat-count' }, number(platform.count))
            ]),
            h('div', { class: 'plat-bar-wrap' }, [
              h('div', {
                class: 'plat-bar',
                style: { width: platform.width }
              })
            ])
          ]),
          h('div', { class: 'plat-pct' }, `${platform.pct}%`)
        ]))
        : h('div', { class: 'empty-state compact' }, '暂无平台数据'))
    ]
  }
})
</script>

<style scoped>
.stats-frame {
  background:
    radial-gradient(circle at 86% 8%, rgba(255, 183, 135, 0.38), transparent 30%),
    radial-gradient(circle at 12% 55%, rgba(168, 85, 247, 0.10), transparent 28%),
    radial-gradient(circle at 65% 75%, rgba(16, 185, 129, 0.08), transparent 26%),
    linear-gradient(110deg, #faf6f1 0%, #faf6f1 46%, #fbeee3 100%);
  background-attachment: fixed;
}

.stats-frame :deep(.topbar) {
  background:
    radial-gradient(circle at 86% 220%, rgba(255, 183, 135, 0.22), transparent 42%),
    radial-gradient(circle at 8% 220%, rgba(168, 85, 247, 0.06), transparent 42%),
    linear-gradient(110deg, #faf6f1 0%, #faf6f1 46%, #fbeee3 100%) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.stats-page-header {
  margin-bottom: 16px;
}

.stats-page-header .sync-button {
  background: var(--ink);
}

.stats-page-header .sync-button:hover:not(:disabled) {
  background: #2a2a3e;
  box-shadow: 0 6px 18px rgba(26, 26, 46, 0.22);
}

.bento {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.bento-card,
.echart-panel,
.cat-card {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  overflow: hidden;
}

.bento-card:hover,
.cat-card:hover {
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
}

.hero-card {
  min-height: 168px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px 20px;
  border: 0;
  background: linear-gradient(145deg, #fde0cf 0%, #fbcdae 50%, #f7b78d 100%);
}

.hero-card::before,
.hero-card::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.hero-card::before {
  top: -40%;
  right: -30%;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.45), transparent 70%);
}

.hero-card::after {
  bottom: -30%;
  left: -20%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.18), transparent 70%);
}

.hero-card > * {
  position: relative;
  z-index: 1;
}

.hero-card .label {
  color: rgba(120, 53, 15, 0.7);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.hero-card .number {
  margin: 8px 0 10px;
  color: #9a3412;
  font-size: 42px;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
}

.hero-card .trend {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #b45309;
  font-size: 13px;
  font-weight: 700;
}

.hero-card .meta {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(120, 53, 15, 0.18);
  color: rgba(120, 53, 15, 0.65);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.6;
}

.rank-card {
  display: flex;
  flex-direction: column;
  padding: 20px 22px;
}

.card-head,
.echart-head,
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-head {
  margin-bottom: 16px;
}

.card-head h3,
.echart-head h2,
.section-title h2 {
  margin: 0;
  color: var(--ink);
  font-weight: 700;
}

.card-head h3,
.echart-head h2 {
  font-size: 16px;
}

.card-head span,
.echart-head span,
.section-title .count {
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
}

.rank-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

.rank-item {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) 42px;
  align-items: center;
  gap: 10px;
  min-height: 22px;
  padding: 3px 0;
}

.rank-item .name {
  min-width: 0;
  overflow: hidden;
  color: var(--ink);
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-item .count {
  color: var(--ink);
  font-size: 13px;
  font-weight: 700;
  text-align: right;
}

.bar-track {
  position: relative;
  height: 10px;
  overflow: hidden;
  border-radius: 99px;
  background: rgba(15, 23, 42, 0.05);
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.06);
}

.bar-fill {
  position: relative;
  height: 100%;
  min-width: 6px;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bar-color) 72%, white) 0%,
    var(--bar-color) 100%
  );
  box-shadow:
    0 1px 4px color-mix(in srgb, var(--bar-color) 45%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: width 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.bar-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(255, 255, 255, 0) 55%
  );
  pointer-events: none;
}

.trend-section,
.detail-section {
  margin-bottom: 16px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.echart-panel {
  padding: 18px;
}

.echart-head {
  align-items: flex-start;
  margin-bottom: 8px;
}

.echart-head h2 {
  font-size: 17px;
}

.echart-head span {
  display: block;
  margin-top: 5px;
}

.trend-toggle {
  display: flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
}

.trend-toggle button {
  height: 28px;
  padding: 0 14px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--faint);
  font-size: 12px;
  font-weight: 700;
  transition: all 0.12s ease;
}

.trend-toggle button:hover {
  color: var(--muted);
}

.trend-toggle button.on {
  background: var(--ink);
  color: #fff;
}

.trend-chart-box {
  width: 100%;
  height: 340px;
}

.trend-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 0;
  margin-top: 4px;
  padding-top: 0;
  overflow: hidden;
  border-top: 1px solid transparent;
  opacity: 0;
  transition: all 0.3s ease;
}

.trend-legend.show {
  max-height: 120px;
  padding-top: 12px;
  border-top-color: var(--border);
  opacity: 1;
}

.legend-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 27px;
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 99px;
  background: var(--bg);
  color: var(--ink);
  font-size: 11px;
  font-weight: 700;
  transition: all 0.15s ease;
}

.legend-pill:hover {
  border-color: rgba(26, 26, 46, 0.22);
  transform: translateY(-1px);
}

.legend-pill.selected {
  border-color: rgba(26, 26, 46, 0.18);
  background: #1a1a2e;
  color: #fff;
  box-shadow: 0 8px 20px rgba(26, 26, 46, 0.12);
}

.legend-all {
  padding-inline: 12px;
}

.legend-pill.inactive {
  opacity: 0.35;
}

.legend-pill .dot,
.section-title .dot {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border-radius: 50%;
}

.section-title {
  justify-content: flex-start;
  margin-bottom: 14px;
}

.section-title h2 {
  font-size: 15px;
}

.section-title .count {
  margin-left: auto;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.cat-card {
  position: relative;
  padding: 0;
  opacity: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.cat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.cat-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 4px;
  background: var(--cat-color, var(--accent));
}

:deep(.cat-card-head) {
  padding: 18px 18px 12px;
  border-bottom: 1px solid var(--border);
}

:deep(.cat-name) {
  margin-bottom: 4px;
  color: var(--ink);
  font-size: 14px;
  font-weight: 700;
}

:deep(.cat-count-row) {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

:deep(.cat-count) {
  color: var(--ink);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
}

:deep(.cat-unit) {
  color: var(--faint);
  font-size: 12px;
  font-weight: 500;
}

:deep(.cat-pct) {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--bg);
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

:deep(.cat-card-body) {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 18px 14px;
}

:deep(.plat-row) {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 38px;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
}

:deep(.plat-icon) {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
}

:deep(.plat-info) {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

:deep(.plat-name-line) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--ink);
  font-size: 12px;
  font-weight: 600;
}

:deep(.plat-count) {
  color: var(--ink);
  font-weight: 700;
}

:deep(.plat-bar-wrap) {
  height: 4px;
  overflow: hidden;
  border-radius: 99px;
  background: rgba(15, 23, 42, 0.05);
}

:deep(.plat-bar) {
  height: 100%;
  min-width: 2px;
  border-radius: inherit;
  background: color-mix(in srgb, var(--cat-color, var(--accent)) 55%, transparent);
  transition: width 0.5s ease;
}

:deep(.plat-pct) {
  color: var(--faint);
  font-size: 11px;
  font-weight: 600;
  text-align: right;
}

.empty-state {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
}

.empty-state.compact {
  min-height: 44px;
}

.panel-empty {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: #fff;
}

.stats-page-header,
.bento,
.trend-section,
.detail-section {
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.stats-page-header { animation-delay: 0s; }
.bento { animation-delay: 0.04s; }
.trend-section { animation-delay: 0.08s; }
.detail-section { animation-delay: 0.12s; }

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .bento {
    grid-template-columns: 1fr;
  }

  .hero-card {
    min-height: 160px;
  }

  .cat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stats-frame :deep(.topbar-inner) {
    padding: 0 24px;
  }
}

@media (max-width: 640px) {
  .cat-grid {
    grid-template-columns: 1fr;
  }

  .stats-page-header,
  .echart-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .trend-toggle {
    width: 100%;
  }

  .trend-toggle button {
    flex: 1;
  }

  .stats-frame :deep(.topbar-inner) {
    padding: 0 16px;
  }
}
</style>
