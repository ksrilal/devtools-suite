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
import {
  type AdvancedItem,
  newId,
  addTopLevelItem,
  addChild,
  deleteItem,
  editItem,
  toggleItem,
  indentItem,
  outdentItem,
  toggleCollapse,
  setAllCollapsed,
  descendantsOf,
  visibleItems,
  childrenOf,
  prevSiblingExists,
  computeOverallProgress,
  computeItemProgress,
  parseAdvancedInput,
  encodeAdvancedToURL,
  decodeAdvancedFromURL,
  exportAdvancedAsMarkdown,
  exportAdvancedAsPlainText,
  exportAdvancedAsJSON,
  exportAdvancedAsCSV,
} from '@/lib/tools/checklist-advanced'
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
  ChevronRight,
  ChevronDown,
  IndentIncrease,
  IndentDecrease,
  Layers,
  List,
} from 'lucide-react'

// ─── Simple mode: SortableItem with inline editing ────────────────────────────

interface SortableItemProps {
  item: ChecklistItem
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
  isFiltered: boolean
}

function SortableItem({ item, onToggle, onDelete, onEdit, isFiltered }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: isFiltered,
  })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  const saveEdit = useCallback(() => {
    const trimmed = draft.trim()
    if (trimmed) onEdit(item.id, trimmed)
    else setDraft(item.text)
    setEditing(false)
  }, [draft, item.id, item.text, onEdit])

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

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit()
            if (e.key === 'Escape') { setDraft(item.text); setEditing(false) }
          }}
          onBlur={saveEdit}
          className="flex-1 text-sm bg-transparent border-b border-primary outline-none px-0"
          aria-label="Edit item"
        />
      ) : (
        <span
          onDoubleClick={() => { setDraft(item.text); setEditing(true) }}
          className={`flex-1 text-sm cursor-default ${
            item.state === 'checked'
              ? 'line-through text-muted-foreground'
              : item.state === 'invalid'
                ? 'line-through text-red-500/70'
                : ''
          }`}
        >
          {item.text}
        </span>
      )}

      <button
        onClick={() => { setDraft(item.text); setEditing(true) }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-all focus-visible:opacity-100 shrink-0"
        aria-label={`Edit ${item.text}`}
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={() => void copyToClipboard(item.text)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-all focus-visible:opacity-100 shrink-0"
        aria-label={`Copy ${item.text}`}
      >
        <Copy className="h-3.5 w-3.5" />
      </button>

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

// ─── Advanced mode: sortable tree item ────────────────────────────────────────

interface AdvancedItemRowProps {
  item: AdvancedItem
  allItems: AdvancedItem[]
  isFiltered: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
  onAddChild: (id: string) => void
  onIndent: (id: string) => void
  onOutdent: (id: string) => void
  onCollapse: (id: string) => void
  focusId: string | null
  onFocusDone: () => void
}

function AdvancedItemRow({
  item,
  allItems,
  isFiltered,
  onToggle,
  onDelete,
  onEdit,
  onAddChild,
  onIndent,
  onOutdent,
  onCollapse,
  focusId,
  onFocusDone,
}: AdvancedItemRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: isFiltered,
  })
  const [editing, setEditing] = useState(item.text === '')
  const [draft, setDraft] = useState(item.text)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus newly created empty items or items that need focus
  useEffect(() => {
    if (editing || focusId === item.id) {
      inputRef.current?.focus()
      if (focusId === item.id) onFocusDone()
    }
  }, [editing, focusId, item.id, onFocusDone])

  const saveEdit = useCallback(() => {
    const trimmed = draft.trim()
    if (trimmed) onEdit(item.id, trimmed)
    else setDraft(item.text || '')
    setEditing(false)
  }, [draft, item.id, item.text, onEdit])

  const hasChildren = childrenOf(allItems, item.id).length > 0
  const canIndent = item.depth < 2 && prevSiblingExists(allItems, item)
  const canOutdent = item.depth > 0
  const canAddChild = item.depth < 2
  const progress = hasChildren ? computeItemProgress(allItems, item.id) : null

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 20 : undefined,
  }

  // Indentation guide: left border per depth level
  const indentClass = item.depth === 1
    ? 'ml-6 border-l-2 border-border/40 pl-3'
    : item.depth === 2
      ? 'ml-12 border-l-2 border-border/20 pl-3'
      : ''

  const depthRingClass = item.depth === 0
    ? 'ring-1 ring-border/30 bg-background'
    : item.depth === 1
      ? 'bg-muted/20'
      : 'bg-muted/10'

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group rounded-lg ${indentClass} ${item.depth === 0 ? 'mt-2 first:mt-0' : 'mt-1'}`}
    >
      <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors ${depthRingClass}`}>
        {/* Drag handle */}
        {!isFiltered && (
          <button
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
            className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground transition-all focus-visible:opacity-100 touch-none shrink-0"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Collapse toggle (only when has children) */}
        {hasChildren ? (
          <button
            onClick={() => onCollapse(item.id)}
            aria-label={item.collapsed ? 'Expand' : 'Collapse'}
            className="shrink-0 p-0.5 rounded text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            {item.collapsed
              ? <ChevronRight className="h-3.5 w-3.5" />
              : <ChevronDown className="h-3.5 w-3.5" />
            }
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        {/* Checkbox */}
        <button
          onClick={() => onToggle(item.id)}
          aria-label={`Toggle ${item.text}`}
          className={`flex-shrink-0 w-4.5 h-4.5 w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            item.state === 'checked'
              ? 'bg-green-500 border-green-500 text-white'
              : item.state === 'invalid'
                ? 'bg-red-500/20 border-red-500 text-red-500'
                : 'border-input hover:border-primary'
          }`}
        >
          {item.state === 'checked' && (
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {item.state === 'invalid' && <X className="w-2.5 h-2.5" aria-hidden="true" />}
        </button>

        {/* Text / edit */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit()
                if (e.key === 'Escape') { setDraft(item.text); setEditing(false) }
              }}
              onBlur={saveEdit}
              placeholder="Item text..."
              className="w-full text-sm bg-transparent border-b border-primary outline-none px-0 placeholder:text-muted-foreground/40"
              aria-label="Edit item"
            />
          ) : (
            <div className="flex items-baseline gap-2">
              <span
                onDoubleClick={() => { setDraft(item.text); setEditing(true) }}
                className={`text-sm cursor-default truncate ${
                  item.state === 'checked'
                    ? 'line-through text-muted-foreground'
                    : item.state === 'invalid'
                      ? 'line-through text-red-500/70'
                      : item.depth === 0 ? 'font-medium' : ''
                }`}
              >
                {item.text || <span className="text-muted-foreground/40 italic">Empty item</span>}
              </span>
              {progress && (
                <span className="text-xs text-muted-foreground/60 shrink-0 tabular-nums">
                  {progress.checked}/{progress.total}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all shrink-0">
          {canIndent && (
            <button
              onClick={() => onIndent(item.id)}
              aria-label="Indent"
              title="Indent (make child of previous item)"
              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <IndentIncrease className="h-3.5 w-3.5" />
            </button>
          )}
          {canOutdent && (
            <button
              onClick={() => onOutdent(item.id)}
              aria-label="Outdent"
              title="Outdent (promote to parent level)"
              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <IndentDecrease className="h-3.5 w-3.5" />
            </button>
          )}
          {canAddChild && (
            <button
              onClick={() => onAddChild(item.id)}
              aria-label="Add child item"
              title="Add child item"
              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => { setDraft(item.text); setEditing(true) }}
            aria-label="Edit"
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => void copyToClipboard(item.text)}
            aria-label="Copy"
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            aria-label="Delete"
            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </li>
  )
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'devtools_checklist_v1'
const TITLE_KEY = 'devtools_checklist_title'
const ADVANCED_STORAGE_KEY = 'devtools_checklist_advanced_v1'
const ADVANCED_TITLE_KEY = 'devtools_checklist_advanced_title'
const MODE_KEY = 'devtools_checklist_mode'

type ExportFormat = 'text' | 'markdown' | 'csv'
type AdvancedExportFormat = 'markdown' | 'text' | 'json' | 'csv' | 'pdf'
type ChecklistMode = 'simple' | 'advanced'

// ─── Main component ───────────────────────────────────────────────────────────

function ChecklistToolInner() {
  const searchParams = useSearchParams()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // ── Mode ──────────────────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<ChecklistMode>('simple')

  // ── Simple mode state ─────────────────────────────────────────────────────
  const [input, setInput] = useState('')
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [filter, setFilter] = useState('')
  const [shareToast, setShareToast] = useState(false)
  const [title, setTitle] = useState('My Checklist')
  const [editingTitle, setEditingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const titleLoaded = useRef(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [newItemText, setNewItemText] = useState('')
  const newItemRef = useRef<HTMLInputElement>(null)

  // ── Advanced mode state ───────────────────────────────────────────────────
  const [advItems, setAdvItems] = useState<AdvancedItem[]>([])
  const [advTitle, setAdvTitle] = useState('My Checklist')
  const [editingAdvTitle, setEditingAdvTitle] = useState(false)
  const advTitleInputRef = useRef<HTMLInputElement>(null)
  const advTitleLoaded = useRef(false)
  const [advNewText, setAdvNewText] = useState('')
  const advNewRef = useRef<HTMLInputElement>(null)
  const [advFocusId, setAdvFocusId] = useState<string | null>(null)
  const [advShareToast, setAdvShareToast] = useState(false)

  // ── Load on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    const savedMode = localStorageGet<ChecklistMode>(MODE_KEY, 'simple')
    setMode(savedMode)
    setMounted(true)

    // Simple
    const urlData = searchParams.get('c')
    if (urlData) {
      const decoded = decodeChecklistFromURL(urlData)
      if (decoded?.length) { setItems(decoded); return }
    }
    const saved = localStorageGet<ChecklistItem[]>(STORAGE_KEY, [])
    if (saved.length) setItems(saved)
    const savedTitle = localStorageGet<string>(TITLE_KEY, '')
    if (savedTitle) setTitle(savedTitle)

    // Advanced
    const advUrlData = searchParams.get('a')
    if (advUrlData) {
      const decoded = decodeAdvancedFromURL(advUrlData)
      if (decoded?.length) { setAdvItems(decoded); return }
    }
    const savedAdv = localStorageGet<AdvancedItem[]>(ADVANCED_STORAGE_KEY, [])
    if (savedAdv.length) setAdvItems(savedAdv)
    const savedAdvTitle = localStorageGet<string>(ADVANCED_TITLE_KEY, '')
    if (savedAdvTitle) setAdvTitle(savedAdvTitle)
  }, [searchParams])

  // ── Persist simple ────────────────────────────────────────────────────────
  useEffect(() => {
    if (items.length > 0) localStorageSet(STORAGE_KEY, items)
  }, [items])
  useEffect(() => {
    if (!titleLoaded.current) { titleLoaded.current = true; return }
    localStorageSet(TITLE_KEY, title)
  }, [title])

  // ── Persist advanced ──────────────────────────────────────────────────────
  useEffect(() => {
    if (advItems.length > 0) localStorageSet(ADVANCED_STORAGE_KEY, advItems)
  }, [advItems])
  useEffect(() => {
    if (!advTitleLoaded.current) { advTitleLoaded.current = true; return }
    localStorageSet(ADVANCED_TITLE_KEY, advTitle)
  }, [advTitle])

  // ── Persist mode (skip initial render so we don't overwrite before load) ──
  const modeLoaded = useRef(false)
  useEffect(() => {
    if (!modeLoaded.current) { modeLoaded.current = true; return }
    localStorageSet(MODE_KEY, mode)
  }, [mode])

  // ── Focus title inputs ────────────────────────────────────────────────────
  useEffect(() => { if (editingTitle) titleInputRef.current?.focus() }, [editingTitle])
  useEffect(() => { if (editingAdvTitle) advTitleInputRef.current?.focus() }, [editingAdvTitle])

  // ── Simple mode handlers ──────────────────────────────────────────────────
  const handleParse = useCallback(() => {
    if (!input.trim()) return
    const parsed = parseChecklistInput(input)
    setItems(parsed)
    setInput('')
  }, [input])

  const handleToggle = useCallback((id: string) => {
    setItems((prev) => prev.map((item) =>
      item.id === id ? { ...item, state: transitionState(item.state) } : item
    ))
  }, [])

  const handleDelete = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const handleEditSimple = useCallback((id: string, text: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, text } : item))
  }, [])

  const handleClear = useCallback(() => {
    setItems([]); setTitle('My Checklist')
    localStorageSet(STORAGE_KEY, []); localStorageSet(TITLE_KEY, 'My Checklist')
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

  const handleExport = useCallback(async (format: ExportFormat) => {
    const slug = (title || 'checklist').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (format === 'text') {
      downloadFile(exportAsPlainText(items), `${slug}.txt`)
    } else if (format === 'markdown') {
      downloadFile(exportAsMarkdown(items), `${slug}.md`, 'text/markdown')
    } else if (format === 'csv') {
      downloadFile(exportAsCSV(items), `${slug}.csv`, 'text/csv')
    } else {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      doc.setFontSize(18); doc.setFont('helvetica', 'bold')
      doc.text(title || 'Checklist', 20, 22)
      const checkedCount = items.filter(i => i.state === 'checked').length
      const invalidCount = items.filter(i => i.state === 'invalid').length
      doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120)
      doc.text(`${checkedCount} of ${items.length} done  ·  ${invalidCount} invalid`, 20, 30)
      doc.setTextColor(0, 0, 0); doc.setDrawColor(220, 220, 220); doc.line(20, 34, 190, 34)
      doc.setFontSize(11); let y = 44
      for (const item of items) {
        if (y > 275) { doc.addPage(); y = 20 }
        const boxX = 20, boxY = y - 4
        doc.setDrawColor(160, 160, 160); doc.setFillColor(255, 255, 255)
        if (item.state === 'checked') { doc.setFillColor(34, 197, 94); doc.setDrawColor(34, 197, 94) }
        else if (item.state === 'invalid') { doc.setFillColor(239, 68, 68); doc.setDrawColor(239, 68, 68) }
        doc.roundedRect(boxX, boxY, 5, 5, 0.8, 0.8, 'FD')
        if (item.state === 'checked') {
          doc.setDrawColor(255, 255, 255); doc.setLineWidth(0.8)
          doc.line(boxX + 1.2, boxY + 2.8, boxX + 2.2, boxY + 3.9)
          doc.line(boxX + 2.2, boxY + 3.9, boxX + 4.0, boxY + 1.5)
          doc.setLineWidth(0.2)
        } else if (item.state === 'invalid') {
          doc.setDrawColor(255, 255, 255); doc.setLineWidth(0.8)
          doc.line(boxX + 1.3, boxY + 1.3, boxX + 3.7, boxY + 3.7)
          doc.line(boxX + 3.7, boxY + 1.3, boxX + 1.3, boxY + 3.7)
          doc.setLineWidth(0.2)
        }
        doc.setFontSize(11)
        if (item.state === 'checked') doc.setTextColor(150, 150, 150)
        else if (item.state === 'invalid') doc.setTextColor(200, 80, 80)
        else doc.setTextColor(30, 30, 30)
        const lines = doc.splitTextToSize(item.text, 155) as string[]
        doc.text(lines, 30, y); doc.setTextColor(0, 0, 0)
        y += Math.max(lines.length * 7, 9)
      }
      doc.save(`${slug}.pdf`)
    }
  }, [items, title])

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

  // ── Advanced mode handlers ────────────────────────────────────────────────
  const handleAdvParse = useCallback(() => {
    if (!input.trim()) return
    setAdvItems(parseAdvancedInput(input))
    setInput('')
  }, [input])

  const handleAdvToggle = useCallback((id: string) => {
    setAdvItems((prev) => toggleItem(prev, id))
  }, [])

  const handleAdvDelete = useCallback((id: string) => {
    setAdvItems((prev) => deleteItem(prev, id))
  }, [])

  const handleAdvEdit = useCallback((id: string, text: string) => {
    setAdvItems((prev) => editItem(prev, id, text))
  }, [])

  const handleAdvAddChild = useCallback((parentId: string) => {
    setAdvItems((prev) => {
      const next = addChild(prev, parentId)
      const newItem = next.find((i) => i.parentId === parentId && i.text === '')
      if (newItem) setAdvFocusId(newItem.id)
      return next
    })
  }, [])

  const handleAdvIndent = useCallback((id: string) => {
    setAdvItems((prev) => indentItem(prev, id))
  }, [])

  const handleAdvOutdent = useCallback((id: string) => {
    setAdvItems((prev) => outdentItem(prev, id))
  }, [])

  const handleAdvCollapse = useCallback((id: string) => {
    setAdvItems((prev) => toggleCollapse(prev, id))
  }, [])

  const handleAdvCollapseAll = useCallback(() => {
    setAdvItems((prev) => setAllCollapsed(prev, true))
  }, [])

  const handleAdvExpandAll = useCallback(() => {
    setAdvItems((prev) => setAllCollapsed(prev, false))
  }, [])

  const handleAdvClear = useCallback(() => {
    setAdvItems([]); setAdvTitle('My Checklist')
    localStorageSet(ADVANCED_STORAGE_KEY, [])
    localStorageSet(ADVANCED_TITLE_KEY, 'My Checklist')
  }, [])

  const handleAdvCheckAll = useCallback(() => {
    setAdvItems((prev) => prev.map((i) => ({ ...i, state: 'checked' as const })))
  }, [])

  const handleAdvAddItem = useCallback(() => {
    const text = advNewText.trim()
    if (!text) return
    setAdvItems((prev) => addTopLevelItem(prev, text))
    setAdvNewText('')
    advNewRef.current?.focus()
  }, [advNewText])

  const handleAdvDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setAdvItems((prev) => {
      const activeItem = prev.find((i) => i.id === active.id)
      const overItem = prev.find((i) => i.id === over.id)
      if (!activeItem || !overItem) return prev
      if (activeItem.parentId !== overItem.parentId) return prev

      // Build blocks: each sibling + its descendants form one moveable unit
      const siblings = prev.filter((i) => i.parentId === activeItem.parentId)
      type Block = { head: AdvancedItem; all: AdvancedItem[] }
      const blocks: Block[] = siblings.map((sib) => ({
        head: sib,
        all: [sib, ...descendantsOf(prev, sib.id)],
      }))

      const activeBlockIdx = blocks.findIndex((b) => b.head.id === activeItem.id)
      const overBlockIdx = blocks.findIndex((b) => b.head.id === overItem.id)
      if (activeBlockIdx === -1 || overBlockIdx === -1) return prev

      const reordered = arrayMove(blocks, activeBlockIdx, overBlockIdx)

      // Reconstruct full array: non-sibling items stay, sibling blocks replace their slice
      const allSiblingAndDescIds = new Set(
        blocks.flatMap((b) => b.all.map((i) => i.id))
      )
      const reorderedFlat = reordered.flatMap((b) => b.all)

      // Replace the contiguous sibling+desc region with reordered version
      const result: AdvancedItem[] = []
      let inserted = false
      for (const item of prev) {
        if (allSiblingAndDescIds.has(item.id)) {
          if (!inserted) {
            result.push(...reorderedFlat)
            inserted = true
          }
        } else {
          result.push(item)
        }
      }
      return result
    })
  }, [])

  const handleAdvShare = useCallback(async () => {
    const encoded = encodeAdvancedToURL(advItems)
    const url = `${window.location.origin}/checklist?a=${encoded}`
    await copyToClipboard(url)
    setAdvShareToast(true)
    setTimeout(() => setAdvShareToast(false), 2500)
  }, [advItems])

  const handleAdvExport = useCallback(async (format: AdvancedExportFormat) => {
    const slug = (advTitle || 'checklist').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (format === 'markdown') {
      downloadFile(exportAdvancedAsMarkdown(advItems), `${slug}.md`, 'text/markdown')
    } else if (format === 'text') {
      downloadFile(exportAdvancedAsPlainText(advItems), `${slug}.txt`)
    } else if (format === 'json') {
      downloadFile(exportAdvancedAsJSON(advItems), `${slug}.json`, 'application/json')
    } else if (format === 'csv') {
      downloadFile(exportAdvancedAsCSV(advItems), `${slug}.csv`, 'text/csv')
    } else if (format === 'pdf') {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      const advProgress = computeOverallProgress(advItems)
      doc.setFontSize(18); doc.setFont('helvetica', 'bold')
      doc.text(advTitle || 'Checklist', 20, 22)
      doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120)
      doc.text(`${advProgress.checked} of ${advProgress.total} done`, 20, 30)
      doc.setTextColor(0, 0, 0); doc.setDrawColor(220, 220, 220); doc.line(20, 34, 190, 34)
      doc.setFontSize(11); let y = 44
      for (const item of advItems) {
        if (y > 275) { doc.addPage(); y = 20 }
        const indentX = 20 + item.depth * 8
        const boxY = y - 4
        doc.setDrawColor(160, 160, 160); doc.setFillColor(255, 255, 255)
        if (item.state === 'checked') { doc.setFillColor(34, 197, 94); doc.setDrawColor(34, 197, 94) }
        else if (item.state === 'invalid') { doc.setFillColor(239, 68, 68); doc.setDrawColor(239, 68, 68) }
        doc.roundedRect(indentX, boxY, 5, 5, 0.8, 0.8, 'FD')
        if (item.state === 'checked') {
          doc.setDrawColor(255, 255, 255); doc.setLineWidth(0.8)
          doc.line(indentX + 1.2, boxY + 2.8, indentX + 2.2, boxY + 3.9)
          doc.line(indentX + 2.2, boxY + 3.9, indentX + 4.0, boxY + 1.5)
          doc.setLineWidth(0.2)
        } else if (item.state === 'invalid') {
          doc.setDrawColor(255, 255, 255); doc.setLineWidth(0.8)
          doc.line(indentX + 1.3, boxY + 1.3, indentX + 3.7, boxY + 3.7)
          doc.line(indentX + 3.7, boxY + 1.3, indentX + 1.3, boxY + 3.7)
          doc.setLineWidth(0.2)
        }
        if (item.state === 'checked') doc.setTextColor(150, 150, 150)
        else if (item.state === 'invalid') doc.setTextColor(200, 80, 80)
        else doc.setTextColor(30, 30, 30)
        const textX = indentX + 8
        const maxWidth = 190 - textX
        const lines = doc.splitTextToSize(item.text, maxWidth) as string[]
        doc.text(lines, textX, y); doc.setTextColor(0, 0, 0)
        y += Math.max(lines.length * 7, 9)
      }
      doc.save(`${slug}.pdf`)
    }
  }, [advItems, advTitle])

  // ── Derived values ────────────────────────────────────────────────────────
  const progress = computeProgress(items)
  const visible = filterItems(items, filter)
  const isFiltered = filter.trim().length > 0

  const advProgress = computeOverallProgress(advItems)
  const advVisible = visibleItems(advItems)

  const hasSimpleItems = items.length > 0
  const hasAdvItems = advItems.length > 0

  const sidebar = (mode === 'simple' ? !hasSimpleItems : !hasAdvItems) ? (
    <div className="sticky top-20 flex flex-col gap-3">
      <PastePreview />
      <ChecklistPreviewPanel />
    </div>
  ) : undefined

  // ── Mode switcher toolbar ────────────────────────────────────────────────
  const modeToolbar = (
    <div className="flex items-center gap-1 rounded-lg border border-border/50 p-0.5 bg-muted/30">
      <button
        onClick={() => setMode('simple')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
          mode === 'simple' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-pressed={mode === 'simple'}
      >
        <List className="h-3.5 w-3.5" />
        Simple
      </button>
      <button
        onClick={() => setMode('advanced')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
          mode === 'advanced' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-pressed={mode === 'advanced'}
      >
        <Layers className="h-3.5 w-3.5" />
        Advanced
      </button>
    </div>
  )

  // ═══════════════════════════════════════════════════════════════════════════
  // SIMPLE MODE RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const simpleToolbar = hasSimpleItems ? (
    <div className="flex flex-wrap items-center gap-2">
      {modeToolbar}
      <Button variant="outline" size="sm" onClick={handleCheckAll}>
        <CheckCheck className="h-3.5 w-3.5 mr-1" />Check All
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-3.5 w-3.5 mr-1" />{shareToast ? 'Copied!' : 'Share'}
      </Button>
      <div className="relative group">
        <Button variant="outline" size="sm">
          <Download className="h-3.5 w-3.5 mr-1" />Export
        </Button>
        <div className="absolute right-0 top-full mt-1 hidden group-hover:flex group-focus-within:flex flex-col bg-popover border rounded-md shadow-lg z-10 min-w-32 py-1">
          {(['pdf', 'text', 'markdown', 'csv'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => fmt === 'pdf' ? handleExport(fmt as never) : handleExport(fmt)}
              className="px-4 py-2 text-sm text-left hover:bg-accent transition-colors capitalize"
            >
              {fmt === 'pdf' ? 'PDF' : fmt.charAt(0).toUpperCase() + fmt.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive">
        <Trash2 className="h-3.5 w-3.5 mr-1" />Clear
      </Button>
    </div>
  ) : undefined

  // ═══════════════════════════════════════════════════════════════════════════
  // ADVANCED MODE RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const advToolbar = hasAdvItems ? (
    <div className="flex flex-wrap items-center gap-2">
      {modeToolbar}
      <Button variant="outline" size="sm" onClick={handleAdvCheckAll}>
        <CheckCheck className="h-3.5 w-3.5 mr-1" />Check All
      </Button>
      <Button variant="outline" size="sm" onClick={handleAdvCollapseAll}>
        <ChevronRight className="h-3.5 w-3.5 mr-1" />Collapse All
      </Button>
      <Button variant="outline" size="sm" onClick={handleAdvExpandAll}>
        <ChevronDown className="h-3.5 w-3.5 mr-1" />Expand All
      </Button>
      <Button variant="outline" size="sm" onClick={handleAdvShare}>
        <Share2 className="h-3.5 w-3.5 mr-1" />{advShareToast ? 'Copied!' : 'Share'}
      </Button>
      <div className="relative group">
        <Button variant="outline" size="sm">
          <Download className="h-3.5 w-3.5 mr-1" />Export
        </Button>
        <div className="absolute right-0 top-full mt-1 hidden group-hover:flex group-focus-within:flex flex-col bg-popover border rounded-md shadow-lg z-10 min-w-32 py-1">
          {(['pdf', 'markdown', 'text', 'json', 'csv'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => void handleAdvExport(fmt)}
              className="px-4 py-2 text-sm text-left hover:bg-accent transition-colors capitalize"
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={handleAdvClear} className="text-destructive hover:text-destructive">
        <Trash2 className="h-3.5 w-3.5 mr-1" />Clear
      </Button>
    </div>
  ) : undefined

  return (
    <ToolLayout sidebar={sidebar}>
      <ToolHeader
        title="Smart Checklist"
        description="Paste any list to create an interactive, shareable checklist."
        toolbar={!mounted ? undefined : mode === 'simple' ? simpleToolbar : advToolbar}
      />

      {/* ── SIMPLE MODE ──────────────────────────────────────────────────── */}
      {mounted && mode === 'simple' && (
        <>
          {!hasSimpleItems && (
            <div className="mb-4 flex items-center justify-between">
              <span />
              {modeToolbar}
            </div>
          )}

          {!hasSimpleItems ? (
            <div className="space-y-3">
              <label htmlFor="checklist-input" className="text-sm font-medium">Paste your list</label>
              <textarea
                id="checklist-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Paste your list here — one item per line, comma or tab separated:\n\nDeploy database migrations\nRun smoke tests\nUpdate release notes\nNotify stakeholders`}
                className="w-full h-48 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleParse() }}
              />
              <Button onClick={handleParse} disabled={!input.trim()} className="w-full sm:w-auto">
                <FileText className="h-4 w-4 mr-2" />Create Checklist
              </Button>
              <p className="text-xs text-muted-foreground">Tip: Press Ctrl+Enter to create</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Title */}
              <div className="flex items-center gap-2">
                {editingTitle ? (
                  <>
                    <input
                      ref={titleInputRef}
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingTitle(false) }}
                      placeholder="Checklist title..."
                      aria-label="Checklist title"
                      className="text-xl font-bold bg-transparent border-b border-border focus:border-primary outline-none text-foreground placeholder:text-muted-foreground/40 px-0 flex-1"
                    />
                    <button onClick={() => setEditingTitle(false)} aria-label="Save title" className="p-1 rounded-md text-green-500 hover:bg-accent transition-colors shrink-0">
                      <Check className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{title || 'My Checklist'}</h2>
                    <button onClick={() => setEditingTitle(true)} aria-label="Edit title" className="p-1 rounded-md text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent transition-colors shrink-0">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {progress.checked} of {progress.total} done
                    {progress.invalid > 0 && ` · ${progress.invalid} invalid`}
                  </span>
                  <span className="font-medium">{progress.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden" role="progressbar" aria-valuenow={progress.percent} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress.percent}%` }} />
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
                        onEdit={handleEditSimple}
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
                  <Plus className="h-3.5 w-3.5 mr-1" />Add
                </Button>
              </div>

              <div>
                <Button variant="ghost" size="sm" onClick={() => { setItems([]); setInput('') }}>
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />Start over
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── ADVANCED MODE ─────────────────────────────────────────────────── */}
      {mounted && mode === 'advanced' && (
        <>
          {!hasAdvItems && (
            <div className="mb-4 flex items-center justify-between">
              <span />
              {modeToolbar}
            </div>
          )}

          {!hasAdvItems ? (
            <div className="space-y-3">
              <label htmlFor="adv-checklist-input" className="text-sm font-medium">Paste your list</label>
              <textarea
                id="adv-checklist-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Paste a list — indent with 2 spaces for nested items:\n\nRelease v2.0\n  Database\n    Run migrations\n    Verify rollback\n  Deploy\n    Blue-green switch\nNotify stakeholders`}
                className="w-full h-52 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleAdvParse() }}
              />
              <div className="flex gap-2">
                <Button onClick={handleAdvParse} disabled={!input.trim()} className="w-full sm:w-auto">
                  <FileText className="h-4 w-4 mr-2" />Create Checklist
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAdvItems([{ id: newId(), text: 'New item', state: 'unchecked', depth: 0, parentId: null, collapsed: false }])
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />Start blank
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Tip: Indent with 2 spaces for child items (max 3 levels) · Ctrl+Enter to create</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Advanced title */}
              <div className="flex items-center gap-2">
                {editingAdvTitle ? (
                  <>
                    <input
                      ref={advTitleInputRef}
                      type="text"
                      value={advTitle}
                      onChange={(e) => setAdvTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingAdvTitle(false) }}
                      placeholder="Checklist title..."
                      aria-label="Checklist title"
                      className="text-xl font-bold bg-transparent border-b border-border focus:border-primary outline-none text-foreground placeholder:text-muted-foreground/40 px-0 flex-1"
                    />
                    <button onClick={() => setEditingAdvTitle(false)} aria-label="Save title" className="p-1 rounded-md text-green-500 hover:bg-accent transition-colors shrink-0">
                      <Check className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{advTitle || 'My Checklist'}</h2>
                    <button onClick={() => setEditingAdvTitle(true)} aria-label="Edit title" className="p-1 rounded-md text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent transition-colors shrink-0">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>

              {/* Overall progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{advProgress.checked} of {advProgress.total} done</span>
                  <span className="font-medium">{advProgress.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden" role="progressbar" aria-valuenow={advProgress.percent} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${advProgress.percent}%` }} />
                </div>
              </div>

              {/* Tree items */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAdvDragEnd}>
                <SortableContext items={advVisible.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  <ul className="space-y-0.5" aria-label="Advanced checklist items">
                    {advVisible.map((item) => (
                      <AdvancedItemRow
                        key={item.id}
                        item={item}
                        allItems={advItems}
                        isFiltered={false}
                        onToggle={handleAdvToggle}
                        onDelete={handleAdvDelete}
                        onEdit={handleAdvEdit}
                        onAddChild={handleAdvAddChild}
                        onIndent={handleAdvIndent}
                        onOutdent={handleAdvOutdent}
                        onCollapse={handleAdvCollapse}
                        focusId={advFocusId}
                        onFocusDone={() => setAdvFocusId(null)}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>

              {/* Add top-level item */}
              <div className="flex gap-2 pt-2 border-t">
                <input
                  ref={advNewRef}
                  type="text"
                  value={advNewText}
                  onChange={(e) => setAdvNewText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAdvAddItem() }}
                  placeholder="Add a top-level item..."
                  aria-label="Add new top-level item"
                  className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
                />
                <Button size="sm" onClick={handleAdvAddItem} disabled={!advNewText.trim()}>
                  <Plus className="h-3.5 w-3.5 mr-1" />Add
                </Button>
              </div>

              <div>
                <Button variant="ghost" size="sm" onClick={() => { setAdvItems([]); setInput('') }}>
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />Start over
                </Button>
              </div>
            </div>
          )}
        </>
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
