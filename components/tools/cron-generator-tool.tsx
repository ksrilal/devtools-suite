'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  parseExpression,
  toEventBridge,
  toSpringScheduled,
  validateCronField,
  type CronField,
} from '@/lib/tools/cron-generator'
import { copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, X } from 'lucide-react'

const PRESETS: Array<{ label: string; expression: string }> = [
  { label: 'Every minute', expression: '* * * * *' },
  { label: 'Every 5 min', expression: '*/5 * * * *' },
  { label: 'Every hour', expression: '0 * * * *' },
  { label: 'Daily midnight', expression: '0 0 * * *' },
  { label: 'Daily 9am', expression: '0 9 * * *' },
  { label: 'Weekdays 9am', expression: '0 9 * * 1-5' },
  { label: 'Weekly Sunday', expression: '0 0 * * 0' },
  { label: 'Monthly 1st', expression: '0 0 1 * *' },
]

const INITIAL_FIELDS: CronField = {
  minute: '*',
  hour: '*',
  dayOfMonth: '*',
  month: '*',
  dayOfWeek: '*',
}

type FieldKey = keyof CronField

const FIELD_LABELS: Record<FieldKey, { label: string; placeholder: string; example: string }> = {
  minute: { label: 'Minute', placeholder: '* or 0-59', example: '*/5' },
  hour: { label: 'Hour', placeholder: '* or 0-23', example: '9' },
  dayOfMonth: { label: 'Day (Month)', placeholder: '* or 1-31', example: '1' },
  month: { label: 'Month', placeholder: '* or 1-12', example: '*/2' },
  dayOfWeek: { label: 'Day (Week)', placeholder: '* or 0-7', example: '1-5' },
}

function fieldsToExpr(f: CronField) {
  return `${f.minute} ${f.hour} ${f.dayOfMonth} ${f.month} ${f.dayOfWeek}`
}

function exprToFields(expr: string): CronField | null {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return null
  return {
    minute: parts[0] ?? '*',
    hour: parts[1] ?? '*',
    dayOfMonth: parts[2] ?? '*',
    month: parts[3] ?? '*',
    dayOfWeek: parts[4] ?? '*',
  }
}

export function CronGeneratorTool() {
  const [fields, setFields] = useState<CronField>(INITIAL_FIELDS)
  const [rawInput, setRawInput] = useState(fieldsToExpr(INITIAL_FIELDS))
  const [rawError, setRawError] = useState<string | null>(null)
  const [result, setResult] = useState<{ human: string; nextExecutions: string[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({})
  const [copied, setCopied] = useState<string | null>(null)

  // Track which source last updated to avoid ping-pong
  const updatingFrom = useRef<'builder' | 'raw' | null>(null)

  const expression = fieldsToExpr(fields)

  const validateFields = useCallback((f: CronField): boolean => {
    const errs: Partial<Record<FieldKey, string>> = {}
    let valid = true
    for (const key of Object.keys(f) as FieldKey[]) {
      const v = validateCronField(key, f[key])
      if (!v.valid) { errs[key] = v.error ?? 'Invalid'; valid = false }
    }
    setFieldErrors(errs)
    return valid
  }, [])

  const runParse = useCallback(async (expr: string) => {
    setLoading(true)
    try {
      const r = await parseExpression(expr)
      setResult({ human: r.human, nextExecutions: r.nextExecutions })
    } finally {
      setLoading(false)
    }
  }, [])

  // Builder → raw expression (keep raw in sync when builder changes)
  useEffect(() => {
    if (updatingFrom.current === 'raw') return
    updatingFrom.current = 'builder'
    setRawInput(expression)
    setRawError(null)
    updatingFrom.current = null
  }, [expression])

  // Auto-parse when builder fields are valid
  useEffect(() => {
    if (validateFields(fields)) {
      runParse(expression)
    } else {
      setResult(null)
    }
  }, [fields, expression, validateFields, runParse])

  function handleFieldChange(key: FieldKey, value: string) {
    updatingFrom.current = 'builder'
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  function applyExpression(expr: string) {
    const f = exprToFields(expr)
    if (!f) {
      setRawError('Expression must have exactly 5 fields (e.g. 0 9 * * 1-5)')
      return
    }
    // Validate each field
    const errs: Partial<Record<FieldKey, string>> = {}
    let valid = true
    for (const key of Object.keys(f) as FieldKey[]) {
      const v = validateCronField(key, f[key])
      if (!v.valid) { errs[key] = v.error ?? 'Invalid'; valid = false }
    }
    if (!valid) {
      setRawError('Invalid field value: ' + Object.values(errs).join(', '))
      setFieldErrors(errs)
      return
    }
    setRawError(null)
    updatingFrom.current = 'raw'
    setFields(f)
    updatingFrom.current = null
  }

  function handleRawChange(value: string) {
    setRawInput(value)
    setRawError(null)
    // Auto-apply when expression looks complete (5 parts)
    const parts = value.trim().split(/\s+/)
    if (parts.length === 5) {
      applyExpression(value)
    }
  }

  function handlePreset(expr: string) {
    setRawInput(expr)
    setRawError(null)
    const f = exprToFields(expr)
    if (f) {
      updatingFrom.current = 'raw'
      setFields(f)
      updatingFrom.current = null
    }
  }

  function handleClear() {
    setFields(INITIAL_FIELDS)
    setRawInput(fieldsToExpr(INITIAL_FIELDS))
    setRawError(null)
    setFieldErrors({})
    setResult(null)
  }

  async function handleCopy(text: string, key: string) {
    await copyToClipboard(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const hasContent = rawInput !== fieldsToExpr(INITIAL_FIELDS)

  return (
    <ToolLayout>
      <ToolHeader
        title="Cron Generator"
        description="Build and validate cron expressions with human-readable descriptions."
      />

      {/* Presets */}
      <div className="mb-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.expression}
              onClick={() => handlePreset(p.expression)}
              className="px-3 py-1.5 text-xs rounded-full border hover:bg-accent transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual builder */}
      <ToolSection label="Expression Builder" className="mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(Object.keys(FIELD_LABELS) as FieldKey[]).map((key) => {
            const meta = FIELD_LABELS[key]
            return (
              <div key={key} className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{meta.label}</label>
                <input
                  type="text"
                  value={fields[key]}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  placeholder={meta.placeholder}
                  className={`w-full rounded-md border px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background ${fieldErrors[key] ? 'border-destructive' : 'border-input'}`}
                  aria-label={meta.label}
                />
                {fieldErrors[key]
                  ? <p className="text-xs text-destructive">{fieldErrors[key]}</p>
                  : <p className="text-xs text-muted-foreground">e.g. {meta.example}</p>
                }
              </div>
            )
          })}
        </div>
      </ToolSection>

      {/* Raw expression — synced with builder */}
      <ToolSection label="Expression" className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={rawInput}
            onChange={(e) => handleRawChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyExpression(rawInput)}
            placeholder="e.g. 0 9 * * 1-5"
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background ${rawError ? 'border-destructive' : 'border-input'}`}
            aria-label="Cron expression"
          />
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!hasContent}>
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        </div>
        {rawError && <p className="text-xs text-destructive mt-1">{rawError}</p>}
        <p className="text-xs text-muted-foreground">Editing updates the builder above. Press Enter to apply.</p>
      </ToolSection>

      {/* Results */}
      <div className="space-y-4">
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Expression</p>
              <code className="text-lg font-mono font-bold">{expression}</code>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleCopy(expression, 'expr')}>
              <Copy className="h-3.5 w-3.5 mr-1" />
              {copied === 'expr' ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground animate-pulse">Calculating…</p>
          ) : result && (
            <>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Meaning</p>
                <p className="text-sm font-medium">{result.human}</p>
              </div>
              {result.nextExecutions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Next 5 executions (UTC)</p>
                  <ol className="space-y-1">
                    {result.nextExecutions.map((t, i) => (
                      <li key={i} className="text-xs font-mono text-muted-foreground">
                        {i + 1}. {t}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </>
          )}
        </div>

        {/* Format conversions */}
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: 'AWS EventBridge', value: toEventBridge(expression), key: 'aws' },
            { label: 'Spring @Scheduled', value: toSpringScheduled(expression), key: 'spring' },
          ].map((fmt) => (
            <div key={fmt.key} className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{fmt.label}</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono break-all">{fmt.value}</code>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(fmt.value, fmt.key)} className="shrink-0">
                  <Copy className="h-3.5 w-3.5" />
                  <span className="sr-only">Copy {fmt.label}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </ToolLayout>
  )
}
