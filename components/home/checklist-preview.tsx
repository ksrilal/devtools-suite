'use client'

import { useState, useEffect } from 'react'
import { CheckSquare, Square, XSquare } from 'lucide-react'

type ItemState = 'unchecked' | 'checked' | 'invalid'

interface PreviewItem {
  id: number
  label: string
  state: ItemState
}

const INITIAL_ITEMS: PreviewItem[] = [
  { id: 1, label: 'Deploy database migrations', state: 'checked' },
  { id: 2, label: 'Run smoke tests', state: 'checked' },
  { id: 3, label: 'Update release notes', state: 'unchecked' },
  { id: 4, label: 'Notify stakeholders', state: 'unchecked' },
  { id: 5, label: 'Archive old builds', state: 'unchecked' },
]

const SEQUENCE: Array<{ itemId: number; toState: ItemState }> = [
  { itemId: 3, toState: 'checked' },
  { itemId: 4, toState: 'checked' },
  { itemId: 5, toState: 'invalid' },
]

function ItemIcon({ state }: { state: ItemState }) {
  if (state === 'checked') return <CheckSquare className="h-4 w-4 text-green-500 shrink-0" aria-hidden="true" />
  if (state === 'invalid') return <XSquare className="h-4 w-4 text-red-500 shrink-0" aria-hidden="true" />
  return <Square className="h-4 w-4 text-muted-foreground/40 shrink-0" aria-hidden="true" />
}

export function ChecklistPreviewPanel() {
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
      setItems(prev => prev.map(item => item.id === entry.itemId ? { ...item, state: entry.toState } : item))
      setActiveId(null)
      setStep(s => s + 1)
    }, 850)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [step])

  const checked = items.filter(i => i.state === 'checked').length
  const progress = Math.round((checked / items.length) * 100)

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden flex flex-col">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/50 bg-muted/20 shrink-0">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
        <span className="h-2 w-2 rounded-full bg-green-400/70" />
        <span className="ml-2 text-xs text-muted-foreground/50 font-mono">release-checklist</span>
      </div>
      <div className="px-4 pt-3 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">{checked}/{items.length} complete</span>
          <span className="text-xs font-medium tabular-nums">{progress}%</span>
        </div>
        <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-green-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <ul className="px-3 pb-3 space-y-0.5" role="list">
        {items.map(item => (
          <li
            key={item.id}
            className={[
              'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors duration-200',
              activeId === item.id ? 'bg-accent' : '',
              item.state === 'checked' ? 'text-muted-foreground line-through decoration-muted-foreground/40' : '',
              item.state === 'invalid' ? 'text-red-500/80' : '',
              item.state === 'unchecked' ? 'text-foreground' : '',
            ].filter(Boolean).join(' ')}
          >
            <ItemIcon state={item.state} />
            <span className="truncate text-xs">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
