import { CATEGORY_META, PLATFORM_META } from './constants'

export function categoryLabel(value) {
  return CATEGORY_META[value]?.shortLabel || value || '-'
}

export function platformLabel(value) {
  return PLATFORM_META[value]?.label || value || '-'
}

export function displayVersion(value) {
  return value && String(value).trim() ? value : '—'
}

export function compactText(value, max = 24) {
  if (!value) return '-'
  const text = String(value)
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

export function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function relativeTime(value, now = Date.now()) {
  if (!value) return '-'
  const ts = new Date(value).getTime()
  if (Number.isNaN(ts)) return value
  const diffMs = now - ts
  if (diffMs < 0) return '刚刚'
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diffMs < minute) return '刚刚'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} 分钟前`
  if (diffMs < day) return `${Math.floor(diffMs / hour)} 小时前`
  if (diffMs < 2 * day) return '昨天'
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)} 天前`
  if (diffMs < 30 * day) return `${Math.floor(diffMs / (7 * day))} 周前`
  return formatDate(value)
}
