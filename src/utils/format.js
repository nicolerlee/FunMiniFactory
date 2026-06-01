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
