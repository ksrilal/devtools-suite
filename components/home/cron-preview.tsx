'use client'

import { useState, useEffect } from 'react'

interface CronField {
  label: string
  value: string
}

const STEPS: Array<{ fields: CronField[]; expression: string; description: string }> = [
  {
    fields: [
      { label: 'Minute', value: '0' },
      { label: 'Hour', value: '9' },
      { label: 'Day', value: '*' },
      { label: 'Month', value: '*' },
      { label: 'Weekday', value: '1-5' },
    ],
    expression: '0 9 * * 1-5',
    description: 'At 9:00 AM, Monday through Friday',
  },
  {
    fields: [
      { label: 'Minute', value: '*/15' },
      { label: 'Hour', value: '*' },
      { label: 'Day', value: '*' },
      { label: 'Month', value: '*' },
      { label: 'Weekday', value: '*' },
    ],
    expression: '*/15 * * * *',
    description: 'Every 15 minutes',
  },
  {
    fields: [
      { label: 'Minute', value: '0' },
      { label: 'Hour', value: '0' },
      { label: 'Day', value: '1' },
      { label: 'Month', value: '*' },
      { label: 'Weekday', value: '*' },
    ],
    expression: '0 0 1 * *',
    description: 'At midnight on the 1st of every month',
  },
]

export function CronPreviewPanel() {
  const [stepIndex, setStepIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setTransitioning(true)
      setTimeout(() => {
        setStepIndex(i => (i + 1) % STEPS.length)
        setTransitioning(false)
      }, 300)
    }, 2600)
    return () => clearTimeout(t)
  }, [stepIndex])

  const step = STEPS[stepIndex] ?? STEPS[0]
  if (!step) return null

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden h-full flex flex-col">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/50 bg-muted/20 shrink-0">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
        <span className="h-2 w-2 rounded-full bg-green-400/70" />
        <span className="ml-2 text-xs text-muted-foreground/50 font-mono">cron-generator</span>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Fields */}
        <div className={`grid grid-cols-5 gap-1.5 transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          {step.fields.map(f => (
            <div key={f.label} className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground/60 text-center">{f.label}</span>
              <div className="rounded-md border border-border/60 bg-muted/30 py-1.5 text-center text-sm font-mono font-medium text-foreground">
                {f.value}
              </div>
            </div>
          ))}
        </div>

        {/* Expression */}
        <div className={`rounded-lg bg-muted/40 border border-border/50 px-3 py-2 transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-[10px] text-muted-foreground/50 mb-1">Expression</p>
          <code className="text-sm font-mono font-semibold text-foreground">{step.expression}</code>
        </div>

        {/* Human readable */}
        <div className={`rounded-lg bg-green-500/8 border border-green-500/20 px-3 py-2 transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-[10px] text-muted-foreground/50 mb-1">Meaning</p>
          <p className="text-xs text-green-400 font-medium leading-relaxed">{step.description}</p>
        </div>
      </div>
    </div>
  )
}
