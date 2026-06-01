<template>
  <div class="sc-card" :style="cardStyle">
    <!-- 顶栏：胶囊 + 标题 -->
    <div class="sc-header">
      <div class="sc-dots"><span></span><span></span><span></span></div>
      <span class="sc-title">{{ card.title }}</span>
      <span class="sc-close">·</span>
    </div>

    <!-- 主体 -->
    <div class="sc-body" :style="bodyStyle">
      <!-- 影视：大封面 + 列表 -->
      <template v-if="card.type === 'video'">
        <div class="block big">🎬</div>
        <div class="bar w80"></div>
        <div class="bar w60"></div>
        <div class="row-block"></div>
        <div class="row-block"></div>
        <div class="row-block"></div>
      </template>

      <!-- 短剧 2x2 ▶️ -->
      <template v-else-if="card.type === 'drama'">
        <div class="grid grid-2">
          <div class="cell">▶️</div>
          <div class="cell">▶️</div>
          <div class="cell">▶️</div>
          <div class="cell">▶️</div>
        </div>
      </template>

      <!-- 小说书架：图书行 -->
      <template v-else-if="card.type === 'novel'">
        <div v-for="i in 5" :key="i" class="book-row">
          <div class="book-cover"></div>
          <div class="book-meta">
            <div class="bar w70"></div>
            <div class="bar w40 thin"></div>
          </div>
        </div>
      </template>

      <!-- 漫剧大图 + 标题 -->
      <template v-else-if="card.type === 'comic'">
        <div class="block big-55">🎭</div>
        <div class="bar w75"></div>
        <div class="bar w50"></div>
        <div class="row-block sm"></div>
      </template>

      <!-- H5 互动：banner + 网格 -->
      <template v-else-if="card.type === 'h5'">
        <div class="banner">Banner</div>
        <div class="grid grid-3">
          <div v-for="i in 6" :key="i" class="cell-sm"></div>
        </div>
        <div class="row-block sm"></div>
        <div class="row-block sm"></div>
      </template>

      <!-- 影视宫格 -->
      <template v-else-if="card.type === 'video-grid'">
        <div class="grid grid-2 cards">
          <div v-for="i in 6" :key="i" class="grid-card">
            <div class="dot"></div>
            <div class="bar w70"></div>
          </div>
        </div>
      </template>

      <!-- 排行榜 -->
      <template v-else-if="card.type === 'rank'">
        <div v-for="(item, i) in 5" :key="i" class="rank-row">
          <div class="rank-no" :class="rankClass(i)">{{ i + 1 }}</div>
          <div class="bar flex-grow"></div>
        </div>
      </template>

      <!-- 阅读器：纯文字行 -->
      <template v-else-if="card.type === 'reader'">
        <div class="reader">
          <div v-for="(w, i) in [100, 95, 98, 90, 100, 85, 100, 92]" :key="i"
               class="bar reader-line" :style="{ width: `${w}%` }"></div>
        </div>
      </template>

      <!-- 漫剧宫格 -->
      <template v-else-if="card.type === 'comic-grid'">
        <div class="comic-banner"></div>
        <div class="grid grid-3 thumbs">
          <div v-for="i in 3" :key="i" class="thumb"></div>
        </div>
        <div class="bar w80"></div>
        <div class="bar w60"></div>
        <div class="row-block sm"></div>
        <div class="row-block sm"></div>
      </template>

      <!-- H5 商品宫格 -->
      <template v-else-if="card.type === 'h5-grid'">
        <div class="grid grid-2 cards">
          <div v-for="i in 4" :key="i" class="grid-card">
            <div class="thumb-sq"></div>
            <div class="bar w80 thin"></div>
            <div class="bar w40 thin"></div>
          </div>
        </div>
      </template>

      <!-- 搜索页 -->
      <template v-else-if="card.type === 'search'">
        <div class="search-bar"><span>🔍</span></div>
        <div class="row-block"></div>
        <div class="row-block"></div>
        <div class="row-block"></div>
        <div class="row-block"></div>
      </template>

      <!-- 小说宫格 -->
      <template v-else-if="card.type === 'novel-grid'">
        <div class="grid grid-3 thumbs">
          <div v-for="i in 3" :key="i" class="thumb"></div>
        </div>
        <div class="bar w75"></div>
        <div class="bar w50"></div>
        <div class="row-block sm"></div>
        <div class="row-block sm"></div>
      </template>
    </div>

    <!-- 底栏 -->
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
import { computed } from 'vue'

const props = defineProps({
  card: { type: Object, required: true }
})

// 不同类型卡片的高宽比（对应原型 aspect-ratio）
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

const cardStyle = computed(() => ({
  aspectRatio: aspectMap[props.card.type] || '3/4'
}))

const bodyStyle = computed(() => ({
  background: `linear-gradient(to bottom, ${props.card.from}, ${props.card.to})`
}))

// 默认第 1 个 tab 高亮，部分卡用第 2 个
const activeTabIndex = computed(() => {
  if (props.card.type === 'reader' || props.card.type === 'search' || props.card.type === 'novel-grid') return 1
  return 0
})

function rankClass(i) {
  return ['rank-1', 'rank-2', 'rank-3', '', ''][i] || ''
}

// 用 emoji 替代 fontawesome；保持极简
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
