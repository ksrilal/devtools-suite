'use client'

import { useState, useEffect } from 'react'
import { CheckSquare, Square, XSquare, ChevronDown } from 'lucide-react'

type ItemState = 'unchecked' | 'checked' | 'invalid'
type Depth = 0 | 1 | 2

interface PreviewItem {
  id: number
  label: string
  state: ItemState
  depth: Depth
  progress?: string
}

const INITIAL_ITEMS: PreviewItem[] = [
  { id: 1, label: 'Backend',         state: 'unchecked', depth: 0, progress: '0/4' },
  { id: 2, label: 'API Gateway',     state: 'unchecked', depth: 1 },
  { id: 3, label: 'Deploy API',      state: 'unchecked', depth: 2 },
  { id: 4, label: 'Health check',    state: 'unchecked', depth: 2 },
  { id: 5, label: 'Database',        state: 'unchecked', depth: 1 },
  { id: 6, label: 'Run migrations',  state: 'unchecked', depth: 2 },
  { id: 7, label: 'Verify indexes',  state: 'unchecked', depth: 2 },
]

const SEQUENCE: Array<{ itemId: number; toState: ItemState }> = [
  { itemId: 3, toState: 'checked' },
  { itemId: 4, toState: 'checked' },
  { itemId: 6, toState: 'checked' },
  { itemId: 7, toState: 'checked' },
]

const INDENT_PX: Record<Depth, string> = { 0: '0px', 1: '16px', 2: '32px' }

function ItemIcon({ state }: { state: ItemState }) {
  if (state === 'checked') return <CheckSquare className="h-3.5 w-3.5 text-green-500 shrink-0" />
  if (state === 'invalid')  return <XSquare    className="h-3.5 w-3.5 text-red-500 shrink-0" />
  return                           <Square     className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
}

function updateProgress(items: PreviewItem[]): PreviewItem[] {
  return items.map(item => {
    if (item.depth !== 0) return item
    const idx = items.findIndex(i => i.id === item.id)
    const rest = items.slice(idx + 1)
    const nextParent = rest.findIndex(i => i.depth === 0)
    const group = nextParent === -1 ? rest : rest.slice(0, nextParent)
    const leaves = group.filter(i => i.depth === 2)
    const checked = leaves.filter(i => i.state === 'checked').length
    return { ...item, progress: `${checked}/${leaves.length}` }
  })
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
      setItems(prev => updateProgress(
        prev.map(i => i.id === entry.itemId ? { ...i, state: entry.toState } : i)
      ))
      setActiveId(null)
      setStep(s => s + 1)
    }, 850)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [step])

  const leaves = items.filter(i => i.depth === 2)
  const checked = leaves.filter(i => i.state === 'checked').length
  const progress = Math.round((checked / leaves.length) * 100)

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
          <span className="text-xs text-muted-foreground">{checked}/{leaves.length} complete</span>
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
            style={{ marginLeft: INDENT_PX[item.depth] }}
            className={[
              'flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors duration-200',
              activeId === item.id ? 'bg-accent' : '',
              item.state === 'checked' ? 'text-muted-foreground line-through decoration-muted-foreground/40' : '',
              item.state === 'invalid'  ? 'text-red-500/80' : '',
              item.state === 'unchecked' ? 'text-foreground' : '',
            ].filter(Boolean).join(' ')}
          >
            {item.depth === 0
              ? <ChevronDown className="h-3 w-3 text-muted-foreground/50 shrink-0" />
              : <span className="w-2 shrink-0" />
            }
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

// ── Paste preview for advanced mode ──────────────────────────────────────────

const ADV_DEMOS = [
  [
    'Backend',
    '  API Gateway',
    '    Deploy API',
    '    Health check',
    '  Database',
    '    Run migrations',
  ],
  [
    'Frontend',
    '  Build assets',
    '    Run webpack',
    '    Verify bundles',
    '  Deploy',
    '    Purge CDN cache',
  ],
  [
    'Release v3.0',
    '  Backend',
    '    Run migrations',
    '  Frontend',
    '    Build assets',
    '  Notify team',
  ],
]

function lineColor(line: string): string {
  const trimmed = line.trimStart()
  const spaces = line.length - trimmed.length
  if (spaces === 0) return 'text-foreground font-medium'
  if (spaces === 2) return 'text-foreground/75'
  return 'text-foreground/50'
}

export function AdvancedPastePreview() {
  const [demoIndex, setDemoIndex] = useState(0)
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [fading, setFading] = useState(false)

  const demo = ADV_DEMOS[demoIndex] ?? ADV_DEMOS[0]

  useEffect(() => {
    setVisibleLines([])
    setFading(false)
  }, [demoIndex])

  useEffect(() => {
    if (!demo) return
    if (visibleLines.length < demo.length) {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, demo[prev.length] ?? ''])
      }, 300)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setFading(true), 1800)
    return () => clearTimeout(t)
  }, [visibleLines, demo])

  useEffect(() => {
    if (!fading) return
    const t = setTimeout(() => {
      setDemoIndex(i => (i + 1) % ADV_DEMOS.length)
    }, 400)
    return () => clearTimeout(t)
  }, [fading])

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/50 bg-muted/20">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
        <span className="h-2 w-2 rounded-full bg-green-400/70" />
        <span className="ml-2 text-xs text-muted-foreground/50 font-mono">paste your list</span>
        <span className="ml-auto text-[10px] text-muted-foreground/40 italic">indent = 2 spaces</span>
      </div>
      <div
        className={[
          'px-4 py-3 h-[120px] font-mono text-xs leading-6 transition-opacity duration-300',
          fading ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
        aria-hidden="true"
      >
        {visibleLines.map((line, i) => (
          <div key={i} className={`whitespace-pre ${lineColor(line)}`}>
            {line}
            {i === visibleLines.length - 1 && !fading && (
              <span className="inline-block w-0.5 h-3.5 bg-foreground/60 animate-pulse ml-0.5 translate-y-px" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
