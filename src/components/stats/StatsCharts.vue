<template>
  <section class="echart-grid" aria-label="统计图表">
    <!-- 分类占比：H5 合并，非 H5 保留 -->
    <div class="echart-panel">
      <div class="echart-head">
        <div>
          <h2>分类占比</h2>
          <span>小程序 vs H5 的项目分布</span>
        </div>
        <strong>{{ number(stats.total) }}</strong>
      </div>
      <div ref="categoryChartRef" class="echart-box"></div>
    </div>

    <!-- H5 细分占比 -->
    <div class="echart-panel">
      <div class="echart-head">
        <div>
          <h2>H5 细分占比</h2>
          <span>H5 各子类项目分布</span>
        </div>
        <strong>{{ number(h5Total) }}</strong>
      </div>
      <div ref="h5ChartRef" class="echart-box"></div>
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
const h5ChartRef = ref(null)
const categoryPlatformChartRef = ref(null)
const trendChartRef = ref(null)

let categoryChart = null
let h5Chart = null
let categoryPlatformChart = null
let trendChart = null
let resizeObserver = null
let echarts = null

const palette = ['#c44a1c', '#3157d5', '#2f8f58', '#7c3aed', '#d18b1f', '#be3455', '#0f766e', '#64748b']
const h5Palette = ['#f59e0b', '#ef4444', '#8b5cf6', '#10b981']

const h5Keys = ['h5_novel', 'h5_yingshi', 'h5_fenxiao', 'h5_laxin']

const trendTotal = computed(() => (props.stats.newTrend || []).reduce((sum, item) => sum + Number(item.count || 0), 0))

const h5Total = computed(() => {
  return (props.stats.byCategory || [])
    .filter((item) => h5Keys.includes(item.category))
    .reduce((sum, item) => sum + Number(item.count || 0), 0)
})

watch(() => props.stats, renderCharts, { deep: true })

onMounted(async () => {
  await nextTick()
  echarts = await import('echarts')
  categoryChart = echarts.init(categoryChartRef.value)
  h5Chart = echarts.init(h5ChartRef.value)
  categoryPlatformChart = echarts.init(categoryPlatformChartRef.value)
  trendChart = echarts.init(trendChartRef.value)
  resizeObserver = new ResizeObserver(resizeCharts)
  ;[categoryChartRef, h5ChartRef, categoryPlatformChartRef, trendChartRef].forEach((chartRef) => {
    resizeObserver.observe(chartRef.value)
  })
  renderCharts()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  ;[categoryChart, h5Chart, categoryPlatformChart, trendChart].forEach((chart) => chart?.dispose())
})

function renderCharts() {
  if (!categoryChart) return

  // 分类占比：非 H5 保留原名，H5 四个子类合并为 "H5"
  const categoryData = []
  let h5Sum = 0
  for (const item of props.stats.byCategory || []) {
    if (h5Keys.includes(item.category)) {
      h5Sum += Number(item.count || 0)
    } else {
      categoryData.push({ name: categoryLabel(item.category), value: item.count })
    }
  }
  if (h5Sum > 0) {
    categoryData.push({ name: 'H5', value: h5Sum })
  }
  categoryChart.setOption(buildPieOption(categoryData, 'category'), true)

  // H5 细分占比
  const h5Data = (props.stats.byCategory || [])
    .filter((item) => h5Keys.includes(item.category))
    .map((item) => ({ name: categoryLabel(item.category), value: item.count }))
  h5Chart.setOption(buildH5PieOption(h5Data), true)

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
      textStyle: { color: '#626273', fontWeight: 600 }
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
          fontWeight: 600
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

function buildH5PieOption(data) {
  const sorted = data.filter((item) => Number(item.value || 0) > 0).sort((a, b) => b.value - a.value)
  return {
    color: h5Palette,
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
      textStyle: { color: '#626273', fontWeight: 600 }
    },
    series: [
      {
        name: 'h5',
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
          fontWeight: 600
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
      textStyle: { color: '#626273', fontWeight: 600 }
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
      axisLabel: { formatter: '{value}%', color: '#8b8b9e', fontWeight: 600 },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } }
    },
    yAxis: {
      type: 'category',
      data: categories.map(categoryLabel),
      axisLabel: { color: '#1a1a2e', fontWeight: 600 },
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
      axisLabel: { color: '#8b8b9e', fontWeight: 600 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: '#8b8b9e', fontWeight: 600 },
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
  ;[categoryChart, h5Chart, categoryPlatformChart, trendChart].forEach((chart) => chart?.resize())
}

function number(value) {
  return Number(value || 0).toLocaleString('zh-CN')
}

function shortDate(value) {
  return value ? value.slice(5) : '-'
}
</script>
