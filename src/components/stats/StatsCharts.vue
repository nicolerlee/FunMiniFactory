<template>
  <section class="echart-grid" aria-label="统计图表">
    <div class="echart-panel">
      <div class="echart-head">
        <div>
          <h2>分类占比</h2>
          <span>不同 category 的项目占比</span>
        </div>
        <strong>{{ number(stats.total) }}</strong>
      </div>
      <div ref="categoryChartRef" class="echart-box"></div>
    </div>

    <div class="echart-panel">
      <div class="echart-head">
        <div>
          <h2>平台占比</h2>
          <span>不同 platform 的项目占比</span>
        </div>
        <strong>{{ number(stats.total) }}</strong>
      </div>
      <div ref="platformChartRef" class="echart-box"></div>
    </div>

    <div class="echart-panel wide">
      <div class="echart-head">
        <div>
          <h2>分类内平台占比</h2>
          <span>同一个 category 下，不同 platform 的结构</span>
        </div>
      </div>
      <div ref="categoryPlatformChartRef" class="echart-box large"></div>
    </div>

    <div class="echart-panel wide">
      <div class="echart-head">
        <div>
          <h2>最近新增趋势</h2>
          <span>最近 30 天新增小程序数量</span>
        </div>
        <strong>{{ number(trendTotal) }}</strong>
      </div>
      <div ref="trendChartRef" class="echart-box large"></div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { categoryLabel, platformLabel } from '@/utils/format'

const props = defineProps({
  stats: { type: Object, required: true }
})

const categoryChartRef = ref(null)
const platformChartRef = ref(null)
const categoryPlatformChartRef = ref(null)
const trendChartRef = ref(null)

let categoryChart = null
let platformChart = null
let categoryPlatformChart = null
let trendChart = null
let resizeObserver = null
let echarts = null

const palette = ['#c44a1c', '#3157d5', '#2f8f58', '#7c3aed', '#d18b1f', '#be3455', '#0f766e', '#64748b']
const trendTotal = computed(() => (props.stats.newTrend || []).reduce((sum, item) => sum + Number(item.count || 0), 0))

watch(() => props.stats, renderCharts, { deep: true })

onMounted(async () => {
  await nextTick()
  echarts = await import('echarts')
  categoryChart = echarts.init(categoryChartRef.value)
  platformChart = echarts.init(platformChartRef.value)
  categoryPlatformChart = echarts.init(categoryPlatformChartRef.value)
  trendChart = echarts.init(trendChartRef.value)
  resizeObserver = new ResizeObserver(resizeCharts)
  ;[categoryChartRef, platformChartRef, categoryPlatformChartRef, trendChartRef].forEach((chartRef) => {
    resizeObserver.observe(chartRef.value)
  })
  renderCharts()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  ;[categoryChart, platformChart, categoryPlatformChart, trendChart].forEach((chart) => chart?.dispose())
})

function renderCharts() {
  if (!categoryChart) return
  categoryChart.setOption(buildPieOption(
    (props.stats.byCategory || []).map((item) => ({ name: categoryLabel(item.category), value: item.count })),
    'category'
  ), true)
  platformChart.setOption(buildPieOption(
    (props.stats.byPlatform || []).map((item) => ({ name: platformLabel(item.platform), value: item.count })),
    'platform'
  ), true)
  categoryPlatformChart.setOption(buildStackOption(), true)
  trendChart.setOption(buildTrendOption(), true)
}

function buildPieOption(data, seriesName) {
  const sorted = data.filter((item) => Number(item.value || 0) > 0).sort((a, b) => b.value - a.value)
  return {
    color: palette,
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>{c} 个 ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 'middle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#626273', fontWeight: 700 }
    },
    series: [
      {
        name: seriesName,
        type: 'pie',
        radius: ['46%', '72%'],
        center: ['35%', '52%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 3,
          borderRadius: 6
        },
        label: {
          formatter: '{b}\n{d}%',
          color: '#1a1a2e',
          fontWeight: 800
        },
        labelLine: {
          length: 12,
          length2: 8
        },
        data: sorted
      }
    ]
  }
}

function buildStackOption() {
  const rows = props.stats.byCategoryPlatform || []
  const categories = [...new Set(rows.map((item) => item.category || 'unknown'))]
    .sort((a, b) => categoryTotal(b) - categoryTotal(a))
  const platforms = [...new Set(rows.map((item) => item.platform || 'unknown'))]
  const rowMap = new Map(rows.map((item) => [`${item.category || 'unknown'}:${item.platform || 'unknown'}`, Number(item.count || 0)]))

  return {
    color: palette,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: (value) => `${value}%`
    },
    legend: {
      top: 0,
      textStyle: { color: '#626273', fontWeight: 700 }
    },
    grid: {
      top: 42,
      left: 70,
      right: 24,
      bottom: 28
    },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: { formatter: '{value}%', color: '#8b8b9e', fontWeight: 700 },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } }
    },
    yAxis: {
      type: 'category',
      data: categories.map(categoryLabel),
      axisLabel: { color: '#1a1a2e', fontWeight: 800 },
      axisTick: { show: false },
      axisLine: { show: false }
    },
    series: platforms.map((platform) => ({
      name: platformLabel(platform),
      type: 'bar',
      stack: 'total',
      barWidth: 18,
      emphasis: { focus: 'series' },
      data: categories.map((category) => {
        const total = categoryTotal(category)
        const count = rowMap.get(`${category}:${platform}`) || 0
        return total ? Number(((count / total) * 100).toFixed(1)) : 0
      })
    }))
  }
}

function buildTrendOption() {
  const rows = props.stats.newTrend || []
  return {
    color: ['#c44a1c'],
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => `${value} 个`
    },
    grid: {
      top: 24,
      left: 48,
      right: 24,
      bottom: 42
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: rows.map((item) => shortDate(item.date)),
      axisLabel: { color: '#8b8b9e', fontWeight: 700 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: '#8b8b9e', fontWeight: 700 },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } }
    },
    series: [
      {
        name: '新增小程序',
        type: 'line',
        smooth: true,
        symbolSize: 7,
        lineStyle: { width: 4 },
        areaStyle: { opacity: 0.14 },
        data: rows.map((item) => Number(item.count || 0))
      }
    ]
  }
}

function categoryTotal(category) {
  return (props.stats.byCategoryPlatform || [])
    .filter((item) => (item.category || 'unknown') === category)
    .reduce((sum, item) => sum + Number(item.count || 0), 0)
}

function resizeCharts() {
  ;[categoryChart, platformChart, categoryPlatformChart, trendChart].forEach((chart) => chart?.resize())
}

function number(value) {
  return Number(value || 0).toLocaleString('zh-CN')
}

function shortDate(value) {
  return value ? value.slice(5) : '-'
}
</script>
