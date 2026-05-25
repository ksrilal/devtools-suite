'use client'

import { useState, useEffect } from 'react'
import { CheckSquare, Square, XSquare, ChevronDown } from 'lucide-react'

type ItemState = 'unchecked' | 'checked' | 'invalid'

interface PreviewItem {
  id: number
  label: string
  state: ItemState
  depth: 0 | 1 | 2
  progress?: string
}

const INITIAL_ITEMS: PreviewItem[] = [
  { id: 1, label: 'Backend',          state: 'unchecked', depth: 0, progress: '0/4' },
  { id: 2, label: 'Run migrations',   state: 'unchecked', depth: 1 },
  { id: 3, label: 'Deploy API',       state: 'unchecked', depth: 1 },
  { id: 4, label: 'Health check',     state: 'unchecked', depth: 1 },
  { id: 5, label: 'Frontend',         state: 'unchecked', depth: 0, progress: '0/2' },
  { id: 6, label: 'Build assets',     state: 'unchecked', depth: 1 },
  { id: 7, label: 'Purge CDN cache',  state: 'unchecked', depth: 1 },
]

const SEQUENCE: Array<{ itemId: number; toState: ItemState }> = [
  { itemId: 2, toState: 'checked' },
  { itemId: 3, toState: 'checked' },
  { itemId: 4, toState: 'checked' },
  { itemId: 6, toState: 'checked' },
  { itemId: 7, toState: 'checked' },
]

function deriveParentProgress(items: PreviewItem[], parentId: number): string {
  const children = items.filter(i => i.depth > 0 && (() => {
    const parentIdx = items.findIndex(p => p.id === parentId)
    const childIdx = items.findIndex(c => c.id === i.id)
    return childIdx > parentIdx
  })())
  const siblings = items.filter((i, idx) => {
    const parentIdx = items.findIndex(p => p.id === parentId)
    if (idx <= parentIdx) return false
    const next0 = items.slice(parentIdx + 1).findIndex(x => x.depth === 0)
    return next0 === -1 ? i.depth > 0 : idx < parentIdx + 1 + next0 && i.depth === 1
  })
  const checked = siblings.filter(i => i.state === 'checked').length
  return `${checked}/${siblings.length}`
}

function ItemIcon({ state }: { state: ItemState }) {
  if (state === 'checked') return <CheckSquare className="h-3.5 w-3.5 text-green-500 shrink-0" />
  if (state === 'invalid') return <XSquare className="h-3.5 w-3.5 text-red-500 shrink-0" />
  return <Square className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
}

export function ChecklistAdvancedPreviewPanel() {
  const [items, setItems] = useState<PreviewItem[]>(INITIAL_ITEMS)
  const [step, setStep] = useState(0)
  const [activeId, setActiveId] = useState<number | null>(null)

  useEffect(() => {
    if (step >= SEQUENCE.length) {
      const t = setTimeout(() => { setItems(INITIAL_ITEMS); setStep(0); setActiveId(null) }, 2800)
      return () => clearTimeout(t)
    }
    const entry = SEQUENCE[step]
    if (!entry) return
    const t1 = setTimeout(() => setActiveId(entry.itemId), 350)
    const t2 = setTimeout(() => {
      setItems(prev => {
        const next = prev.map(item =>
          item.id === entry.itemId ? { ...item, state: entry.toState } : item
        )
        // update parent progress labels
        return next.map(item => {
          if (item.depth !== 0) return item
          const childrenBelow = (() => {
            const parentIdx = next.findIndex(p => p.id === item.id)
            const slice = next.slice(parentIdx + 1)
            const end = slice.findIndex(x => x.depth === 0)
            return end === -1 ? slice.filter(x => x.depth === 1) : slice.slice(0, end).filter(x => x.depth === 1)
          })()
          const checked = childrenBelow.filter(c => c.state === 'checked').length
          return { ...item, progress: `${checked}/${childrenBelow.length}` }
        })
      })
      setActiveId(null)
      setStep(s => s + 1)
    }, 850)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [step])

  const allLeaves = items.filter(i => i.depth === 1)
  const checked = allLeaves.filter(i => i.state === 'checked').length
  const progress = Math.round((checked / allLeaves.length) * 100)

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden flex flex-col">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/50 bg-muted/20 shrink-0">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
        <span className="h-2 w-2 rounded-full bg-green-400/70" />
        <span className="ml-2 text-xs text-muted-foreground/50 font-mono">release-v3.0</span>
      </div>
      <div className="px-4 pt-3 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">{checked}/{allLeaves.length} complete</span>
          <span className="text-xs font-medium tabular-nums">{progress}%</span>
        </div>
        <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-green-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <ul className="px-3 pb-3 space-y-0.5">
        {items.map(item => (
          <li
            key={item.id}
            style={{ paddingLeft: item.depth === 1 ? '1.25rem' : item.depth === 2 ? '2.5rem' : '0' }}
            className={[
              'flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors duration-200',
              activeId === item.id ? 'bg-accent' : '',
              item.state === 'checked' ? 'text-muted-foreground line-through decoration-muted-foreground/40' : '',
              item.state === 'invalid' ? 'text-red-500/80' : 'text-foreground',
            ].filter(Boolean).join(' ')}
          >
            {item.depth === 0 && (
              <ChevronDown className="h-3 w-3 text-muted-foreground/50 shrink-0" />
            )}
            <ItemIcon state={item.state} />
            <span className="truncate">{item.label}</span>
            {item.progress !== undefined && (
              <span className="ml-auto text-[10px] text-muted-foreground/50 tabular-nums shrink-0">
                {item.progress}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
