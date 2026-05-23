'use client'

import { useState, useEffect } from 'react'

interface PasteDemo {
  label: string
  lines: string[]
}

const DEMOS: PasteDemo[] = [
  {
    label: 'newline separated',
    lines: [
      'Deploy database migrations',
      'Run smoke tests',
      'Update release notes',
      'Notify stakeholders',
    ],
  },
  {
    label: 'comma separated',
    lines: ['Setup CI pipeline, Write unit tests, Review PR, Merge to main'],
  },
  {
    label: 'existing checkboxes',
    lines: [
      '[ ] Configure environment',
      '[x] Install dependencies',
      '[ ] Run migrations',
      '[x] Deploy to staging',
    ],
  },
  {
    label: 'unicode markers',
    lines: [
      '✓ Backup database',
      '✗ Clear CDN cache',
      '✓ Notify on-call team',
      '  Archive old logs',
    ],
  },
]

function getMarkerColor(line: string): string {
  if (line.startsWith('[x]') || line.startsWith('✓')) return 'text-green-400'
  if (line.startsWith('✗')) return 'text-red-400'
  if (line.startsWith('[ ]')) return 'text-muted-foreground'
  return 'text-foreground'
}

function getMarkerSpan(line: string) {
  if (line.startsWith('[x]')) return { marker: '[x]', rest: line.slice(3) }
  if (line.startsWith('[ ]')) return { marker: '[ ]', rest: line.slice(3) }
  if (line.startsWith('✓') || line.startsWith('✗')) return { marker: line[0]!, rest: line.slice(1) }
  return { marker: null, rest: line }
}

export function PastePreview() {
  const [demoIndex, setDemoIndex] = useState(0)
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [typing, setTyping] = useState(true)
  const [charCount, setCharCount] = useState(0)
  const [fading, setFading] = useState(false)

  const demo = DEMOS[demoIndex]!

  // Single-line demos: type character by character
  // Multi-line demos: reveal line by line
  const isMultiLine = demo.lines.length > 1
  const singleLineText = isMultiLine ? '' : (demo.lines[0] ?? '')

  useEffect(() => {
    setVisibleLines([])
    setCharCount(0)
    setTyping(true)
    setFading(false)
  }, [demoIndex])

  useEffect(() => {
    if (!typing) return

    if (isMultiLine) {
      if (visibleLines.length < demo.lines.length) {
        const t = setTimeout(() => {
          setVisibleLines(prev => [...prev, demo.lines[prev.length] ?? ''])
        }, 320)
        return () => clearTimeout(t)
      } else {
        // All lines revealed — pause then fade out
        const t = setTimeout(() => setFading(true), 1800)
        return () => clearTimeout(t)
      }
    } else {
      if (charCount < singleLineText.length) {
        const t = setTimeout(() => setCharCount(c => c + 1), 38)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setFading(true), 1800)
        return () => clearTimeout(t)
      }
    }
  }, [typing, visibleLines, charCount, demo, isMultiLine, singleLineText])

  useEffect(() => {
    if (!fading) return
    const t = setTimeout(() => {
      setDemoIndex(i => (i + 1) % DEMOS.length)
    }, 400)
    return () => clearTimeout(t)
  }, [fading])

  const displayLines = isMultiLine ? visibleLines : [singleLineText.slice(0, charCount)]

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/50 bg-muted/20">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
        <span className="h-2 w-2 rounded-full bg-green-400/70" />
        <span className="ml-2 text-xs text-muted-foreground/50 font-mono">paste your list</span>
        <span className="ml-auto text-[10px] text-muted-foreground/40 italic">{demo.label}</span>
      </div>

      {/* Textarea simulation */}
      <div
        className={[
          'px-4 py-3 h-[120px] font-mono text-xs leading-6 transition-opacity duration-300',
          fading ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
        aria-hidden="true"
      >
        {displayLines.map((line, i) => {
          const { marker, rest } = getMarkerSpan(line)
          const color = getMarkerColor(line)
          return (
            <div key={i} className="flex items-baseline gap-1">
              {marker ? (
                <>
                  <span className={`${color} shrink-0`}>{marker}</span>
                  <span className="text-foreground/90">{rest}</span>
                </>
              ) : (
                <span className="text-foreground/90">{rest}</span>
              )}
              {/* Blinking cursor on last line while typing */}
              {i === displayLines.length - 1 && !fading && (
                <span className="inline-block w-0.5 h-3.5 bg-foreground/60 animate-pulse ml-0.5 translate-y-px" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
