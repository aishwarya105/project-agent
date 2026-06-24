// Small formatting helpers shared across pages.

export function formatNumber(n) {
  if (n === null || n === undefined) return '—'
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(n)
}

export function formatValue(value, unit) {
  const num = formatNumber(value)
  if (unit === '%') return `${num}%`
  if (unit === 'm') return `${num}m`
  return num
}

// Percentage change between two values, e.g. +8.9 or -11.7.
export function pctChange(current, previous) {
  if (!previous) return 0
  return ((current - previous) / previous) * 100
}

export function formatSignedPct(value) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

export function formatRelativeTime(iso) {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffMin = Math.round((now - then) / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.round(diffHr / 24)
  return `${diffDay}d ago`
}

export function formatClockTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function initialsOf(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
