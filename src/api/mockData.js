export const mockProjects = [
  { source: 'novel_miniapp', appId: 'pkg-20260527-h7abhm', appName: '未命名-pkg-20260...', platform: 'douyin', category: 'novel', version: '', entryUrl: 'http://172.17.7.183:8080/miniapp/novel/home', updateTime: '2026-05-29T10:10:00+08:00' },
  { source: 'novel_miniapp', appId: 'pkg-novel-xiaoyao-do', appName: '逍遥书阁', platform: 'douyin', category: 'novel', version: '9.9.9', entryUrl: 'http://172.17.7.183:8080/miniapp/novel/home', updateTime: '2026-05-29T10:09:00+08:00' },
  { source: 'novel_miniapp', appId: 'pkg-novel-qingchuanshui', appName: '清川书阁', platform: 'douyin', category: 'novel', version: '9.9.9', entryUrl: 'http://172.17.7.183:8080/miniapp/novel/home', updateTime: '2026-05-29T10:08:00+08:00' },
  { source: 'novel_miniapp', appId: 'pkg-novel-suxinwenyuan', appName: '素心文苑', platform: 'douyin', category: 'novel', version: '9.9.9', entryUrl: 'http://172.17.7.183:8080/miniapp/novel/home', updateTime: '2026-05-29T10:07:00+08:00' },
  { source: 'novel_miniapp', appId: 'pkg-novel-xingchen-ku', appName: '星辰文学', platform: 'kuaishou', category: 'novel', version: '9.9.9', entryUrl: 'http://172.17.7.183:8080/miniapp/novel/home', updateTime: '2026-05-29T10:06:00+08:00' },
  { source: 'novel_miniapp', appId: 'pkg-novel-yunyou-we', appName: '云游阅读', platform: 'weixin', category: 'novel', version: '9.9.9', entryUrl: 'http://172.17.7.183:8080/miniapp/novel/home', updateTime: '2026-05-29T10:05:00+08:00' },
  { source: 'comic_miniapp', appId: 'pkg-comic-main-douyin', appName: '漫剧主站', platform: 'douyin', category: 'comic', version: '3.0.2', entryUrl: 'http://172.17.7.183:5177/apps', updateTime: '2026-05-29T10:04:00+08:00' },
  { source: 'comic_miniapp', appId: 'pkg-comic-sub-wechat', appName: '漫剧马甲包', platform: 'weixin', category: 'comic', version: '2.1.0', entryUrl: 'http://172.17.7.183:5177/apps', updateTime: '2026-05-29T10:03:00+08:00' },
  { source: 'video_miniapp', appId: 'pkg-video-main-douyin', appName: '影视主站', platform: 'douyin', category: 'video', version: '2.3.1', entryUrl: 'http://172.17.7.183:8080/miniapp/autocreate/video/apps', updateTime: '2026-05-29T10:02:00+08:00' },
  { source: 'video_miniapp', appId: 'pkg-video-sub-wechat', appName: '影视分销', platform: 'weixin', category: 'video', version: '1.5.2', entryUrl: 'http://172.17.7.183:8080/miniapp/autocreate/video/apps', updateTime: '2026-05-29T10:01:00+08:00' },
  { source: 'drama_miniapp', appId: 'pkg-drama-a-kuaishou', appName: '短剧A版', platform: 'kuaishou', category: 'drama', version: '1.0.8', entryUrl: 'http://172.17.7.183:5177/apps', updateTime: '2026-05-29T10:00:00+08:00' },
  { source: 'h5', appId: 'pkg-h5-novel-config', appName: 'H5小说配置', platform: 'web', category: 'h5_novel', version: '1.2.0', entryUrl: 'http://172.17.3.118/h5novelwebconfig/', updateTime: '2026-05-29T09:59:00+08:00' },
  { source: 'h5', appId: 'pkg-h5-video-main', appName: 'H5影视主站', platform: 'web', category: 'h5_yingshi', version: '1.1.4', entryUrl: 'http://172.17.3.118/h5novelwebconfig/', updateTime: '2026-05-29T09:58:00+08:00' },
  { source: 'h5', appId: 'pkg-h5-distribution', appName: 'H5分销页', platform: 'web', category: 'h5_fx', version: '1.0.6', entryUrl: 'http://172.17.3.118/h5novelwebconfig/', updateTime: '2026-05-29T09:57:00+08:00' },
  { source: 'h5', appId: 'pkg-h5-growth', appName: 'H5拉新活动', platform: 'web', category: 'h5_lx', version: '1.0.1', entryUrl: 'http://172.17.3.118/h5novelwebconfig/', updateTime: '2026-05-29T09:56:00+08:00' }
]

export function buildMockStats(projects = mockProjects) {
  const byCategory = Object.entries(
    projects.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})
  ).map(([category, count]) => ({ category, count }))

  const byPlatform = Object.entries(
    projects.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + 1
      return acc
    }, {})
  ).map(([platform, count]) => ({ platform, count }))

  return {
    total: projects.length,
    byCategory,
    byPlatform,
    recent: projects.slice(0, 5)
  }
}
