'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, Trash2, Eye, Code } from 'lucide-react'

const SAMPLE = `# Welcome to Markdown Previewer

Type your **Markdown** here and see a live preview on the right.

## Features

- Real-time rendering
- GitHub-style appearance
- Syntax highlighting hints
- Completely client-side

## Code Example

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`
}
\`\`\`

> Blockquotes work too!

| Column A | Column B |
|----------|----------|
| Value 1  | Value 2  |

---

**Bold**, *italic*, \`inline code\`, and [links](https://devtoolssuite.dev) all supported.
`

export function MarkdownPreviewerTool() {
  const [markdown, setMarkdown] = useState(SAMPLE)
  const [html, setHtml] = useState('')
  const [view, setView] = useState<'split' | 'preview' | 'editor'>('split')
  const [copied, setCopied] = useState(false)
  const renderRef = useRef<(() => void) | null>(null)

  const renderMarkdown = useCallback(async (text: string) => {
    if (!text.trim()) {
      setHtml('')
      return
    }
    try {
      const { marked } = await import('marked')
      const DOMPurify = (await import('dompurify')).default
      marked.setOptions({ breaks: true, gfm: true })
      const raw = await marked(text)
      const clean = DOMPurify.sanitize(raw, {
        ALLOWED_TAGS: [
          'h1','h2','h3','h4','h5','h6','p','br','strong','em','del','code','pre',
          'blockquote','ul','ol','li','a','img','table','thead','tbody','tr','th','td',
          'hr','span','div',
        ],
        ALLOWED_ATTR: ['href','src','alt','title','class','target','rel'],
      })
      setHtml(clean)
    } catch {
      setHtml('<p class="text-destructive">Error rendering markdown.</p>')
    }
  }, [])

  // Debounce renders
  useEffect(() => {
    const timer = setTimeout(() => {
      void renderMarkdown(markdown)
    }, 150)
    return () => clearTimeout(timer)
  }, [markdown, renderMarkdown])

  // Keep ref in sync for imperative use
  renderRef.current = () => { void renderMarkdown(markdown) }

  const handleCopy = useCallback(async () => {
    await copyToClipboard(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [markdown])

  const handleClear = useCallback(() => {
    setMarkdown('')
    setHtml('')
  }, [])

  const editorPane = (
    <ToolSection label="Markdown Editor">
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Type your Markdown here..."
        className="w-full h-[500px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
        aria-label="Markdown editor"
      />
    </ToolSection>
  )

  const previewPane = (
    <ToolSection label="Preview">
      {html ? (
        <div
          className="min-h-[500px] rounded-md border border-input bg-background px-4 py-3 prose prose-sm dark:prose-invert max-w-none overflow-auto"
          dangerouslySetInnerHTML={{ __html: html }}
          aria-label="Rendered markdown preview"
        />
      ) : (
        <div className="h-[500px] rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
          Preview will appear here
        </div>
      )}
    </ToolSection>
  )

  return (
    <ToolLayout>
      <ToolHeader
        title="Markdown Previewer"
        description="Write Markdown with a live GitHub-style preview. All processing stays in your browser."
        toolbar={
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-input overflow-hidden">
              <button
                onClick={() => setView('editor')}
                className={`px-2.5 py-1 text-xs flex items-center gap-1 transition-colors ${view === 'editor' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
                aria-pressed={view === 'editor'}
              >
                <Code className="h-3.5 w-3.5" />Editor
              </button>
              <button
                onClick={() => setView('split')}
                className={`px-2.5 py-1 text-xs border-x border-input transition-colors ${view === 'split' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
                aria-pressed={view === 'split'}
              >
                Split
              </button>
              <button
                onClick={() => setView('preview')}
                className={`px-2.5 py-1 text-xs flex items-center gap-1 transition-colors ${view === 'preview' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
                aria-pressed={view === 'preview'}
              >
                <Eye className="h-3.5 w-3.5" />Preview
              </button>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!markdown}>
              <Copy className="h-3.5 w-3.5 mr-1" />
              {copied ? 'Copied!' : 'Copy MD'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!markdown}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>
        }
      />

      {view === 'split' && (
        <div className="grid lg:grid-cols-2 gap-4">
          {editorPane}
          {previewPane}
        </div>
      )}
      {view === 'editor' && editorPane}
      {view === 'preview' && previewPane}
    </ToolLayout>
  )
}
