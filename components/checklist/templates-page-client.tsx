'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Star } from 'lucide-react'
import { ChecklistSubnav } from './checklist-subnav'
import { ChecklistAboutSection } from './checklist-about-section'
import { createWorkspace } from '@/lib/checklist-db'
import {
  allTemplates,
  CATEGORY_LABELS,
  type ChecklistTemplate,
  type TemplateCategory,
} from '@/lib/checklist-templates'

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as TemplateCategory[]

function TemplateModeTag({ mode }: { mode: string }) {
  return (
    <span className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded border font-medium ${
      mode === 'advanced'
        ? 'border-blue-500/30 text-blue-500 bg-blue-500/5'
        : 'border-border/60 text-muted-foreground bg-muted/20'
    }`}>
      {mode}
    </span>
  )
}

function CategoryTag({ category }: { category: TemplateCategory }) {
  return (
    <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded border font-medium border-border/40 text-muted-foreground/70 bg-muted/10">
      {CATEGORY_LABELS[category]}
    </span>
  )
}

function TemplateCard({
  template,
  onUse,
  creating,
}: {
  template: ChecklistTemplate
  onUse: (id: string) => void
  creating: boolean
}) {
  return (
    <div className="group rounded-xl border border-border/50 bg-card p-4 flex flex-col hover:border-border transition-colors">
      <div className="mb-2">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <h3 className="text-sm font-semibold leading-tight">{template.name}</h3>
          {template.featured && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-500 font-medium">
              <Star className="h-2.5 w-2.5 fill-amber-500" aria-hidden="true" />
              Featured
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <TemplateModeTag mode={template.mode} />
          <CategoryTag category={template.category} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
        {template.description}
      </p>

      <div className="rounded-md bg-muted/30 px-3 py-2 mb-3 space-y-0.5">
        {template.previewLines.map((line, i) => (
          <p key={i} className="text-[11px] text-muted-foreground/60 truncate">
            {i === 0 ? '· ' : '  · '}{line}
          </p>
        ))}
      </div>

      <button
        onClick={() => onUse(template.id)}
        disabled={creating}
        className="w-full text-sm font-medium py-1.5 rounded-md border border-border/50 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
      >
        Use Template
      </button>
    </div>
  )
}

type FilterChip = TemplateCategory | 'featured' | null

export function TemplatesPageClient() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterChip>(null)
  const [creating, setCreating] = useState(false)

  const filtered = useMemo(() => {
    let results = allTemplates
    if (activeFilter === 'featured') results = results.filter((t) => t.featured)
    else if (activeFilter) results = results.filter((t) => t.category === activeFilter)
    if (query.trim()) {
      const q = query.toLowerCase()
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)),
      )
    }
    return results
  }, [query, activeFilter])

  const handleUse = useCallback(async (templateId: string) => {
    const tpl = allTemplates.find((t) => t.id === templateId)
    if (!tpl) return
    setCreating(true)
    try {
      const ws = await createWorkspace(tpl.name, tpl.mode, tpl.items, tpl.id)
      router.push(`/checklist/${ws.id}`)
    } finally {
      setCreating(false)
    }
  }, [router])

  return (
    <>
      <ChecklistSubnav />
      <div className="container py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Templates</h1>
          <p className="text-sm text-muted-foreground">
            {allTemplates.length} ready-made checklists across {ALL_CATEGORIES.length} categories — engineering, startup, marketing, AI, and more.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates..."
            aria-label="Search templates"
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground/60 hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 flex-wrap mb-8">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              activeFilter === null
                ? 'bg-foreground text-background border-foreground'
                : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter(activeFilter === 'featured' ? null : 'featured')}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              activeFilter === 'featured'
                ? 'bg-amber-500 text-background border-amber-500'
                : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <Star className={`h-3 w-3 ${activeFilter === 'featured' ? 'fill-background' : 'fill-amber-500'}`} aria-hidden="true" />
            Featured
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                activeFilter === cat
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Result count when filtering */}
        {(query || activeFilter) && (
          <p className="text-xs text-muted-foreground mb-4">
            {filtered.length} template{filtered.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Template grid */}
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            No templates match your search.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((tpl) => (
              <TemplateCard key={tpl.id} template={tpl} onUse={handleUse} creating={creating} />
            ))}
          </div>
        )}

      </div>
      <ChecklistAboutSection />
    </>
  )
}
