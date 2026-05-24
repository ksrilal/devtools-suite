'use client'

import { useState, useCallback, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  parseChecklistInput,
  transitionState,
  computeProgress,
  filterItems,
  encodeChecklistToURL,
  decodeChecklistFromURL,
  exportAsPlainText,
  exportAsMarkdown,
  exportAsCSV,
  type ChecklistItem,
} from '@/lib/tools/checklist'
import { localStorageGet, localStorageSet, downloadFile, copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader } from './tool-layout'
import { ChecklistPreviewPanel } from '@/components/home/checklist-preview'
import { PastePreview } from '@/components/home/paste-preview'
import { Button } from '@/components/ui/button'
import {
  Share2,
  Download,
  Trash2,
  CheckCheck,
  X,
  FileText,
  Search,
  RotateCcw,
  Pencil,
  Check,
  GripVertical,
  Plus,
  Copy,
} from 'lucide-react'

interface SortableItemProps {
  item: ChecklistItem
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  isFiltered: boolean
}

function SortableItem({ item, onToggle, onDelete, isFiltered }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: isFiltered,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 group rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors"
    >
      {/* Drag handle — hidden when filtering */}
      {!isFiltered && (
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground transition-all focus-visible:opacity-100 touch-none shrink-0"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}

      {/* Checkbox */}
      <button
        onClick={() => onToggle(item.id)}
        aria-label={`Toggle ${item.text} — current state: ${item.state}`}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          item.state === 'checked'
            ? 'bg-green-500 border-green-500 text-white'
            : item.state === 'invalid'
              ? 'bg-red-500/20 border-red-500 text-red-500'
              : 'border-input hover:border-primary'
        }`}
      >
        {item.state === 'checked' && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {item.state === 'invalid' && <X className="w-3 h-3" aria-hidden="true" />}
      </button>

      {/* Text */}
      <span
        className={`flex-1 text-sm ${
          item.state === 'checked'
            ? 'line-through text-muted-foreground'
            : item.state === 'invalid'
              ? 'line-through text-red-500/70'
              : ''
        }`}
      >
        {item.text}
      </span>

      {/* Copy */}
      <button
        onClick={() => void copyToClipboard(item.text)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-all focus-visible:opacity-100 shrink-0"
        aria-label={`Copy ${item.text}`}
      >
        <Copy className="h-3.5 w-3.5" />
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all focus-visible:opacity-100 shrink-0"
        aria-label={`Delete ${item.text}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </li>
  )
}

const STORAGE_KEY = 'devtools_checklist_v1'
const TITLE_KEY = 'devtools_checklist_title'

type ExportFormat = 'text' | 'markdown' | 'csv'

function ChecklistToolInner() {
  const searchParams = useSearchParams()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const [input, setInput] = useState('')
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [filter, setFilter] = useState('')
  const [shareToast, setShareToast] = useState(false)
  const [title, setTitle] = useState('My Checklist')
  const [editingTitle, setEditingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const titleLoaded = useRef(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load from URL param or localStorage on mount
  useEffect(() => {
    const urlData = searchParams.get('c')
    if (urlData) {
      const decoded = decodeChecklistFromURL(urlData)
      if (decoded?.length) {
        setItems(decoded)
        return
      }
    }
    const saved = localStorageGet<ChecklistItem[]>(STORAGE_KEY, [])
    if (saved.length) setItems(saved)
    const savedTitle = localStorageGet<string>(TITLE_KEY, '')
    if (savedTitle) setTitle(savedTitle)
  }, [searchParams])

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) localStorageSet(STORAGE_KEY, items)
  }, [items])

  // Persist title — skip the initial mount render to avoid overwriting the loaded value
  useEffect(() => {
    if (!titleLoaded.current) { titleLoaded.current = true; return }
    localStorageSet(TITLE_KEY, title)
  }, [title])

  // Focus title input when edit mode activates
  useEffect(() => {
    if (editingTitle) titleInputRef.current?.focus()
  }, [editingTitle])

  const handleParse = useCallback(() => {
    if (!input.trim()) return
    const parsed = parseChecklistInput(input)
    setItems(parsed)
    setInput('')
  }, [input])

  const handleToggle = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, state: transitionState(item.state) } : item
      )
    )
  }, [])

  const handleDelete = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const handleClear = useCallback(() => {
    setItems([])
    setTitle('My Checklist')
    localStorageSet(STORAGE_KEY, [])
    localStorageSet(TITLE_KEY, 'My Checklist')
  }, [])

  const handleCheckAll = useCallback(() => {
    setItems((prev) => prev.map((item) => ({ ...item, state: 'checked' as const })))
  }, [])

  const handleShare = useCallback(async () => {
    const encoded = encodeChecklistToURL(items)
    const url = `${window.location.origin}/checklist?c=${encoded}`
    await copyToClipboard(url)
    setShareToast(true)
    setTimeout(() => setShareToast(false), 2500)
  }, [items])

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      const slug = (title || 'checklist').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      if (format === 'text') {
        downloadFile(exportAsPlainText(items), `${slug}.txt`)
      } else if (format === 'markdown') {
        downloadFile(exportAsMarkdown(items), `${slug}.md`, 'text/markdown')
      } else if (format === 'csv') {
        downloadFile(exportAsCSV(items), `${slug}.csv`, 'text/csv')
      } else {
        // PDF — dynamically import jspdf
        const { jsPDF } = await import('jspdf')
        const doc = new jsPDF()

        // Title
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text(title || 'Checklist', 20, 22)

        // Summary line
        const checkedCount = items.filter(i => i.state === 'checked').length
        const invalidCount = items.filter(i => i.state === 'invalid').length
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(120, 120, 120)
        doc.text(`${checkedCount} of ${items.length} done  ·  ${invalidCount} invalid`, 20, 30)
        doc.setTextColor(0, 0, 0)

        // Divider
        doc.setDrawColor(220, 220, 220)
        doc.line(20, 34, 190, 34)

        doc.setFontSize(11)
        let y = 44

        for (const item of items) {
          if (y > 275) { doc.addPage(); y = 20 }

          // Draw checkbox square
          const boxX = 20
          const boxY = y - 4
          doc.setDrawColor(160, 160, 160)
          doc.setFillColor(255, 255, 255)

          if (item.state === 'checked') {
            doc.setFillColor(34, 197, 94)   // green
            doc.setDrawColor(34, 197, 94)
          } else if (item.state === 'invalid') {
            doc.setFillColor(239, 68, 68)   // red
            doc.setDrawColor(239, 68, 68)
          }

          doc.roundedRect(boxX, boxY, 5, 5, 0.8, 0.8, 'FD')

          // Checkmark or X inside box — draw as lines, not text, to avoid font issues
          if (item.state === 'checked') {
            doc.setDrawColor(255, 255, 255)
            doc.setLineWidth(0.8)
            // Tick: short stroke up-left then long stroke up-right
            doc.line(boxX + 1.2, boxY + 2.8, boxX + 2.2, boxY + 3.9)
            doc.line(boxX + 2.2, boxY + 3.9, boxX + 4.0, boxY + 1.5)
            doc.setLineWidth(0.2)
          } else if (item.state === 'invalid') {
            doc.setDrawColor(255, 255, 255)
            doc.setLineWidth(0.8)
            // X: two diagonal lines
            doc.line(boxX + 1.3, boxY + 1.3, boxX + 3.7, boxY + 3.7)
            doc.line(boxX + 3.7, boxY + 1.3, boxX + 1.3, boxY + 3.7)
            doc.setLineWidth(0.2)
          }

          // Item text
          doc.setFontSize(11)
          doc.setFont('helvetica', item.state === 'checked' ? 'normal' : 'normal')

          if (item.state === 'checked') {
            doc.setTextColor(150, 150, 150)
          } else if (item.state === 'invalid') {
            doc.setTextColor(200, 80, 80)
          } else {
            doc.setTextColor(30, 30, 30)
          }

          const lines = doc.splitTextToSize(item.text, 155) as string[]
          doc.text(lines, 30, y)
          doc.setTextColor(0, 0, 0)

          y += Math.max(lines.length * 7, 9)
        }

        doc.save(`${slug}.pdf`)
      }
    },
    [items, title]
  )

  const [newItemText, setNewItemText] = useState('')
  const newItemRef = useRef<HTMLInputElement>(null)

  const handleAddItem = useCallback(() => {
    const text = newItemText.trim()
    if (!text) return
    setItems((prev) => [...prev, { id: `item-${Date.now()}`, text, state: 'unchecked' }])
    setNewItemText('')
    newItemRef.current?.focus()
  }, [newItemText])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id)
      const newIndex = prev.findIndex((i) => i.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }, [])

  const progress = computeProgress(items)
  const visible = filterItems(items, filter)
  const isFiltered = filter.trim().length > 0

  const sidebar = items.length === 0 ? (
    <div className="sticky top-20 flex flex-col gap-3">
      <PastePreview />
      <ChecklistPreviewPanel />
    </div>
  ) : undefined

  return (
    <ToolLayout sidebar={sidebar}>
      <ToolHeader
        title="Smart Checklist"
        description="Paste any list to create an interactive, shareable checklist."
        toolbar={
          items.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleCheckAll}>
                <CheckCheck className="h-3.5 w-3.5 mr-1" />
                Check All
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-3.5 w-3.5 mr-1" />
                {shareToast ? 'Copied!' : 'Share'}
              </Button>
              <div className="relative group">
                <Button variant="outline" size="sm">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Export
                </Button>
                <div className="absolute right-0 top-full mt-1 hidden group-hover:flex group-focus-within:flex flex-col bg-popover border rounded-md shadow-lg z-10 min-w-32 py-1">
                  {(['pdf', 'text', 'markdown', 'csv'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() =>
                        fmt === 'pdf' ? handleExport(fmt as never) : handleExport(fmt)
                      }
                      className="px-4 py-2 text-sm text-left hover:bg-accent transition-colors capitalize"
                    >
                      {fmt === 'pdf' ? 'PDF' : fmt.charAt(0).toUpperCase() + fmt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            </div>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <div className="space-y-3">
          <label htmlFor="checklist-input" className="text-sm font-medium">
            Paste your list
          </label>
          <textarea
            id="checklist-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your list here — one item per line, comma or tab separated:\n\nDeploy database migrations\nRun smoke tests\nUpdate release notes\nNotify stakeholders`}
            className="w-full h-48 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) handleParse()
            }}
          />
          <Button onClick={handleParse} disabled={!input.trim()} className="w-full sm:w-auto">
            <FileText className="h-4 w-4 mr-2" />
            Create Checklist
          </Button>
          <p className="text-xs text-muted-foreground">Tip: Press Ctrl+Enter to create</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Editable title */}
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <>
                <input
                  ref={titleInputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') setEditingTitle(false)
                  }}
                  placeholder="Checklist title..."
                  aria-label="Checklist title"
                  className="text-xl font-bold bg-transparent border-b border-border focus:border-primary outline-none focus:outline-none text-foreground placeholder:text-muted-foreground/40 px-0 flex-1"
                />
                <button
                  onClick={() => setEditingTitle(false)}
                  aria-label="Save title"
                  className="p-1 rounded-md text-green-500 hover:bg-accent transition-colors shrink-0"
                >
                  <Check className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">{title || 'My Checklist'}</h2>
                <button
                  onClick={() => setEditingTitle(true)}
                  aria-label="Edit title"
                  className="p-1 rounded-md text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent transition-colors shrink-0"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {progress.checked} of {progress.total} done
                {progress.invalid > 0 && ` · ${progress.invalid} invalid`}
              </span>
              <span className="font-medium">{progress.percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden" role="progressbar" aria-valuenow={progress.percent} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-full rounded-full bg-primary transition-all duration-300 motion-safe:transition-all"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>

          {/* Filter */}
          {items.length > 5 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Filter items..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Filter checklist items"
              />
            </div>
          )}

          {/* Items */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-1" aria-label="Checklist items">
                {visible.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    isFiltered={isFiltered}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          {filter && visible.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No items match your filter.</p>
          )}

          {/* Add item */}
          <div className="flex gap-2 pt-2 border-t">
            <input
              ref={newItemRef}
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddItem() }}
              placeholder="Add an item..."
              aria-label="Add new checklist item"
              className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            />
            <Button size="sm" onClick={handleAddItem} disabled={!newItemText.trim()}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          </div>

          {/* Reset to input */}
          <div>
            <Button variant="ghost" size="sm" onClick={() => { setItems([]); setInput('') }}>
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Start over
            </Button>
          </div>
        </div>
      )}

    </ToolLayout>
  )
}

export function ChecklistTool() {
  return (
    <Suspense>
      <ChecklistToolInner />
    </Suspense>
  )
}
