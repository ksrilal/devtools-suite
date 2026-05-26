'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, Plus, Pin, Copy, Pencil, Trash2, Check, X,
  List, Layers, Clock, CheckSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChecklistSubnav } from './checklist-subnav'
import { useWorkspaceList } from '@/lib/hooks/use-workspace-list'
import { filterMetadata } from '@/lib/checklist-db'
import type { SortOrder } from '@/lib/checklist-db'

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'updated', label: 'Last modified' },
  { value: 'created', label: 'Date created' },
  { value: 'alpha',   label: 'Alphabetical' },
  { value: 'pinned',  label: 'Pinned first' },
]

function formatDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffH = Math.floor(diffMin / 60)
  const diffD = Math.floor(diffH / 24)
  if (diffMin < 2) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffH < 24) return `${diffH}h ago`
  if (diffD < 7) return `${diffD}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function MyChecklistsPageClient() {
  const router = useRouter()
  const { items, loading, remove, duplicate, rename, togglePin, sort, setSort } = useWorkspaceList()
  const [query, setQuery] = useState('')
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const deletingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (deletingTimer.current) clearTimeout(deletingTimer.current) }
  }, [])

  const filtered = useMemo(() => filterMetadata(items, query), [items, query])

  const handleRenameStart = (id: string, current: string) => {
    setRenamingId(id)
    setRenameValue(current)
  }

  const handleRenameSave = async () => {
    if (!renamingId || !renameValue.trim()) { setRenamingId(null); return }
    await rename(renamingId, renameValue.trim())
    setRenamingId(null)
  }

  const handleDelete = async (id: string) => {
    if (deletingId === id) {
      if (deletingTimer.current) clearTimeout(deletingTimer.current)
      await remove(id)
      setDeletingId(null)
    } else {
      if (deletingTimer.current) clearTimeout(deletingTimer.current)
      setDeletingId(id)
      deletingTimer.current = setTimeout(() => setDeletingId(null), 4000)
    }
  }

  const handleDuplicate = async (id: string) => {
    const newId = await duplicate(id)
    if (newId) router.push(`/checklist/${newId}`)
  }

  return (
    <>
      <ChecklistSubnav count={items.length} />
      <div className="container py-8">

        {/* Header row */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Checklists</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {items.length === 0 ? 'No saved checklists yet' : `${items.length} saved checklist${items.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <Button onClick={() => router.push('/checklist/workspace')} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Checklist
          </Button>
        </div>

        {/* Search + sort */}
        {items.length > 0 && (
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-48 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search checklists..."
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border/50 p-0.5 bg-muted/30">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setSort(o.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    sort === o.value
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-pressed={sort === o.value}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
              <CheckSquare className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <h2 className="text-base font-semibold mb-1">No saved checklists</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Create a checklist and it will be saved automatically in your browser.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => router.push('/checklist/workspace')} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Checklist
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/checklist/templates')}>
                Browse Templates
              </Button>
            </div>
          </div>
        )}

        {/* No search results */}
        {!loading && items.length > 0 && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">
            No checklists match &ldquo;{query}&rdquo;
          </p>
        )}

        {/* List */}
        {!loading && filtered.length > 0 && (
          <ul className="space-y-2" aria-label="Saved checklists">
            {filtered.map((meta) => {
              const percent = meta.itemCount > 0 ? Math.round((meta.checkedCount / meta.itemCount) * 100) : 0
              const isRenaming = renamingId === meta.id
              const isDeleting = deletingId === meta.id

              return (
                <li
                  key={meta.id}
                  className="group rounded-lg border border-border/50 bg-card text-card-foreground px-4 py-3 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-3">
                  {/* Left: title / rename */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    {isRenaming ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') void handleRenameSave()
                            if (e.key === 'Escape') setRenamingId(null)
                          }}
                          onBlur={() => void handleRenameSave()}
                          className="flex-1 text-sm text-foreground bg-transparent border-b border-primary outline-none"
                          aria-label="Rename checklist"
                        />
                        <button onClick={() => void handleRenameSave()} className="p-0.5 text-green-500"><Check className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setRenamingId(null)} className="p-0.5 text-muted-foreground"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => router.push(`/checklist/${meta.id}`)}
                        className="block text-left w-full min-w-0 text-foreground hover:text-foreground"
                      >
                        <span className="text-sm font-medium text-foreground truncate block">{meta.title || 'Untitled'}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <Clock className="h-3 w-3 shrink-0" />
                          {formatDate(meta.updatedAt)}
                          {meta.itemCount > 0 && (
                            <>
                              <span className="text-border">·</span>
                              {meta.checkedCount}/{meta.itemCount} done
                            </>
                          )}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Right side — shrink-0 so title always gets remaining space */}
                  {!isRenaming && (
                    <div className="hidden sm:flex items-center gap-3 shrink-0">
                      {/* Mode badge */}
                      <span className={`inline-flex shrink-0 items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                        meta.mode === 'advanced'
                          ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                          : 'border-border/50 text-muted-foreground/60 bg-muted/20'
                      }`}>
                        {meta.mode === 'advanced' ? <Layers className="h-2.5 w-2.5" /> : <List className="h-2.5 w-2.5" />}
                        {meta.mode}
                      </span>

                      {/* Progress bar — fixed width */}
                      <div className="w-28 shrink-0">
                        {meta.itemCount > 0 && (
                          <>
                            <div className="flex items-center mb-1">
                              <span className="text-[10px] text-muted-foreground/60 tabular-nums">{percent}%</span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all duration-300"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Pin — always takes space, only shows icon when pinned */}
                      <div className="w-7 shrink-0 flex items-center justify-center">
                        {meta.pinned && (
                          <button
                            onClick={() => void togglePin(meta.id)}
                            title="Unpin"
                            className="p-1 rounded text-primary hover:bg-accent transition-colors"
                          >
                            <Pin className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Actions — opacity hidden, space always reserved */}
                      <div className={`flex items-center gap-0.5 transition-opacity ${isDeleting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <button
                          onClick={() => void togglePin(meta.id)}
                          title={meta.pinned ? 'Unpin' : 'Pin'}
                          style={{ visibility: meta.pinned ? 'hidden' : undefined }}
                          className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pin className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleRenameStart(meta.id, meta.title)}
                          title="Rename"
                          className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => void handleDuplicate(meta.id)}
                          title="Duplicate"
                          className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => void handleDelete(meta.id)}
                          title={isDeleting ? 'Click again to confirm' : 'Delete'}
                          className={`flex items-center gap-1 px-1.5 py-1.5 rounded transition-colors ${
                            isDeleting
                              ? 'bg-destructive/10 text-destructive ring-1 ring-destructive/30'
                              : 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
                          }`}
                        >
                          <Trash2 className="h-3.5 w-3.5 shrink-0" />
                          {isDeleting && <span className="text-[10px] whitespace-nowrap">confirm?</span>}
                        </button>
                      </div>
                    </div>
                  )}
                  </div>
                  {/* Mobile-only action row (sm and below) */}
                  {!isRenaming && (
                    <div className="sm:hidden flex items-center gap-1 mt-2 pt-2 border-t border-border/30">
                      <button onClick={() => void togglePin(meta.id)} title={meta.pinned ? 'Unpin' : 'Pin'}
                        className={`p-1.5 rounded transition-colors ${meta.pinned ? 'text-primary' : 'text-muted-foreground hover:text-foreground'} hover:bg-accent`}>
                        <Pin className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleRenameStart(meta.id, meta.title)} title="Rename"
                        className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => void handleDuplicate(meta.id)} title="Duplicate"
                        className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => void handleDelete(meta.id)} title={isDeleting ? 'Tap again to confirm' : 'Delete'}
                        className={`flex items-center gap-1 px-1.5 py-1.5 rounded transition-colors ml-auto ${
                          isDeleting ? 'bg-destructive/10 text-destructive ring-1 ring-destructive/30' : 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
                        }`}>
                        <Trash2 className="h-3.5 w-3.5 shrink-0" />
                        {isDeleting && <span className="text-[10px] whitespace-nowrap">confirm?</span>}
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {/* Storage disclaimer */}
        {!loading && (
          <p className="text-xs text-muted-foreground/50 text-center mt-10 max-w-sm mx-auto leading-relaxed">
            Saved locally in your browser. Clearing browser storage or cache may remove saved checklists.
          </p>
        )}

      </div>
    </>
  )
}
