import LZString from 'lz-string'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChecklistState = 'unchecked' | 'checked' | 'invalid'
export type ItemDepth = 0 | 1 | 2   // 0 = parent, 1 = child, 2 = super-child

export interface AdvancedItem {
  id: string
  text: string
  state: ChecklistState
  depth: ItemDepth
  parentId: string | null   // null = top-level
  collapsed: boolean        // only meaningful for depth 0 and 1
}

export interface AdvancedProgress {
  total: number
  checked: number
  percent: number
}

// ─── ID generation ───────────────────────────────────────────────────────────

export function newId(): string {
  return `adv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

// ─── Tree queries ─────────────────────────────────────────────────────────────

/** All direct children of parentId (regardless of depth). */
export function childrenOf(items: AdvancedItem[], parentId: string): AdvancedItem[] {
  return items.filter((i) => i.parentId === parentId)
}

/** All descendants (children + super-children) of an item. */
export function descendantsOf(items: AdvancedItem[], id: string): AdvancedItem[] {
  const direct = childrenOf(items, id)
  return direct.flatMap((child) => [child, ...descendantsOf(items, child.id)])
}

/** Depth of an item given its parentId. */
export function resolveDepth(items: AdvancedItem[], parentId: string | null): ItemDepth {
  if (!parentId) return 0
  const parent = items.find((i) => i.id === parentId)
  if (!parent) return 0
  return (parent.depth + 1) as ItemDepth
}

/** Whether item can accept children (max depth 2, so depth 0 and 1 can). */
export function canHaveChildren(depth: ItemDepth): boolean {
  return depth < 2
}

/** Previous sibling among top-level items only (used for indent guard). */
export function prevSiblingExists(items: AdvancedItem[], item: AdvancedItem): boolean {
  const siblings = items.filter((i) => i.parentId === item.parentId)
  const idx = siblings.findIndex((i) => i.id === item.id)
  return idx > 0
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export function computeItemProgress(items: AdvancedItem[], id: string): AdvancedProgress {
  const desc = descendantsOf(items, id)
  if (desc.length === 0) {
    const self = items.find((i) => i.id === id)
    return {
      total: 1,
      checked: self?.state === 'checked' ? 1 : 0,
      percent: self?.state === 'checked' ? 100 : 0,
    }
  }
  const leaves = desc.filter((d) => childrenOf(items, d.id).length === 0)
  const total = leaves.length
  const checked = leaves.filter((l) => l.state === 'checked').length
  return { total, checked, percent: total === 0 ? 0 : Math.round((checked / total) * 100) }
}

export function computeOverallProgress(items: AdvancedItem[]): AdvancedProgress {
  const leaves = items.filter((i) => childrenOf(items, i.id).length === 0)
  const total = leaves.length
  const checked = leaves.filter((l) => l.state === 'checked').length
  return { total, checked, percent: total === 0 ? 0 : Math.round((checked / total) * 100) }
}

// ─── State transitions ────────────────────────────────────────────────────────

export function transitionAdvancedState(current: ChecklistState): ChecklistState {
  if (current === 'unchecked') return 'checked'
  if (current === 'checked') return 'invalid'
  return 'unchecked'
}

/** Toggle an item. If it has descendants, cascade check/uncheck to leaves. */
export function toggleItem(items: AdvancedItem[], id: string): AdvancedItem[] {
  const item = items.find((i) => i.id === id)
  if (!item) return items
  const next = transitionAdvancedState(item.state)
  const desc = descendantsOf(items, id)
  const descIds = new Set(desc.map((d) => d.id))
  return items.map((i) => {
    if (i.id === id) return { ...i, state: next }
    // cascade: only when toggling to checked or unchecked (not invalid)
    if (descIds.has(i.id) && (next === 'checked' || next === 'unchecked')) {
      return { ...i, state: next }
    }
    return i
  })
}

// ─── Mutation helpers ─────────────────────────────────────────────────────────

/** Delete item and all its descendants. */
export function deleteItem(items: AdvancedItem[], id: string): AdvancedItem[] {
  const toRemove = new Set([id, ...descendantsOf(items, id).map((d) => d.id)])
  return items.filter((i) => !toRemove.has(i.id))
}

/** Add a child immediately after the parent in the flat list. */
export function addChild(items: AdvancedItem[], parentId: string): AdvancedItem[] {
  const parent = items.find((i) => i.id === parentId)
  if (!parent) return items
  const newDepth = (parent.depth + 1) as ItemDepth
  if (newDepth > 2) return items
  const newItem: AdvancedItem = {
    id: newId(),
    text: '',
    state: 'unchecked',
    depth: newDepth,
    parentId,
    collapsed: false,
  }
  // Insert after last descendant of parent
  const desc = descendantsOf(items, parentId)
  const lastDescId = desc.length > 0 ? desc[desc.length - 1]?.id : undefined
  const insertAfterIdx = lastDescId
    ? items.findIndex((i) => i.id === lastDescId)
    : items.findIndex((i) => i.id === parentId)
  const result = [...items]
  result.splice(insertAfterIdx + 1, 0, newItem)
  return result
}

/** Indent: make item a child of its previous sibling. */
export function indentItem(items: AdvancedItem[], id: string): AdvancedItem[] {
  const item = items.find((i) => i.id === id)
  if (!item) return items
  const siblings = items.filter((i) => i.parentId === item.parentId)
  const idx = siblings.findIndex((i) => i.id === id)
  if (idx <= 0) return items // no previous sibling
  const prevSibling = siblings[idx - 1]
  if (!prevSibling) return items
  if (prevSibling.depth >= 2) return items // can't nest deeper than 2
  const newParentId = prevSibling.id
  const newDepth = (prevSibling.depth + 1) as ItemDepth
  // Also re-depth all descendants
  const desc = descendantsOf(items, id)
  const depthDelta = newDepth - item.depth
  return items.map((i) => {
    if (i.id === id) return { ...i, parentId: newParentId, depth: newDepth }
    const d = desc.find((d) => d.id === i.id)
    if (d) return { ...i, depth: Math.min(2, d.depth + depthDelta) as ItemDepth }
    return i
  })
}

/** Outdent: promote item to parent's parent. */
export function outdentItem(items: AdvancedItem[], id: string): AdvancedItem[] {
  const item = items.find((i) => i.id === id)
  if (!item || item.parentId === null) return items
  const parent = items.find((i) => i.id === item.parentId)
  if (!parent) return items
  const newParentId = parent.parentId
  const newDepth = (item.depth - 1) as ItemDepth
  const desc = descendantsOf(items, id)
  const depthDelta = newDepth - item.depth // negative
  return items.map((i) => {
    if (i.id === id) return { ...i, parentId: newParentId, depth: newDepth }
    const d = desc.find((d) => d.id === i.id)
    if (d) return { ...i, depth: Math.max(0, d.depth + depthDelta) as ItemDepth }
    return i
  })
}

/** Toggle collapsed state of an item. */
export function toggleCollapse(items: AdvancedItem[], id: string): AdvancedItem[] {
  return items.map((i) => (i.id === id ? { ...i, collapsed: !i.collapsed } : i))
}

/** Set all top-level and child items collapsed state. */
export function setAllCollapsed(items: AdvancedItem[], collapsed: boolean): AdvancedItem[] {
  return items.map((i) => (i.depth < 2 ? { ...i, collapsed } : i))
}

/** Edit item text, preserving all children. */
export function editItem(items: AdvancedItem[], id: string, text: string): AdvancedItem[] {
  return items.map((i) => (i.id === id ? { ...i, text } : i))
}

/** Add a new top-level item at the end. */
export function addTopLevelItem(items: AdvancedItem[], text: string): AdvancedItem[] {
  return [
    ...items,
    { id: newId(), text, state: 'unchecked', depth: 0, parentId: null, collapsed: false },
  ]
}

// ─── Visibility (for collapse) ────────────────────────────────────────────────

/** Return items that should be rendered (collapsed ancestors hide descendants). */
export function visibleItems(items: AdvancedItem[]): AdvancedItem[] {
  const hiddenIds = new Set<string>()
  for (const item of items) {
    if (item.collapsed) {
      descendantsOf(items, item.id).forEach((d) => hiddenIds.add(d.id))
    }
    if (hiddenIds.has(item.id)) hiddenIds.add(item.id)
  }
  return items.filter((i) => !hiddenIds.has(i.id))
}

// ─── Reorder (flat array move, keeping parent constraints) ────────────────────

/** Move item (and its descendants) to a new position in the flat array. */
export function reorderItem(
  items: AdvancedItem[],
  activeId: string,
  overId: string
): AdvancedItem[] {
  const activeIdx = items.findIndex((i) => i.id === activeId)
  const overIdx = items.findIndex((i) => i.id === overId)
  if (activeIdx === -1 || overIdx === -1 || activeIdx === overIdx) return items

  const active = items[activeIdx]
  if (!active) return items
  const desc = descendantsOf(items, activeId)
  const block = [active, ...desc]
  const blockIds = new Set(block.map((b) => b.id))

  // Remove block from array
  const without = items.filter((i) => !blockIds.has(i.id))
  const newOverIdx = without.findIndex((i) => i.id === overId)
  if (newOverIdx === -1) return items

  // Insert block after the over item
  const result = [...without]
  result.splice(newOverIdx + 1, 0, ...block)
  return result
}

// ─── Persistence (URL encoding) ───────────────────────────────────────────────

export function encodeAdvancedToURL(items: AdvancedItem[]): string {
  const payload = items.map((i) => ({
    i: i.id,
    t: i.text,
    s: i.state === 'checked' ? 1 : i.state === 'invalid' ? 2 : 0,
    d: i.depth,
    p: i.parentId,
    c: i.collapsed ? 1 : 0,
  }))
  return LZString.compressToEncodedURIComponent(JSON.stringify(payload))
}

export function decodeAdvancedFromURL(encoded: string): AdvancedItem[] | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded)
    if (!json) return null
    const payload = JSON.parse(json) as Array<{
      i: string; t: string; s: number; d: number; p: string | null; c: number
    }>
    return payload.map((p) => ({
      id: p.i,
      text: p.t,
      state: p.s === 1 ? 'checked' : p.s === 2 ? 'invalid' : 'unchecked',
      depth: (p.d as ItemDepth) ?? 0,
      parentId: p.p ?? null,
      collapsed: p.c === 1,
    }))
  } catch {
    return null
  }
}

// ─── Export ───────────────────────────────────────────────────────────────────

const INDENT = '  '

export function exportAdvancedAsMarkdown(items: AdvancedItem[]): string {
  return items
    .map((i) => {
      const pad = INDENT.repeat(i.depth)
      const check = i.state === 'checked' ? '[x]' : '[ ]'
      const text = i.state === 'invalid' ? `~~${i.text}~~` : i.text
      return `${pad}- ${check} ${text}`
    })
    .join('\n')
}

export function exportAdvancedAsPlainText(items: AdvancedItem[]): string {
  return items
    .map((i) => {
      const pad = INDENT.repeat(i.depth)
      const prefix = i.state === 'checked' ? '[x]' : i.state === 'invalid' ? '[~]' : '[ ]'
      return `${pad}${prefix} ${i.text}`
    })
    .join('\n')
}

export function exportAdvancedAsJSON(items: AdvancedItem[]): string {
  // Build recursive tree for JSON output
  function buildTree(parentId: string | null): object[] {
    return items
      .filter((i) => i.parentId === parentId)
      .map((i) => ({
        text: i.text,
        state: i.state,
        children: buildTree(i.id),
      }))
  }
  return JSON.stringify(buildTree(null), null, 2)
}

export function exportAdvancedAsCSV(items: AdvancedItem[]): string {
  const header = 'text,state,depth,parentId'
  const rows = items.map(
    (i) =>
      `"${i.text.replace(/"/g, '""')}","${i.state}",${i.depth},"${i.parentId ?? ''}"`
  )
  return [header, ...rows].join('\n')
}

// ─── Parse indented text into advanced items ──────────────────────────────────

export function parseAdvancedInput(input: string): AdvancedItem[] {
  if (!input.trim()) return []
  const lines = input.split('\n').filter((l) => l.trim())
  const result: AdvancedItem[] = []
  const stack: Array<{ id: string; depth: ItemDepth }> = []

  for (const line of lines) {
    const leadingSpaces = line.match(/^(\s*)/)?.[1]?.length ?? 0
    const rawDepth = Math.min(2, Math.floor(leadingSpaces / 2))
    const depth = rawDepth as ItemDepth
    const text = line.trim().replace(/^[-*•]\s*/, '').replace(/^\[[ x~]\]\s*/i, '').trim()
    if (!text) continue

    // Pop stack to find parent
    while (stack.length > 0 && (stack[stack.length - 1]?.depth ?? -1) >= depth) stack.pop()
    const parentId = stack.length > 0 ? (stack[stack.length - 1]?.id ?? null) : null
    const id = newId()
    result.push({ id, text, state: 'unchecked', depth, parentId, collapsed: false })
    stack.push({ id, depth })
  }
  return result
}
