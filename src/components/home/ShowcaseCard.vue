<template>
  <div class="sc-card" :style="cardStyle">
    <div class="sc-header">
      <div class="sc-dots"><span></span><span></span><span></span></div>
      <span class="sc-title">{{ card.title }}</span>
      <span class="sc-close">·</span>
    </div>

    <div class="sc-body" :style="bodyStyle">
      <component
        :is="part.component"
        v-for="(part, index) in layout"
        :key="index"
        v-bind="part.props"
      />
    </div>

    <div class="sc-tabbar">
      <div
        v-for="(t, i) in card.tabs"
        :key="i"
        class="sc-tab"
        :class="{ active: i === activeTabIndex }"
      >
        <span class="tab-icon">{{ tabIcon(t.icon) }}</span>
        <span>{{ t.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, h } from 'vue'

const props = defineProps({
  card: { type: Object, required: true }
})

const aspectMap = {
  video: '9/16',
  drama: '3/4',
  novel: '9/16',
  comic: '3/4',
  h5: '9/16',
  'video-grid': '3/4',
  rank: '2/3',
  reader: '3/4',
  'comic-grid': '9/16',
  'h5-grid': '3/4',
  search: '2/3',
  'novel-grid': '2/3'
}

const RowBlocks = defineComponent({
  props: {
    count: { type: Number, default: 1 },
    small: { type: Boolean, default: false }
  },
  setup(props) {
    return () => Array.from({ length: props.count }, (_, i) =>
      h('div', { class: ['row-block', { sm: props.small }], key: i })
    )
  }
})

const Bars = defineComponent({
  props: {
    widths: { type: Array, default: () => [] },
    reader: { type: Boolean, default: false }
  },
  setup(props) {
    return () => props.widths.map((width, i) =>
      h('div', {
        class: ['bar', props.reader && 'reader-line', typeof width === 'string' && width],
        style: typeof width === 'number' ? { width: `${width}%` } : null,
        key: i
      })
    )
  }
})

const Block = defineComponent({
  props: {
    size: { type: String, default: 'big' },
    icon: { type: String, default: '' }
  },
  setup(props) {
    return () => h('div', { class: ['block', props.size] }, props.icon)
  }
})

const Grid = defineComponent({
  props: {
    columns: { type: Number, default: 2 },
    count: { type: Number, default: 4 },
    itemClass: { type: String, default: 'cell' },
    card: { type: String, default: '' },
    product: { type: Boolean, default: false },
    icon: { type: String, default: '' }
  },
  setup(props) {
    return () => h('div', { class: ['grid', `grid-${props.columns}`, props.card] },
      Array.from({ length: props.count }, (_, i) => {
        const children = props.itemClass === 'grid-card'
          ? [
              h('div', { class: props.product ? 'thumb-sq' : 'dot' }),
              h('div', { class: ['bar', props.product ? 'w80 thin' : 'w70'] }),
              props.product ? h('div', { class: 'bar w40 thin' }) : null
            ]
          : props.icon
        return h('div', { class: props.itemClass, key: i }, children)
      })
    )
  }
})

const BookList = defineComponent({
  props: {
    count: { type: Number, default: 5 }
  },
  setup(props) {
    return () => Array.from({ length: props.count }, (_, i) =>
      h('div', { class: 'book-row', key: i }, [
        h('div', { class: 'book-cover' }),
        h('div', { class: 'book-meta' }, [
          h('div', { class: 'bar w70' }),
          h('div', { class: 'bar w40 thin' })
        ])
      ])
    )
  }
})

const RankList = defineComponent({
  setup() {
    return () => Array.from({ length: 5 }, (_, i) =>
      h('div', { class: 'rank-row', key: i }, [
        h('div', { class: ['rank-no', rankClass(i)] }, i + 1),
        h('div', { class: 'bar flex-grow' })
      ])
    )
  }
})

const Reader = defineComponent({
  setup() {
    return () => h('div', { class: 'reader' },
      h(Bars, { widths: [100, 95, 98, 90, 100, 85, 100, 92], reader: true })
    )
  }
})

const Banner = defineComponent({
  props: {
    label: { type: String, default: '' },
    compact: { type: Boolean, default: false }
  },
  setup(props) {
    return () => h('div', { class: props.compact ? 'comic-banner' : 'banner' }, props.label)
  }
})

const SearchBar = defineComponent({
  setup() {
    return () => h('div', { class: 'search-bar' }, h('span', '🔍'))
  }
})

const layoutMap = {
  video: [[Block, { icon: '🎬' }], [Bars, { widths: ['w80', 'w60'] }], [RowBlocks, { count: 3 }]],
  drama: [[Grid, { columns: 2, count: 4, icon: '▶️' }]],
  novel: [[BookList]],
  comic: [[Block, { icon: '🎭', size: 'big-55' }], [Bars, { widths: ['w75', 'w50'] }], [RowBlocks, { small: true }]],
  h5: [[Banner, { label: 'Banner' }], [Grid, { columns: 3, count: 6, itemClass: 'cell-sm' }], [RowBlocks, { count: 2, small: true }]],
  'video-grid': [[Grid, { columns: 2, count: 6, itemClass: 'grid-card', card: 'cards' }]],
  rank: [[RankList]],
  reader: [[Reader]],
  'comic-grid': [[Banner, { compact: true }], [Grid, { columns: 3, count: 3, itemClass: 'thumb', card: 'thumbs' }], [Bars, { widths: ['w80', 'w60'] }], [RowBlocks, { count: 2, small: true }]],
  'h5-grid': [[Grid, { columns: 2, count: 4, itemClass: 'grid-card', card: 'cards', product: true }]],
  search: [[SearchBar], [RowBlocks, { count: 4 }]],
  'novel-grid': [[Grid, { columns: 3, count: 3, itemClass: 'thumb', card: 'thumbs' }], [Bars, { widths: ['w75', 'w50'] }], [RowBlocks, { count: 2, small: true }]]
}

const cardStyle = computed(() => ({
  aspectRatio: aspectMap[props.card.type] || '3/4'
}))

const bodyStyle = computed(() => ({
  background: `linear-gradient(to bottom, ${props.card.from}, ${props.card.to})`
}))

const layout = computed(() => (layoutMap[props.card.type] || []).map(([component, props = {}]) => ({ component, props })))

const activeTabIndex = computed(() => {
  if (props.card.type === 'reader' || props.card.type === 'search' || props.card.type === 'novel-grid') return 1
  return 0
})

function rankClass(i) {
  return ['rank-1', 'rank-2', 'rank-3', '', ''][i] || ''
}

const ICONS = {
  home: '🏠',
  compass: '🧭',
  user: '👤',
  fire: '🔥',
  book: '📚',
  open: '📖',
  heart: '❤️',
  gift: '🎁',
  layers: '📂',
  clock: '🕐',
  back: '←',
  font: '📑',
  gear: '⚙️',
  cart: '🛒',
  search: '🔍',
  store: '🏪'
}
function tabIcon(name) {
  return ICONS[name] || '·'
}
</script>

<style scoped>
.sc-card {
  flex-shrink: 0;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
}
.sc-card:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.sc-header {
  height: 34px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: #fff;
  position: relative;
}
.sc-dots { display: flex; gap: 2.5px; }
.sc-dots span {
  width: 4.5px;
  height: 4.5px;
  border-radius: 50%;
  background: #1a1a2e;
}
.sc-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 600;
  color: #1a1a2e;
}
.sc-close {
  font-size: 10px;
  color: #8b8b9e;
}

.sc-body {
  flex: 1;
  padding: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sc-tabbar {
  flex-shrink: 0;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}
.sc-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  font-size: 7px;
  color: #b4b4c7;
}
.sc-tab .tab-icon { font-size: 11px; }
.sc-tab.active { color: #1a1a2e; }

/* ========== 主体复用样式 ========== */
.bar {
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.32);
}
.bar.thin { height: 6px; }
.bar.w40 { width: 40%; }
.bar.w50 { width: 50%; }
.bar.w60 { width: 60%; }
.bar.w70 { width: 70%; }
.bar.w75 { width: 75%; }
.bar.w80 { width: 80%; }
.bar.flex-grow { flex: 1; }

.block {
  width: 100%;
  background: rgba(255, 255, 255, 0.28);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.block.big { height: 45%; margin-bottom: 6px; }
.block.big-55 { height: 55%; margin-bottom: 6px; }

.row-block {
  height: 32px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.25);
}
.row-block.sm { height: 24px; }

.grid {
  display: grid;
  gap: 6px;
}
.grid.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid.cards { gap: 8px; }

.cell {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.cell-sm {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  aspect-ratio: 1;
}

.banner {
  height: 35%;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.65);
  font-size: 11px;
}

/* 小说书架 */
.book-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.book-cover {
  width: 28px;
  height: 36px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.32);
  border-radius: 4px;
}
.book-meta { flex: 1; display: flex; flex-direction: column; gap: 4px; }

/* 影视宫格 / H5 商品 */
.grid-card {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.32);
}
.thumb-sq {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.32);
}

/* 排行榜 */
.rank-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rank-no {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 800;
  color: #fff;
  background: rgba(255, 255, 255, 0.3);
  color: #64748b;
}
.rank-no.rank-1 { background: #ff6b6b; color: #fff; }
.rank-no.rank-2 { background: #f59e0b; color: #fff; }
.rank-no.rank-3 { background: #10b981; color: #fff; }

/* 阅读器 */
.reader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  height: 100%;
}
.reader-line { height: 8px; background: rgba(22, 101, 52, 0.1); }

/* 漫剧/小说宫格 */
.comic-banner {
  height: 30%;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.25);
}
.thumb {
  aspect-ratio: 3/4;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 8px;
}

/* 搜索页 */
.search-bar {
  height: 28px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.32);
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 10px;
  color: rgba(161, 98, 7, 0.55);
}
</style>
