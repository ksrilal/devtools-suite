'use client'

import { useState } from 'react'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { CopyButton } from '@/components/ui/copy-button'
import { Monitor, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

const PRESETS = [
  {
    label: 'Card',
    classes: 'bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-sm border border-gray-200 dark:border-gray-700',
    content: 'A beautiful card component with shadow and border.',
  },
  {
    label: 'Button',
    classes: 'inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer',
    content: 'Click Me',
  },
  {
    label: 'Badge',
    classes: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    content: 'Active',
  },
  {
    label: 'Alert',
    classes: 'flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
    content: 'Warning: Please review before continuing.',
  },
  {
    label: 'Input',
    classes: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white',
    content: 'Type something...',
  },
  {
    label: 'Gradient Hero',
    classes: 'flex items-center justify-center min-h-[120px] rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-2xl font-bold shadow-xl',
    content: 'Hello World',
  },
]

export function TailwindPlaygroundTool() {
  const [classes, setClasses] = useState(PRESETS[0]?.classes ?? '')
  const [content, setContent] = useState(PRESETS[0]?.content ?? '')
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')

  const html = `<div class="${classes}">\n  ${content}\n</div>`

  return (
    <ToolLayout>
      <ToolHeader
        title="Tailwind Playground"
        description="Experiment with Tailwind CSS classes live. Edit classes and content — see the result instantly."
      />

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => { setClasses(p.classes); setContent(p.content) }}
            className="px-3 py-1.5 text-xs rounded-md border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-accent/60 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <ToolSection label="Tailwind Classes">
            <textarea
              value={classes}
              onChange={(e) => setClasses(e.target.value)}
              placeholder="bg-blue-500 text-white px-4 py-2 rounded-lg ..."
              className="w-full h-28 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              aria-label="Tailwind classes"
              spellCheck={false}
            />
          </ToolSection>

          <ToolSection label="Content">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Inner text or HTML content"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              aria-label="Content"
            />
          </ToolSection>

          <ToolSection label="Generated HTML">
            <pre className="rounded-md border border-border bg-muted/30 px-3 py-2.5 text-xs font-mono whitespace-pre-wrap break-all">
              {html}
            </pre>
            <div className="mt-2 flex justify-end">
              <CopyButton text={html} />
            </div>
          </ToolSection>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Live Preview</p>
            <div className="flex gap-1">
              <button
                onClick={() => setViewport('desktop')}
                className={cn('p-1.5 rounded-md transition-colors', viewport === 'desktop' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60')}
                aria-label="Desktop preview"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={cn('p-1.5 rounded-md transition-colors', viewport === 'mobile' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60')}
                aria-label="Mobile preview"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background overflow-hidden" style={{ minHeight: '280px' }}>
            <div className={cn('p-6 flex items-center justify-center transition-all', viewport === 'mobile' ? 'max-w-[375px] mx-auto' : 'w-full')}>
              {/* Rendered preview — uses inline style for safety, actual Tailwind classes applied directly */}
              <div className={classes}>{content}</div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/60">
            Preview renders real Tailwind classes. Some utilities may not apply if not present in the build stylesheet.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
