'use client'

import { useState, useEffect } from 'react'

interface RegexStep {
  pattern: string
  flags: string
  input: string
  matches: Array<{ start: number; end: number }>
}

const STEPS: RegexStep[] = [
  {
    pattern: '\\d+',
    flags: 'g',
    input: 'Deploy v2.14 on port 8080',
    matches: [{ start: 8, end: 12 }, { start: 21, end: 25 }],
  },
  {
    pattern: '[A-Z][a-z]+',
    flags: 'g',
    input: 'John merged feature into Main',
    matches: [{ start: 0, end: 4 }, { start: 12, end: 19 }, { start: 25, end: 29 }],
  },
  {
    pattern: '\\w+@\\w+\\.\\w+',
    flags: 'g',
    input: 'Contact ops@dev.io or cto@app.io',
    matches: [{ start: 8, end: 18 }, { start: 22, end: 32 }],
  },
]

function HighlightedText({ text, matches }: { text: string; matches: Array<{ start: number; end: number }> }) {
  const parts: Array<{ text: string; highlighted: boolean }> = []
  let cursor = 0

  for (const m of matches) {
    if (m.start > cursor) parts.push({ text: text.slice(cursor, m.start), highlighted: false })
    parts.push({ text: text.slice(m.start, m.end), highlighted: true })
    cursor = m.end
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), highlighted: false })

  return (
    <span className="font-mono text-xs break-all">
      {parts.map((p, i) =>
        p.highlighted ? (
          <mark key={i} className="bg-yellow-400/30 text-yellow-300 rounded-sm px-0.5 not-italic">
            {p.text}
          </mark>
        ) : (
          <span key={i} className="text-muted-foreground">{p.text}</span>
        )
      )}
    </span>
  )
}

export function RegexPreviewPanel() {
  const [stepIndex, setStepIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setTransitioning(true)
      setTimeout(() => {
        setStepIndex(i => (i + 1) % STEPS.length)
        setTransitioning(false)
      }, 300)
    }, 2800)
    return () => clearTimeout(t)
  }, [stepIndex])

  const step = STEPS[stepIndex] ?? STEPS[0]!

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden h-full flex flex-col">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/50 bg-muted/20 shrink-0">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
        <span className="h-2 w-2 rounded-full bg-green-400/70" />
        <span className="ml-2 text-xs text-muted-foreground/50 font-mono">regex-tester</span>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Pattern input */}
        <div className={`transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-[10px] text-muted-foreground/50 mb-1.5">Pattern</p>
          <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
            <span className="text-muted-foreground/40 font-mono text-sm">/</span>
            <code className="text-sm font-mono text-violet-400 flex-1">{step.pattern}</code>
            <span className="text-muted-foreground/40 font-mono text-sm">/</span>
            <code className="text-xs font-mono text-blue-400">{step.flags}</code>
          </div>
        </div>

        {/* Test string with highlights */}
        <div className={`transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-[10px] text-muted-foreground/50 mb-1.5">Test string</p>
          <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 min-h-[2.5rem]">
            <HighlightedText text={step.input} matches={step.matches} />
          </div>
        </div>

        {/* Match count */}
        <div className={`flex items-center gap-2 transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 text-xs font-medium text-yellow-400">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
            {step.matches.length} {step.matches.length === 1 ? 'match' : 'matches'}
          </span>
        </div>
      </div>
    </div>
  )
}
