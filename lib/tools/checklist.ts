import LZString from 'lz-string'

export type ChecklistState = 'unchecked' | 'checked' | 'invalid'

export interface ChecklistItem {
  id: string
  text: string
  state: ChecklistState
}

export interface ChecklistProgress {
  total: number
  checked: number
  invalid: number
  unchecked: number
  percent: number
}

const STATUS_PATTERNS: Array<{ pattern: RegExp; state: ChecklistState }> = [
  { pattern: /^\[x\]\s*/i, state: 'checked' },
  { pattern: /^\[~\]\s*/, state: 'invalid' },
  { pattern: /^\[ \]\s*/, state: 'unchecked' },
  { pattern: /^✓\s*/, state: 'checked' },
  { pattern: /^✗\s*/, state: 'invalid' },
  { pattern: /^[-*•]\s*/, state: 'unchecked' },
]

function detectAndStripStatus(text: string): { text: string; state: ChecklistState } {
  for (const { pattern, state } of STATUS_PATTERNS) {
    if (pattern.test(text)) {
      return { text: text.replace(pattern, '').trim(), state }
    }
  }
  return { text: text.trim(), state: 'unchecked' }
}

export function parseChecklistInput(input: string): ChecklistItem[] {
  if (!input.trim()) return []

  const lines = input
    .split(/[\n,\t]+/)
    .map((l) => l.trim())
    .filter(Boolean)

  return lines.map((line, i) => {
    const { text, state } = detectAndStripStatus(line)
    return {
      id: `item-${Date.now()}-${i}`,
      text,
      state,
    }
  })
}

export function transitionState(current: ChecklistState): ChecklistState {
  if (current === 'unchecked') return 'checked'
  if (current === 'checked') return 'invalid'
  return 'unchecked'
}

export function computeProgress(items: ChecklistItem[]): ChecklistProgress {
  const total = items.length
  const checked = items.filter((i) => i.state === 'checked').length
  const invalid = items.filter((i) => i.state === 'invalid').length
  const unchecked = items.filter((i) => i.state === 'unchecked').length
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100)
  return { total, checked, invalid, unchecked, percent }
}

export function filterItems(items: ChecklistItem[], query: string): ChecklistItem[] {
  if (!query.trim()) return items
  const q = query.toLowerCase()
  return items.filter((i) => i.text.toLowerCase().includes(q))
}

export function encodeChecklistToURL(items: ChecklistItem[]): string {
  const payload = items.map((i) => ({
    t: i.text,
    s: i.state === 'checked' ? 1 : i.state === 'invalid' ? 2 : 0,
  }))
  return LZString.compressToEncodedURIComponent(JSON.stringify(payload))
}

export function decodeChecklistFromURL(encoded: string): ChecklistItem[] | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded)
    if (!json) return null
    const payload = JSON.parse(json) as Array<{ t: string; s: number }>
    return payload.map((p, i) => ({
      id: `item-url-${i}`,
      text: p.t,
      state: p.s === 1 ? 'checked' : p.s === 2 ? 'invalid' : 'unchecked',
    }))
  } catch {
    return null
  }
}

export function exportAsPlainText(items: ChecklistItem[]): string {
  return items
    .map((i) => {
      const prefix = i.state === 'checked' ? '[x] ' : i.state === 'invalid' ? '[~] ' : '[ ] '
      return `${prefix}${i.text}`
    })
    .join('\n')
}

export function exportAsMarkdown(items: ChecklistItem[]): string {
  return items
    .map((i) => {
      const prefix = i.state === 'checked' ? '- [x] ' : '- [ ] '
      const text = i.state === 'invalid' ? `~~${i.text}~~` : i.text
      return `${prefix}${text}`
    })
    .join('\n')
}

export function exportAsCSV(items: ChecklistItem[]): string {
  const header = 'text,state'
  const rows = items.map((i) => `"${i.text.replace(/"/g, '""')}","${i.state}"`)
  return [header, ...rows].join('\n')
}
