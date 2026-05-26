'use client'

import { useEffect, useState, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  KeyboardSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  transitionState, computeProgress,
  filterItems, encodeChecklistToURL, decodeChecklistFromURL,
  exportAsPlainText, exportAsMarkdown, exportAsCSV,
  type ChecklistItem,
} from '@/lib/tools/checklist'
import {
  type AdvancedItem, newId, addTopLevelItem, addChild,
  deleteItem, editItem, toggleItem, indentItem, outdentItem,
  toggleCollapse, setAllCollapsed, descendantsOf, visibleItems,
  childrenOf, prevSiblingExists, computeOverallProgress,
  computeItemProgress, encodeAdvancedToURL,
  decodeAdvancedFromURL, exportAdvancedAsMarkdown,
  exportAdvancedAsPlainText, exportAdvancedAsJSON, exportAdvancedAsCSV,
} from '@/lib/tools/checklist-advanced'
import { useWorkspace } from '@/lib/hooks/use-workspace'
import { deleteWorkspace, clearLastActiveWorkspaceId, setLastActiveWorkspaceId } from '@/lib/checklist-db'
import { copyToClipboard, downloadFile } from '@/lib/utils'
import { ChecklistSubnav } from './checklist-subnav'
import { ChecklistAboutSection } from './checklist-about-section'
import { ToolLayout, ToolHeader } from '@/components/tools/tool-layout'
import { ChecklistPreviewPanel } from '@/components/home/checklist-preview'
import { ChecklistAdvancedPreviewPanel, AdvancedPastePreview } from '@/components/home/checklist-advanced-preview'
import { PastePreview } from '@/components/home/paste-preview'
import { Button } from '@/components/ui/button'
import {
  Share2, Download, Trash2, CheckCheck, X, Search,
  Pencil, Check, GripVertical, Plus, Copy,
  ChevronRight, ChevronDown, IndentIncrease, IndentDecrease,
  Layers, List, CloudOff, SaveAll,
} from 'lucide-react'

// ─── Save status indicator ────────────────────────────────────────────────────

function SaveIndicator({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null
  return (
    <span className={`flex items-center gap-1 text-xs tabular-nums transition-opacity ${
      status === 'saved' ? 'text-green-500' :
      status === 'saving' ? 'text-muted-foreground' :
      'text-destructive'
    }`}>
      {status === 'saving' && <div className="h-2.5 w-2.5 rounded-full border border-current border-t-transparent animate-spin" />}
      {status === 'saved' && <SaveAll className="h-3 w-3" />}
      {status === 'error' && <CloudOff className="h-3 w-3" />}
      {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'Save error'}
    </span>
  )
}

// ─── Simple mode sortable item ────────────────────────────────────────────────

interface SortableItemProps {
  item: ChecklistItem
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
  isFiltered: boolean
}

function SortableItem({ item, onToggle, onDelete, onEdit, isFiltered }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id, disabled: isFiltered,
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

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 10 : undefined }}
      className="flex items-center gap-2 group rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors"
    >
      {!isFiltered && (
        <button {...attributes} {...listeners} aria-label="Drag to reorder"
          className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground transition-all focus-visible:opacity-100 touch-none shrink-0">
          <GripVertical className="h-4 w-4" />
        </button>
      )}
      <button onClick={() => onToggle(item.id)} aria-label={`Toggle ${item.text}`}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          item.state === 'checked' ? 'bg-green-500 border-green-500 text-white' :
          item.state === 'invalid' ? 'bg-red-500/20 border-red-500 text-red-500' : 'border-input hover:border-primary'
        }`}>
        {item.state === 'checked' && <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        {item.state === 'invalid' && <X className="w-3 h-3" />}
      </button>
      {editing ? (
        <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') { setDraft(item.text); setEditing(false) } }}
          onBlur={saveEdit} className="flex-1 text-sm bg-transparent border-b border-primary outline-none px-0" />
      ) : (
        <span onDoubleClick={() => { setDraft(item.text); setEditing(true) }}
          title={item.text}
          className={`flex-1 text-sm cursor-default truncate ${
            item.state === 'checked' ? 'line-through text-muted-foreground' :
            item.state === 'invalid' ? 'line-through text-red-500/70' : ''
          }`}>{item.text}</span>
      )}
      <button onClick={() => { setDraft(item.text); setEditing(true) }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-all focus-visible:opacity-100 shrink-0">
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button onClick={() => void copyToClipboard(item.text)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-all focus-visible:opacity-100 shrink-0">
        <Copy className="h-3.5 w-3.5" />
      </button>
      <button onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all focus-visible:opacity-100 shrink-0">
        <X className="h-3.5 w-3.5" />
      </button>
    </li>
  )
}

// ─── Advanced mode tree item ──────────────────────────────────────────────────

interface AdvancedItemRowProps {
  item: AdvancedItem; allItems: AdvancedItem[]; isFiltered: boolean
  onToggle: (id: string) => void; onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void; onAddChild: (id: string) => void
  onIndent: (id: string) => void; onOutdent: (id: string) => void
  onCollapse: (id: string) => void; focusId: string | null; onFocusDone: () => void
}

function AdvancedItemRow({ item, allItems, isFiltered, onToggle, onDelete, onEdit, onAddChild, onIndent, onOutdent, onCollapse, focusId, onFocusDone }: AdvancedItemRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: isFiltered })
  const [editing, setEditing] = useState(item.text === '')
  const [draft, setDraft] = useState(item.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing || focusId === item.id) { inputRef.current?.focus(); if (focusId === item.id) onFocusDone() }
  }, [editing, focusId, item.id, onFocusDone])

  const saveEdit = useCallback(() => {
    const trimmed = draft.trim()
    if (trimmed) onEdit(item.id, trimmed)
    else setDraft(item.text || '')
    setEditing(false)
  }, [draft, item.id, item.text, onEdit])

  const hasChildren = childrenOf(allItems, item.id).length > 0
  const deepestDesc = descendantsOf(allItems, item.id).reduce((max, d) => Math.max(max, d.depth) as typeof max, item.depth as number)
  const canIndent = item.depth < 2 && deepestDesc < 2 && prevSiblingExists(allItems, item)
  const canOutdent = item.depth > 0
  const canAddChild = item.depth < 2
  const progress = hasChildren ? computeItemProgress(allItems, item.id) : null

  const indentClass = item.depth === 1 ? 'ml-6 border-l-2 border-border/40 pl-3' : item.depth === 2 ? 'ml-12 border-l-2 border-border/20 pl-3' : ''
  const depthRingClass = item.depth === 0 ? 'ring-1 ring-border/30 bg-background' : item.depth === 1 ? 'bg-muted/20' : 'bg-muted/10'

  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, zIndex: isDragging ? 20 : undefined }}
      className={`group rounded-lg ${indentClass} ${item.depth === 0 ? 'mt-2 first:mt-0' : 'mt-1'}`}>
      <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors ${depthRingClass}`}>
        {!isFiltered && (
          <button {...attributes} {...listeners} aria-label="Drag to reorder"
            className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground transition-all focus-visible:opacity-100 touch-none shrink-0">
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        )}
        {hasChildren ? (
          <button onClick={() => onCollapse(item.id)} aria-label={item.collapsed ? 'Expand' : 'Collapse'}
            className="shrink-0 p-0.5 rounded text-muted-foreground/60 hover:text-foreground transition-colors">
            {item.collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        ) : <span className="w-4 shrink-0" />}
        <button onClick={() => onToggle(item.id)} aria-label={`Toggle ${item.text}`}
          className={`flex-shrink-0 w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            item.state === 'checked' ? 'bg-green-500 border-green-500 text-white' :
            item.state === 'invalid' ? 'bg-red-500/20 border-red-500 text-red-500' : 'border-input hover:border-primary'
          }`}>
          {item.state === 'checked' && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          {item.state === 'invalid' && <X className="w-2.5 h-2.5" />}
        </button>
        <div className="flex-1 min-w-0">
          {editing ? (
            <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') { setDraft(item.text); setEditing(false) } }}
              onBlur={saveEdit} placeholder="Item text…"
              className="w-full text-sm bg-transparent border-b border-primary outline-none px-0 placeholder:text-muted-foreground/40" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span onDoubleClick={() => { setDraft(item.text); setEditing(true) }}
                title={item.text || undefined}
                className={`text-sm cursor-default truncate ${
                  item.state === 'checked' ? 'line-through text-muted-foreground' :
                  item.state === 'invalid' ? 'line-through text-red-500/70' :
                  item.depth === 0 ? 'font-medium' : ''
                }`}>
                {item.text || <span className="text-muted-foreground/40 italic">Empty item</span>}
              </span>
              {progress && <span className="text-xs text-muted-foreground/60 shrink-0 tabular-nums">{progress.checked}/{progress.total}</span>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all shrink-0">
          {canIndent && <button onClick={() => onIndent(item.id)} aria-label="Indent" title="Make child of previous item" className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><IndentIncrease className="h-3.5 w-3.5" /></button>}
          {canOutdent && <button onClick={() => onOutdent(item.id)} aria-label="Outdent" title="Promote to parent level" className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><IndentDecrease className="h-3.5 w-3.5" /></button>}
          {canAddChild && <button onClick={() => onAddChild(item.id)} aria-label="Add child" title="Add child item" className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Plus className="h-3.5 w-3.5" /></button>}
          <button onClick={() => { setDraft(item.text); setEditing(true) }} aria-label="Edit" className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
          <button onClick={() => void copyToClipboard(item.text)} aria-label="Copy" className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Copy className="h-3.5 w-3.5" /></button>
          <button onClick={() => onDelete(item.id)} aria-label="Delete" className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><X className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </li>
  )
}

// ─── Main editor ──────────────────────────────────────────────────────────────

type ExportFormat = 'text' | 'markdown' | 'csv' | 'pdf'
type AdvancedExportFormat = 'markdown' | 'text' | 'json' | 'csv' | 'pdf'
type ChecklistMode = 'simple' | 'advanced'

function WorkspaceEditorInner({ id }: { id: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { workspace, loading, saveStatus, updateItems, updateTitle } = useWorkspace(id)

  // Local UI state (not persisted to DB directly — handled via updateItems)
  const [mode, setMode] = useState<ChecklistMode>('simple')
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [advItems, setAdvItems] = useState<AdvancedItem[]>([])
  const [filter, setFilter] = useState('')
  const [shareToast, setShareToast] = useState(false)
  const [advShareToast, setAdvShareToast] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [newItemText, setNewItemText] = useState('')
  const newItemRef = useRef<HTMLInputElement>(null)
  const [advNewText, setAdvNewText] = useState('')
  const advNewRef = useRef<HTMLInputElement>(null)
  const [advFocusId, setAdvFocusId] = useState<string | null>(null)
  const [advEditingTitle, setAdvEditingTitle] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [advExportOpen, setAdvExportOpen] = useState(false)
  const [clearConfirm, setClearConfirm] = useState(false)
  const clearConfirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exportRef = useRef<HTMLDivElement>(null)
  const advExportRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  // Close export dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false)
      if (advExportRef.current && !advExportRef.current.contains(e.target as Node)) setAdvExportOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Cancel pending clearConfirm timer on unmount
  useEffect(() => {
    return () => { if (clearConfirmTimer.current) clearTimeout(clearConfirmTimer.current) }
  }, [])

  // Hydrate local state from workspace loaded by hook
  useEffect(() => {
    if (!workspace) return
    setMode(workspace.mode)
    setTitle(workspace.title)
    setFilter('') // reset filter when workspace changes
    if (workspace.mode === 'simple') {
      setItems(workspace.items as ChecklistItem[])
    } else {
      setAdvItems(workspace.items as AdvancedItem[])
    }
    setMounted(true)
    setLastActiveWorkspaceId(workspace.id)
  }, [workspace])

  // Handle URL share params (c= and a=) — only after workspace is hydrated so updateItems has a target
  useEffect(() => {
    if (!mounted) return
    const urlC = searchParams.get('c')
    const urlA = searchParams.get('a')
    if (urlC) {
      const decoded = decodeChecklistFromURL(urlC)
      if (decoded?.length) { setMode('simple'); syncItems(decoded) }
    } else if (urlA) {
      const decoded = decodeAdvancedFromURL(urlA)
      if (decoded?.length) { setMode('advanced'); syncAdvItems(decoded) }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, searchParams])

  useEffect(() => { if (editingTitle) titleInputRef.current?.focus() }, [editingTitle])
  useEffect(() => { if (advEditingTitle) titleInputRef.current?.focus() }, [advEditingTitle])

  // Sync items back to hook for persistence
  const syncItems = useCallback((newItems: ChecklistItem[]) => {
    setItems(newItems)
    updateItems(newItems)
  }, [updateItems])

  const syncAdvItems = useCallback((newItems: AdvancedItem[]) => {
    setAdvItems(newItems)
    updateItems(newItems)
  }, [updateItems])

  const syncTitle = useCallback((t: string) => {
    setTitle(t)
    updateTitle(t)
  }, [updateTitle])

  // ── Simple handlers ─────────────────────────────────────────────────────────
  const handleToggle = useCallback((id: string) => {
    syncItems(items.map((item) => item.id === id ? { ...item, state: transitionState(item.state) } : item))
  }, [items, syncItems])

  const handleDelete = useCallback((id: string) => {
    syncItems(items.filter((item) => item.id !== id))
  }, [items, syncItems])

  const handleEditSimple = useCallback((id: string, text: string) => {
    syncItems(items.map((item) => item.id === id ? { ...item, text } : item))
  }, [items, syncItems])

  const handleClear = useCallback(async () => {
    if (!clearConfirm) {
      setClearConfirm(true)
      clearConfirmTimer.current = setTimeout(() => setClearConfirm(false), 4000)
      return
    }
    if (clearConfirmTimer.current) clearTimeout(clearConfirmTimer.current)
    await deleteWorkspace(id)
    clearLastActiveWorkspaceId()
    router.push('/checklist/workspace')
  }, [id, router, clearConfirm])

  const handleCheckAll = useCallback(() => {
    syncItems(items.map((item) => ({ ...item, state: 'checked' as const })))
  }, [items, syncItems])

  const handleAddItem = useCallback(() => {
    const text = newItemText.trim()
    if (!text) return
    syncItems([...items, { id: newId(), text, state: 'unchecked' }])
    setNewItemText('')
    newItemRef.current?.focus()
  }, [newItemText, items, syncItems])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    syncItems(arrayMove(items, oldIndex, newIndex))
  }, [items, syncItems])

  const handleShare = useCallback(async () => {
    const encoded = encodeChecklistToURL(items)
    const url = `${window.location.origin}/checklist/${id}?c=${encoded}`
    await copyToClipboard(url)
    setShareToast(true)
    setTimeout(() => setShareToast(false), 2500)
  }, [items, id])

  const handleExport = useCallback(async (format: ExportFormat) => {
    const slug = (title || 'checklist').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (format === 'text') { downloadFile(exportAsPlainText(items), `${slug}.txt`) }
    else if (format === 'markdown') { downloadFile(exportAsMarkdown(items), `${slug}.md`, 'text/markdown') }
    else if (format === 'csv') { downloadFile(exportAsCSV(items), `${slug}.csv`, 'text/csv') }
    else {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.text(title || 'Checklist', 20, 22)
      const cc = items.filter(i => i.state === 'checked').length
      doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120)
      doc.text(`${cc} of ${items.length} done`, 20, 30)
      doc.setTextColor(0, 0, 0); doc.setDrawColor(220, 220, 220); doc.line(20, 34, 190, 34)
      doc.setFontSize(11); let y = 44
      for (const item of items) {
        if (y > 275) { doc.addPage(); y = 20 }
        doc.setDrawColor(160, 160, 160); doc.setFillColor(255, 255, 255)
        if (item.state === 'checked') { doc.setFillColor(34, 197, 94); doc.setDrawColor(34, 197, 94) }
        else if (item.state === 'invalid') { doc.setFillColor(239, 68, 68); doc.setDrawColor(239, 68, 68) }
        doc.roundedRect(20, y - 4, 5, 5, 0.8, 0.8, 'FD')
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

  // ── Advanced handlers ───────────────────────────────────────────────────────
  const handleAdvToggle = useCallback((id: string) => { syncAdvItems(toggleItem(advItems, id)) }, [advItems, syncAdvItems])
  const handleAdvDelete = useCallback((id: string) => { syncAdvItems(deleteItem(advItems, id)) }, [advItems, syncAdvItems])
  const handleAdvEdit = useCallback((id: string, text: string) => { syncAdvItems(editItem(advItems, id, text)) }, [advItems, syncAdvItems])
  const handleAdvIndent = useCallback((id: string) => { syncAdvItems(indentItem(advItems, id)) }, [advItems, syncAdvItems])
  const handleAdvOutdent = useCallback((id: string) => { syncAdvItems(outdentItem(advItems, id)) }, [advItems, syncAdvItems])
  const handleAdvCollapse = useCallback((id: string) => { syncAdvItems(toggleCollapse(advItems, id)) }, [advItems, syncAdvItems])
  const handleAdvCollapseAll = useCallback(() => { syncAdvItems(setAllCollapsed(advItems, true)) }, [advItems, syncAdvItems])
  const handleAdvExpandAll = useCallback(() => { syncAdvItems(setAllCollapsed(advItems, false)) }, [advItems, syncAdvItems])
  const handleAdvClear = useCallback(async () => {
    if (!clearConfirm) {
      setClearConfirm(true)
      clearConfirmTimer.current = setTimeout(() => setClearConfirm(false), 4000)
      return
    }
    if (clearConfirmTimer.current) clearTimeout(clearConfirmTimer.current)
    await deleteWorkspace(id)
    clearLastActiveWorkspaceId()
    router.push('/checklist/workspace')
  }, [id, router, clearConfirm])
  const handleAdvCheckAll = useCallback(() => { syncAdvItems(advItems.map((i) => ({ ...i, state: 'checked' as const }))) }, [advItems, syncAdvItems])

  const handleAdvAddChild = useCallback((parentId: string) => {
    const next = addChild(advItems, parentId)
    const newItem = next.find((i) => i.parentId === parentId && i.text === '')
    if (newItem) setAdvFocusId(newItem.id)
    syncAdvItems(next)
  }, [advItems, syncAdvItems])

  const handleAdvAddItem = useCallback(() => {
    const text = advNewText.trim()
    if (!text) return
    syncAdvItems(addTopLevelItem(advItems, text))
    setAdvNewText('')
    advNewRef.current?.focus()
  }, [advNewText, advItems, syncAdvItems])

  const handleAdvDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const activeItem = advItems.find((i) => i.id === active.id)
    const overItem = advItems.find((i) => i.id === over.id)
    if (!activeItem || !overItem || activeItem.parentId !== overItem.parentId) return
    const siblings = advItems.filter((i) => i.parentId === activeItem.parentId)
    type Block = { head: AdvancedItem; all: AdvancedItem[] }
    const blocks: Block[] = siblings.map((sib) => ({ head: sib, all: [sib, ...descendantsOf(advItems, sib.id)] }))
    const activeBlockIdx = blocks.findIndex((b) => b.head.id === activeItem.id)
    const overBlockIdx = blocks.findIndex((b) => b.head.id === overItem.id)
    if (activeBlockIdx === -1 || overBlockIdx === -1) return
    const reordered = arrayMove(blocks, activeBlockIdx, overBlockIdx)
    const allSiblingAndDescIds = new Set(blocks.flatMap((b) => b.all.map((i) => i.id)))
    const reorderedFlat = reordered.flatMap((b) => b.all)
    const result: AdvancedItem[] = []
    let inserted = false
    for (const item of advItems) {
      if (allSiblingAndDescIds.has(item.id)) {
        if (!inserted) { result.push(...reorderedFlat); inserted = true }
      } else { result.push(item) }
    }
    syncAdvItems(result)
  }, [advItems, syncAdvItems])

  const handleAdvShare = useCallback(async () => {
    const encoded = encodeAdvancedToURL(advItems)
    const url = `${window.location.origin}/checklist/${id}?a=${encoded}`
    await copyToClipboard(url)
    setAdvShareToast(true)
    setTimeout(() => setAdvShareToast(false), 2500)
  }, [advItems, id])

  const handleAdvExport = useCallback(async (format: AdvancedExportFormat) => {
    const slug = (title || 'checklist').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (format === 'markdown') { downloadFile(exportAdvancedAsMarkdown(advItems), `${slug}.md`, 'text/markdown') }
    else if (format === 'text') { downloadFile(exportAdvancedAsPlainText(advItems), `${slug}.txt`) }
    else if (format === 'json') { downloadFile(exportAdvancedAsJSON(advItems), `${slug}.json`, 'application/json') }
    else if (format === 'csv') { downloadFile(exportAdvancedAsCSV(advItems), `${slug}.csv`, 'text/csv') }
    else if (format === 'pdf') {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      const advProgress = computeOverallProgress(advItems)
      doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.text(title || 'Checklist', 20, 22)
      doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120)
      doc.text(`${advProgress.checked} of ${advProgress.total} done`, 20, 30)
      doc.setTextColor(0, 0, 0); doc.setDrawColor(220, 220, 220); doc.line(20, 34, 190, 34)
      doc.setFontSize(11); let y = 44
      for (const item of advItems) {
        if (y > 275) { doc.addPage(); y = 20 }
        const indentX = 20 + item.depth * 8
        doc.setDrawColor(160, 160, 160); doc.setFillColor(255, 255, 255)
        if (item.state === 'checked') { doc.setFillColor(34, 197, 94); doc.setDrawColor(34, 197, 94) }
        else if (item.state === 'invalid') { doc.setFillColor(239, 68, 68); doc.setDrawColor(239, 68, 68) }
        doc.roundedRect(indentX, y - 4, 5, 5, 0.8, 0.8, 'FD')
        if (item.state === 'checked') doc.setTextColor(150, 150, 150)
        else if (item.state === 'invalid') doc.setTextColor(200, 80, 80)
        else doc.setTextColor(30, 30, 30)
        const textX = indentX + 8
        const lines = doc.splitTextToSize(item.text, 190 - textX) as string[]
        doc.text(lines, textX, y); doc.setTextColor(0, 0, 0)
        y += Math.max(lines.length * 7, 9)
      }
      doc.save(`${slug}.pdf`)
    }
  }, [advItems, title])

  // ── Derived ─────────────────────────────────────────────────────────────────
  const progress = computeProgress(items)
  const visible = filterItems(items, filter)
  const isFiltered = filter.trim().length > 0
  const advProgress = computeOverallProgress(advItems)
  const advVisible = visibleItems(advItems)

  // Mode badge (used in toolbar)
  const modeBadge = (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border font-medium ${
      mode === 'advanced'
        ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
        : 'border-border/60 text-muted-foreground bg-muted/20'
    }`}>
      {mode === 'simple' ? <List className="h-3 w-3" /> : <Layers className="h-3 w-3" />}
      {mode === 'simple' ? 'Simple' : 'Advanced'}
    </span>
  )

  const sidebar = !mounted ? undefined : (
    (mode === 'simple' ? items.length === 0 : advItems.length === 0) ? (
      <div className="sticky top-20 flex flex-col gap-3">
        {mode === 'advanced' ? <AdvancedPastePreview /> : <PastePreview />}
        {mode === 'advanced' ? <ChecklistAdvancedPreviewPanel /> : <ChecklistPreviewPanel />}
      </div>
    ) : undefined
  )

  // Toolbars
  const simpleToolbar = mounted ? (
    <div className="flex flex-wrap items-center gap-2">
      {modeBadge}
      <SaveIndicator status={saveStatus} />
      <Button variant="outline" size="sm" onClick={handleCheckAll}><CheckCheck className="h-3.5 w-3.5 mr-1" />Check All</Button>
      <Button variant="outline" size="sm" onClick={() => void handleShare()}><Share2 className="h-3.5 w-3.5 mr-1" />{shareToast ? 'Copied!' : 'Share'}</Button>
      <div ref={exportRef} className="relative">
        <Button variant="outline" size="sm" onClick={() => setExportOpen((o) => !o)}><Download className="h-3.5 w-3.5 mr-1" />Export</Button>
        {exportOpen && (
          <div className="absolute right-0 top-full mt-1 flex flex-col bg-popover border rounded-md shadow-lg z-10 min-w-32 py-1">
            {(['pdf', 'text', 'markdown', 'csv'] as const).map((fmt) => (
              <button key={fmt} onClick={() => { void handleExport(fmt); setExportOpen(false) }} className="px-4 py-2 text-sm text-left hover:bg-accent transition-colors capitalize">
                {fmt === 'pdf' ? 'PDF' : fmt.charAt(0).toUpperCase() + fmt.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={() => void handleClear()}
        className={clearConfirm ? 'bg-destructive/10 text-destructive ring-1 ring-destructive/30' : 'text-destructive hover:text-destructive'}>
        <Trash2 className="h-3.5 w-3.5 mr-1" />{clearConfirm ? 'Confirm?' : 'Delete'}
      </Button>
    </div>
  ) : undefined

  const advToolbar = mounted ? (
    <div className="flex flex-wrap items-center gap-2">
      {modeBadge}
      <SaveIndicator status={saveStatus} />
      <Button variant="outline" size="sm" onClick={handleAdvCheckAll}><CheckCheck className="h-3.5 w-3.5 mr-1" />Check All</Button>
      <Button variant="outline" size="sm" onClick={handleAdvCollapseAll}><ChevronRight className="h-3.5 w-3.5 mr-1" />Collapse</Button>
      <Button variant="outline" size="sm" onClick={handleAdvExpandAll}><ChevronDown className="h-3.5 w-3.5 mr-1" />Expand</Button>
      <Button variant="outline" size="sm" onClick={() => void handleAdvShare()}><Share2 className="h-3.5 w-3.5 mr-1" />{advShareToast ? 'Copied!' : 'Share'}</Button>
      <div ref={advExportRef} className="relative">
        <Button variant="outline" size="sm" onClick={() => setAdvExportOpen((o) => !o)}><Download className="h-3.5 w-3.5 mr-1" />Export</Button>
        {advExportOpen && (
          <div className="absolute right-0 top-full mt-1 flex flex-col bg-popover border rounded-md shadow-lg z-10 min-w-32 py-1">
            {(['pdf', 'markdown', 'text', 'json', 'csv'] as const).map((fmt) => (
              <button key={fmt} onClick={() => { void handleAdvExport(fmt); setAdvExportOpen(false) }} className="px-4 py-2 text-sm text-left hover:bg-accent transition-colors uppercase">
                {fmt}
              </button>
            ))}
          </div>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={() => void handleAdvClear()}
        className={clearConfirm ? 'bg-destructive/10 text-destructive ring-1 ring-destructive/30' : 'text-destructive hover:text-destructive'}>
        <Trash2 className="h-3.5 w-3.5 mr-1" />{clearConfirm ? 'Confirm?' : 'Delete'}
      </Button>
    </div>
  ) : undefined

  if (loading) {
    return (
      <>
        <ChecklistSubnav />
        <div className="container py-12 flex items-center justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </>
    )
  }

  if (!workspace) {
    return (
      <>
        <ChecklistSubnav />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground mb-4">Checklist not found.</p>
          <Button onClick={() => router.push('/checklist/workspace')}>New Checklist</Button>
        </div>
      </>
    )
  }

  const showAbout = mounted && (mode === 'simple' ? items.length === 0 : advItems.length === 0)

  return (
    <>
      <ChecklistSubnav />
      <ToolLayout sidebar={sidebar}>
        <ToolHeader
          title="Smart Checklist"
          toolbar={!mounted ? undefined : mode === 'simple' ? simpleToolbar : advToolbar}
        />

        {/* ── SIMPLE MODE ─────────────────────────────────────────────────── */}
        {mounted && mode === 'simple' && (
          <>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {editingTitle ? (
                    <>
                      <input ref={titleInputRef} type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') { syncTitle(title); setEditingTitle(false) } }}
                        onBlur={() => { syncTitle(title); setEditingTitle(false) }}
                        className="text-xl font-bold bg-transparent border-b border-border focus:border-primary outline-none text-foreground px-0 flex-1" />
                      <button onClick={() => { syncTitle(title); setEditingTitle(false) }} className="p-1 rounded-md text-green-500 hover:bg-accent transition-colors shrink-0"><Check className="h-4 w-4" /></button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold">{title || 'Untitled Checklist'}</h2>
                      <button onClick={() => setEditingTitle(true)} className="p-1 rounded-md text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent transition-colors shrink-0"><Pencil className="h-3.5 w-3.5" /></button>
                    </>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{progress.checked} of {progress.total} done{progress.invalid > 0 && ` · ${progress.invalid} invalid`}</span>
                    <span className="font-medium">{progress.percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden" role="progressbar" aria-valuenow={progress.percent} aria-valuemin={0} aria-valuemax={100}>
                    <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress.percent}%` }} />
                  </div>
                </div>
                {items.length > 5 && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input type="text" placeholder="Filter items…" value={filter} onChange={(e) => setFilter(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>
                )}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <ul className="space-y-1" aria-label="Checklist items">
                      {visible.map((item) => (
                        <SortableItem key={item.id} item={item} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEditSimple} isFiltered={isFiltered} />
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
                {filter && visible.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No items match your filter.</p>}
                <div className="flex gap-2 pt-2 border-t">
                  <input ref={newItemRef} type="text" value={newItemText} onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddItem() }}
                    placeholder="Add an item…"
                    className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                  <Button size="sm" onClick={handleAddItem} disabled={!newItemText.trim()}><Plus className="h-3.5 w-3.5 mr-1" />Add</Button>
                </div>
            </div>
          </>
        )}

        {/* ── ADVANCED MODE ────────────────────────────────────────────────── */}
        {mounted && mode === 'advanced' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {advEditingTitle ? (
                <>
                  <input ref={titleInputRef} type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') { syncTitle(title); setAdvEditingTitle(false) } }}
                    onBlur={() => { syncTitle(title); setAdvEditingTitle(false) }}
                    className="text-xl font-bold bg-transparent border-b border-border focus:border-primary outline-none text-foreground px-0 flex-1" />
                  <button onClick={() => { syncTitle(title); setAdvEditingTitle(false) }} className="p-1 rounded-md text-green-500 hover:bg-accent transition-colors shrink-0"><Check className="h-4 w-4" /></button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold">{title || 'Untitled Checklist'}</h2>
                  <button onClick={() => setAdvEditingTitle(true)} className="p-1 rounded-md text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent transition-colors shrink-0"><Pencil className="h-3.5 w-3.5" /></button>
                </>
              )}
            </div>
            {advItems.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{advProgress.checked} of {advProgress.total} done</span>
                  <span className="font-medium">{advProgress.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden" role="progressbar" aria-valuenow={advProgress.percent} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${advProgress.percent}%` }} />
                </div>
              </div>
            )}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAdvDragEnd}>
              <SortableContext items={advVisible.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-0.5" aria-label="Advanced checklist items">
                  {advVisible.map((item) => (
                    <AdvancedItemRow key={item.id} item={item} allItems={advItems} isFiltered={false}
                      onToggle={handleAdvToggle} onDelete={handleAdvDelete} onEdit={handleAdvEdit}
                      onAddChild={handleAdvAddChild} onIndent={handleAdvIndent} onOutdent={handleAdvOutdent}
                      onCollapse={handleAdvCollapse} focusId={advFocusId} onFocusDone={() => setAdvFocusId(null)} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
            <div className="flex gap-2 pt-2 border-t">
              <input ref={advNewRef} type="text" value={advNewText} onChange={(e) => setAdvNewText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAdvAddItem() }}
                placeholder="Add a top-level item…"
                className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
              <Button size="sm" onClick={handleAdvAddItem} disabled={!advNewText.trim()}><Plus className="h-3.5 w-3.5 mr-1" />Add</Button>
            </div>
          </div>
        )}
      </ToolLayout>
      {showAbout && <ChecklistAboutSection />}
    </>
  )
}

export function WorkspaceEditorClient({ id }: { id: string }) {
  return (
    <Suspense fallback={
      <>
        <ChecklistSubnav />
        <div className="container py-12 flex items-center justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </>
    }>
      <WorkspaceEditorInner id={id} />
    </Suspense>
  )
}
