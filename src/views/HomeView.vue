<template>
  <div class="home-page">
    <!-- 顶部导航 -->
    <AppTopbar />

    <!-- ========== HERO ========== -->
    <section class="hero">
      <!-- 装饰背景球 -->
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>

      <div class="hero-grid">
        <!-- 左侧文字 -->
        <div class="hero-text">
          <h1 class="hero-title animate-slide-up delay-1">
            一站式<br />
            <span class="hero-title-gradient">小程序与 H5</span><br />
            工厂管理中心
          </h1>
          <p class="hero-desc animate-slide-up delay-2">
            聚合影视、短剧、漫剧、小说、H5 等全部项目。<br />
            一个入口，管理所有。
          </p>
          <div class="hero-cta animate-slide-up delay-3">
            <RouterLink to="/factory" class="cta-btn">
              查看全部项目
              <ArrowRight :size="16" :stroke-width="2.5" />
            </RouterLink>
            <span class="hero-cta-hint">或按类型浏览 ↓</span>
          </div>
        </div>

        <!-- 右侧图标墙 -->
        <div class="hero-cloud animate-slide-right delay-3">
          <!-- 中心标 -->
          <div class="cloud-core">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
              <rect x="2" y="3" width="20" height="14" rx="3" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>

          <!-- 平台 logo 自由浮动 -->
          <div class="cloud-icon float-1" style="top: 12%; left: 10%;">
            <img src="/icons/platform/douyin_logo.png" alt="抖音" />
          </div>
          <div class="cloud-icon float-2" style="top: 4%; right: 18%;">
            <img src="/icons/platform/weixin_logo.png" alt="微信" />
          </div>
          <div class="cloud-icon float-3" style="bottom: 22%; left: 6%;">
            <img src="/icons/platform/kuaishou_logo.png" alt="快手" />
          </div>
          <div class="cloud-icon float-4" style="top: 32%; left: 28%;">
            <img src="/icons/platform/baidu_logo.png" alt="百度" />
          </div>
          <div class="cloud-icon float-5" style="bottom: 12%; right: 22%;">
            <img src="/icons/platform/xiaohongshu_logo.png" alt="小红书" />
          </div>
          <div class="cloud-icon float-1" style="top: 32%; right: 8%;">
            <img src="/icons/platform/zhifubao_logo.png" alt="支付宝" />
          </div>

          <!-- 品类 emoji -->
          <div class="cloud-emoji float-3" style="top: 2%; left: 50%; transform: translateX(-50%); background: #ffe4e6;">🎬</div>
          <div class="cloud-emoji float-2" style="bottom: 18%; right: 6%; background: #dbeafe;">🎬</div>
          <div class="cloud-emoji float-4" style="top: 60%; left: 14%; background: #f3e8ff;">🎭</div>
          <div class="cloud-emoji float-5" style="bottom: 4%; left: 30%; background: #d1fae5;">📖</div>
          <div class="cloud-emoji float-1" style="top: 48%; right: 24%; background: #fef3c7;">🖥️</div>
        </div>
      </div>

      <div class="hero-scroll-hint">
        <ChevronDown :size="18" :stroke-width="2" />
      </div>
    </section>

    <!-- ========== 平台覆盖 ========== -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-eyebrow">Platforms</span>
          <h2 class="section-title">覆盖主流平台</h2>
          <p class="section-desc">打通微信、抖音、快手，全面触达用户</p>
        </div>
        <div class="platform-grid reveal">
          <div v-for="p in platforms" :key="p.label" class="platform-card">
            <div class="platform-card-img">
              <img :src="p.img" :alt="p.label" />
            </div>
            <h3>{{ p.label }}</h3>
            <p>{{ p.en }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 品类覆盖 ========== -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-eyebrow">Categories</span>
          <h2 class="section-title">五大业务品类</h2>
          <p class="section-desc">影视、短剧、漫剧、小说、H5，全链路覆盖</p>
        </div>
        <div class="cat-grid reveal">
          <div v-for="c in categories" :key="c.key" class="cat-card" :class="`cat-${c.key}`">
            <div class="cat-icon" :style="{ background: c.bg }">{{ c.emoji }}</div>
            <h3>{{ c.label }}</h3>
            <p>{{ c.en }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 项目展示墙 ========== -->
    <section class="section showcase-section">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-eyebrow">Showcase</span>
          <h2 class="section-title">丰富的小程序生态</h2>
          <p class="section-desc">影视、短剧、小说、H5，覆盖多种内容形态</p>
        </div>

        <div class="showcase-wall reveal">
          <div
            v-for="(col, idx) in showcaseColumns"
            :key="idx"
            class="showcase-col"
          >
            <div
              class="showcase-col-track"
              :class="col.direction === 'up' ? 'scroll-up' : 'scroll-down'"
              :style="{ '--speed': col.speed }"
            >
              <!-- 复制 2 份做无缝滚动 -->
              <ShowcaseCard
                v-for="(card, i) in [...col.cards, ...col.cards]"
                :key="`${idx}-${i}`"
                :card="card"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== CTA ========== -->
    <section class="section cta-section">
      <div class="cta-container reveal">
        <h2>准备好管理你的项目了吗？</h2>
        <p>一键进入任意项目后台，高效管理所有小程序与 H5</p>
        <RouterLink to="/factory" class="cta-btn cta-btn-large">
          查看所有项目
          <ArrowRight :size="18" :stroke-width="2.5" />
        </RouterLink>
      </div>
    </section>

    <!-- ========== Footer ========== -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-brand-mark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
              <rect x="2" y="3" width="20" height="14" rx="3" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </span>
          <span class="footer-brand-text">FunMini Factory</span>
        </div>
        <span class="footer-copy">© 2026 FunMini. All rights reserved.</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, ChevronDown } from 'lucide-vue-next'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import ShowcaseCard from '@/components/home/ShowcaseCard.vue'

const platforms = [
  { label: '微信小程序', en: 'WeChat Mini Program', img: '/icons/platform/weixin_logo.png' },
  { label: '抖音小程序', en: 'Douyin Mini App', img: '/icons/platform/douyin_logo.png' },
  { label: '快手小程序', en: 'Kuaishou Mini App', img: '/icons/platform/kuaishou_logo.png' },
  { label: '百度小程序', en: 'Baidu Smart Program', img: '/icons/platform/baidu_logo.png' },
  { label: '支付宝', en: 'Alipay Mini Program', img: '/icons/platform/zhifubao_logo.png' }
]

const categories = [
  { key: 'video', label: '影视', en: 'Video Mini App', emoji: '🎬', bg: '#ffe4e6' },
  { key: 'drama', label: '短剧', en: 'Drama Mini App', emoji: '🎬', bg: '#dbeafe' },
  { key: 'comic', label: '漫剧', en: 'Comic Mini App', emoji: '🎭', bg: '#f3e8ff' },
  { key: 'novel', label: '小说', en: 'Novel Mini App', emoji: '📖', bg: '#d1fae5' },
  { key: 'h5', label: 'H5', en: 'H5 Web Project', emoji: '🖥️', bg: '#fef3c7' }
]

// 展示墙 4 列：交替方向，不同速度，避免节奏一致
const showcaseColumns = [
  {
    direction: 'up',
    speed: '40s',
    cards: [
      { type: 'video', title: '奇趣影视', from: '#ffecd2', to: '#fcb69f', tabs: [{ icon: 'home', label: '首页' }, { icon: 'compass', label: '发现' }, { icon: 'user', label: '我的' }] },
      { type: 'drama', title: '精彩短剧', from: '#e0c3fc', to: '#8ec5fc', tabs: [{ icon: 'home', label: '首页' }, { icon: 'fire', label: '热榜' }, { icon: 'user', label: '我的' }] },
      { type: 'novel', title: '追书神器', from: '#d4fc79', to: '#96e6a1', tabs: [{ icon: 'book', label: '书架' }, { icon: 'open', label: '书城' }, { icon: 'user', label: '我的' }] }
    ]
  },
  {
    direction: 'down',
    speed: '35s',
    cards: [
      { type: 'comic', title: '漫剧世界', from: '#fce7f3', to: '#fbcfe8', tabs: [{ icon: 'home', label: '首页' }, { icon: 'heart', label: '收藏' }, { icon: 'user', label: '我的' }] },
      { type: 'h5', title: '互动H5', from: '#667eea', to: '#764ba2', tabs: [{ icon: 'home', label: '首页' }, { icon: 'gift', label: '活动' }, { icon: 'user', label: '我的' }] },
      { type: 'video-grid', title: '奇趣影视', from: '#fed7aa', to: '#fdba74', tabs: [{ icon: 'home', label: '首页' }, { icon: 'layers', label: '分类' }, { icon: 'user', label: '我的' }] }
    ]
  },
  {
    direction: 'up',
    speed: '45s',
    cards: [
      { type: 'rank', title: '精彩短剧', from: '#c7d2fe', to: '#a5b4fc', tabs: [{ icon: 'fire', label: '热榜' }, { icon: 'clock', label: '更新' }, { icon: 'user', label: '我的' }] },
      { type: 'reader', title: '追书神器', from: '#dcfce7', to: '#bbf7d0', tabs: [{ icon: 'back', label: '返回' }, { icon: 'font', label: '目录' }, { icon: 'gear', label: '设置' }] },
      { type: 'comic-grid', title: '漫剧世界', from: '#f3e8ff', to: '#e9d5ff', tabs: [{ icon: 'home', label: '首页' }, { icon: 'heart', label: '追更' }, { icon: 'user', label: '我的' }] }
    ]
  },
  {
    direction: 'down',
    speed: '38s',
    cards: [
      { type: 'h5-grid', title: '互动H5', from: '#fecaca', to: '#fca5a5', tabs: [{ icon: 'home', label: '首页' }, { icon: 'cart', label: '购物' }, { icon: 'user', label: '我的' }] },
      { type: 'search', title: '奇趣影视', from: '#fef3c7', to: '#fde68a', tabs: [{ icon: 'back', label: '返回' }, { icon: 'search', label: '搜索' }, { icon: 'user', label: '我的' }] },
      { type: 'novel-grid', title: '追书神器', from: '#ccfbf1', to: '#99f6e4', tabs: [{ icon: 'book', label: '书架' }, { icon: 'store', label: '书城' }, { icon: 'user', label: '我的' }] }
    ]
  }
]

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.1 }
  )
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
/* ========== 整体 ========== */
.home-page {
  background: #faf6f1;
  color: #1a1a2e;
  overflow-x: hidden;
  font-family: 'Plus Jakarta Sans', 'Noto Sans SC', -apple-system, sans-serif;
}

/* ========== 动画关键帧 ========== */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}
@keyframes floatReverse {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(20px) rotate(-5deg); }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.2); }
  50% { box-shadow: 0 0 40px rgba(255, 107, 107, 0.4); }
}
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes floatRandom1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
  25% { transform: translate(15px, -25px) rotate(5deg) scale(1.05); }
  50% { transform: translate(-10px, -15px) rotate(-3deg) scale(0.95); }
  75% { transform: translate(20px, 10px) rotate(8deg) scale(1.02); }
}
@keyframes floatRandom2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
  33% { transform: translate(-20px, 15px) rotate(-6deg) scale(1.08); }
  66% { transform: translate(10px, -20px) rotate(4deg) scale(0.92); }
}
@keyframes floatRandom3 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  20% { transform: translate(12px, 18px) rotate(10deg); }
  40% { transform: translate(-18px, 8px) rotate(-5deg); }
  60% { transform: translate(8px, -22px) rotate(7deg); }
  80% { transform: translate(-15px, -10px) rotate(-8deg); }
}
@keyframes floatRandom4 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(-15px, -12px) scale(1.06); }
  50% { transform: translate(18px, 5px) scale(0.94); }
  75% { transform: translate(-8px, 20px) scale(1.03); }
}
@keyframes floatRandom5 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  30% { transform: translate(22px, -8px) rotate(-12deg); }
  60% { transform: translate(-12px, 22px) rotate(6deg); }
}
@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

.float-1 { animation: floatRandom1 5s ease-in-out infinite; }
.float-2 { animation: floatRandom2 6s ease-in-out infinite; }
.float-3 { animation: floatRandom3 7s ease-in-out infinite; }
.float-4 { animation: floatRandom4 4.5s ease-in-out infinite; }
.float-5 { animation: floatRandom5 5.5s ease-in-out infinite; }

.animate-slide-up { animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
.animate-slide-right { animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }

/* 滚动 reveal */
.reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal.visible { opacity: 1; transform: translateY(0); }

/* ========== HERO ========== */
.hero {
  position: relative;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 24px;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
}
.blob-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(245, 158, 11, 0.2));
  top: -160px;
  right: -160px;
  animation: float 6s ease-in-out infinite;
}
.blob-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2));
  bottom: 80px;
  left: -160px;
  animation: floatReverse 7s ease-in-out infinite;
}
.blob-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.1));
  top: 50%;
  right: 25%;
  animation: float 8s ease-in-out infinite;
}

.hero-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text h1 {
  margin: 0 0 24px;
  font-size: 52px;
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: -1px;
}
.hero-title-gradient {
  background: linear-gradient(90deg, #ff6b6b, #a855f7, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
.hero-desc {
  margin: 0 0 32px;
  font-size: 17px;
  line-height: 1.6;
  color: #8b8b9e;
  max-width: 28rem;
}
.hero-cta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.hero-cta-hint { font-size: 13px; color: #b4b4c7; }

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 700;
  background: linear-gradient(135deg, #1a1a2e, #2d2d44);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 8px 32px -8px rgba(26, 26, 46, 0.4);
  text-decoration: none;
}
.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px -8px rgba(26, 26, 46, 0.5);
}
.cta-btn-large { padding: 18px 40px; font-size: 16px; }

/* Hero 图标墙 */
.hero-cloud {
  position: relative;
  height: 420px;
}
.cloud-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 96px;
  height: 96px;
  border-radius: 28px;
  background: linear-gradient(135deg, #ff6b6b, #f43f5e);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  animation: pulseGlow 3s ease-in-out infinite;
}
.cloud-icon {
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.cloud-icon:hover {
  transform: scale(1.15) rotate(-5deg);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
.cloud-icon img {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  object-fit: cover;
}
.cloud-emoji {
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.hero-scroll-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  color: #c4c4d4;
  animation: bounceDown 1.6s ease-in-out infinite;
}

/* ========== Section 通用 ========== */
.section { padding: 96px 0; position: relative; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-head { text-align: center; margin-bottom: 64px; }
.section-eyebrow {
  font-size: 13px;
  font-weight: 700;
  color: #ff6b6b;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}
.section-title {
  margin: 12px 0 12px;
  font-size: 36px;
  font-weight: 900;
  letter-spacing: -0.5px;
}
.section-desc { margin: 0; font-size: 16px; color: #8b8b9e; }

/* ========== 平台覆盖 ========== */
.platform-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
}
.platform-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}
.platform-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 48px -16px rgba(0, 0, 0, 0.12);
}
.platform-card-img {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}
.platform-card:hover .platform-card-img { transform: scale(1.1); }
.platform-card-img img {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  object-fit: cover;
}
.platform-card h3 { margin: 0 0 4px; font-size: 18px; font-weight: 800; }
.platform-card p { margin: 0; font-size: 13px; color: #b4b4c7; }

/* ========== 品类 ========== */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
}
.cat-card {
  position: relative;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s;
}
.cat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}
.cat-card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px -16px rgba(0, 0, 0, 0.12); }
.cat-card:hover::before { opacity: 1; }
.cat-card.cat-video::before { background: linear-gradient(90deg, #f43f5e, #fb7185); }
.cat-card.cat-drama::before { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.cat-card.cat-comic::before { background: linear-gradient(90deg, #a855f7, #c084fc); }
.cat-card.cat-novel::before { background: linear-gradient(90deg, #10b981, #34d399); }
.cat-card.cat-h5::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

.cat-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}
.cat-card h3 { margin: 0 0 4px; font-size: 16px; font-weight: 800; }
.cat-card p { margin: 0; font-size: 12px; color: #b4b4c7; }

/* ========== 展示墙 ========== */
.showcase-section {
  background: linear-gradient(to bottom, #eef4ff, #f5f9ff, #faf6f1);
}
.showcase-wall {
  display: flex;
  gap: 14px;
  height: 620px;
  overflow: hidden;
  position: relative;
}
.showcase-wall::before,
.showcase-wall::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 100px;
  z-index: 10;
  pointer-events: none;
}
.showcase-wall::before { top: 0; background: linear-gradient(to bottom, #eef4ff, transparent); }
.showcase-wall::after { bottom: 0; background: linear-gradient(to top, #faf6f1, transparent); }

.showcase-col {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.showcase-col-track {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.showcase-col-track.scroll-up { animation: scrollUp var(--speed, 40s) linear infinite; }
.showcase-col-track.scroll-down { animation: scrollDown var(--speed, 40s) linear infinite; }
.showcase-col:hover .showcase-col-track { animation-play-state: paused; }
@keyframes scrollUp {
  from { transform: translateY(0); }
  to { transform: translateY(-50%); }
}
@keyframes scrollDown {
  from { transform: translateY(-50%); }
  to { transform: translateY(0); }
}

/* ========== CTA ========== */
.cta-section { padding: 96px 24px; }
.cta-container {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}
.cta-container h2 { margin: 0 0 16px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px; }
.cta-container p { margin: 0 0 32px; font-size: 17px; color: #8b8b9e; }

/* ========== Footer ========== */
.site-footer { border-top: 1px solid rgba(0, 0, 0, 0.05); padding: 32px 24px; }
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer-brand { display: inline-flex; align-items: center; gap: 8px; }
.footer-brand-mark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ff6b6b, #f43f5e);
  box-shadow: 0 8px 16px rgba(244, 63, 94, 0.25);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.footer-brand-text { font-weight: 700; font-size: 14px; color: #1a1a2e; }
.footer-copy { font-size: 12px; color: #c4c4d4; }

/* ========== 响应式 ========== */
@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; gap: 48px; }
  .hero-cloud { height: 320px; }
  .hero-text h1 { font-size: 40px; }
  .platform-grid, .cat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .showcase-wall { height: 480px; gap: 10px; }
  .section { padding: 64px 0; }
  .section-title, .cta-container h2 { font-size: 28px; }
}
@media (max-width: 560px) {
  .hero { padding: 0 16px; }
  .hero-grid { padding: 0 16px; }
  .hero-text h1 { font-size: 32px; }
  .platform-grid, .cat-grid { grid-template-columns: 1fr; }
  .showcase-wall { height: 380px; }
  .footer-inner { flex-direction: column; gap: 12px; }
}
</style>
