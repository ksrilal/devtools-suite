'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Plus, List, Layers, Loader2, LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChecklistSubnav } from './checklist-subnav'
import { ChecklistAboutSection } from './checklist-about-section'
import { createWorkspace } from '@/lib/checklist-db'
import { parseChecklistInput } from '@/lib/tools/checklist'
import { parseAdvancedInput, newId } from '@/lib/tools/checklist-advanced'
import { ToolLayout, ToolHeader } from '@/components/tools/tool-layout'
import { ChecklistPreviewPanel } from '@/components/home/checklist-preview'
import { ChecklistAdvancedPreviewPanel, AdvancedPastePreview } from '@/components/home/checklist-advanced-preview'
import { PastePreview } from '@/components/home/paste-preview'
import type { ChecklistMode } from '@/lib/checklist-db'

export function WorkspacePageClient() {
  const router = useRouter()
  const [mode, setMode] = useState<ChecklistMode>('simple')
  const [input, setInput] = useState('')
  const [creating, setCreating] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const createFromList = useCallback(async () => {
    if (!input.trim() || creating) return
    setCreating(true)
    try {
      const items = mode === 'simple'
        ? parseChecklistInput(input)
        : parseAdvancedInput(input)
      const firstLine = input.split(/\n|,|\t/).map((l) => l.trim()).find((l) => l.length > 0) ?? 'My Checklist'
      const title = firstLine.length > 60 ? firstLine.slice(0, 57) + '…' : firstLine
      const ws = await createWorkspace(title, mode, items)
      router.push(`/checklist/${ws.id}`)
    } catch {
      setCreating(false)
    }
  }, [input, mode, creating, router])

  const startBlank = useCallback(async () => {
    if (creating) return
    setCreating(true)
    try {
      const items = mode === 'advanced'
        ? [{ id: newId(), text: '', state: 'unchecked' as const, depth: 0 as const, parentId: null, collapsed: false }]
        : []
      const ws = await createWorkspace('Untitled Checklist', mode, items)
      router.push(`/checklist/${ws.id}`)
    } catch {
      setCreating(false)
    }
  }, [mode, creating, router])

  const modeToggle = (
    <div className="flex items-center gap-1 rounded-lg border border-border/50 p-0.5 bg-muted/30">
      {(['simple', 'advanced'] as const).map((m) => (
        <button key={m} onClick={() => setMode(m)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${mode === m ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          aria-pressed={mode === m}>
          {m === 'simple' ? <List className="h-3.5 w-3.5" /> : <Layers className="h-3.5 w-3.5" />}
          {m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
    </div>
  )

  const sidebar = (
    <div className="sticky top-20 flex flex-col gap-3">
      {mode === 'advanced' ? <AdvancedPastePreview /> : <PastePreview />}
      {mode === 'advanced' ? <ChecklistAdvancedPreviewPanel /> : <ChecklistPreviewPanel />}
    </div>
  )

  return (
    <>
      <ChecklistSubnav />
      <ToolLayout sidebar={sidebar}>
        <ToolHeader
          title="Smart Checklist"
          description="Paste any list to create an interactive, shareable checklist."
        />

        <div className="mb-4 flex items-center justify-between">
          <span />
          {modeToggle}
        </div>

        {mode === 'simple' ? (
          <div className="space-y-3">
            <label htmlFor="checklist-input" className="text-sm font-medium">Paste your list</label>
            <textarea
              id="checklist-input"
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste your list — one item per line, comma or tab separated:\n\nDeploy database migrations\nRun smoke tests\nUpdate release notes`}
              className="w-full h-48 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) void createFromList() }}
            />
            <div className="flex items-center gap-2">
              <Button onClick={() => void createFromList()} disabled={!input.trim() || creating} className="gap-2">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {creating ? 'Creating…' : 'Create Checklist'}
              </Button>
              <Button variant="outline" onClick={() => void startBlank()} disabled={creating} className="gap-2">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Start Blank
              </Button>
              <Button variant="ghost" onClick={() => router.push('/checklist/templates')} disabled={creating} className="gap-2 text-muted-foreground hover:text-foreground">
                <LayoutTemplate className="h-4 w-4" />
                Browse Templates
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Tip: Press Ctrl+Enter to create</p>
          </div>
        ) : (
          <div className="space-y-3">
            <label htmlFor="adv-checklist-input" className="text-sm font-medium">Paste your list</label>
            <textarea
              id="adv-checklist-input"
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste a list — indent with 2 spaces for nested items:\n\nRelease v2.0\n  Database\n    Run migrations\n  Deploy\n    Blue-green switch`}
              className="w-full h-52 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) void createFromList() }}
            />
            <div className="flex items-center gap-2">
              <Button onClick={() => void createFromList()} disabled={!input.trim() || creating} className="gap-2">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {creating ? 'Creating…' : 'Create Checklist'}
              </Button>
              <Button variant="outline" onClick={() => void startBlank()} disabled={creating} className="gap-2">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Start Blank
              </Button>
              <Button variant="ghost" onClick={() => router.push('/checklist/templates')} disabled={creating} className="gap-2 text-muted-foreground hover:text-foreground">
                <LayoutTemplate className="h-4 w-4" />
                Browse Templates
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Indent with 2 spaces per level (max 3 levels) · Ctrl+Enter to create</p>
          </div>
        )}
      </ToolLayout>
      <ChecklistAboutSection />
    </>
  )
}
