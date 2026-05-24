export interface TimestampResult {
  unix: number
  unixMs: number
  utc: string
  local: string
  iso: string
  relative: string
}

export function fromUnix(ts: number, isMs: boolean): TimestampResult {
  const ms = isMs ? ts : ts * 1000
  const d = new Date(ms)
  return {
    unix: Math.floor(ms / 1000),
    unixMs: ms,
    utc: d.toUTCString(),
    local: d.toLocaleString(),
    iso: d.toISOString(),
    relative: formatRelative(d),
  }
}

export function fromDateString(dateStr: string): TimestampResult | null {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  const ms = d.getTime()
  return {
    unix: Math.floor(ms / 1000),
    unixMs: ms,
    utc: d.toUTCString(),
    local: d.toLocaleString(),
    iso: d.toISOString(),
    relative: formatRelative(d),
  }
}

export function nowResult(): TimestampResult {
  return fromUnix(Date.now(), true)
}

function formatRelative(d: Date): string {
  const diffMs = d.getTime() - Date.now()
  const abs = Math.abs(diffMs)
  const past = diffMs < 0

  if (abs < 1000) return 'just now'
  const seconds = Math.floor(abs / 1000)
  if (seconds < 60) return past ? `${seconds}s ago` : `in ${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return past ? `${minutes}m ago` : `in ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return past ? `${hours}h ago` : `in ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return past ? `${days}d ago` : `in ${days}d`
  const months = Math.floor(days / 30)
  if (months < 12) return past ? `${months}mo ago` : `in ${months}mo`
  const years = Math.floor(days / 365)
  return past ? `${years}y ago` : `in ${years}y`
}
