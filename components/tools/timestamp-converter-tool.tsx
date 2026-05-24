'use client'

import { useState, useCallback, useEffect } from 'react'
import { fromUnix, fromDateString, nowResult, type TimestampResult } from '@/lib/tools/timestamp-converter'
import { copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, Clock } from 'lucide-react'

type CopiedField = string | null

function ResultRow({ label, value, fieldKey, copied, onCopy }: {
  label: string
  value: string | number
  fieldKey: string
  copied: CopiedField
  onCopy: (v: string, k: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
      <code className="flex-1 text-sm font-mono break-all">{String(value)}</code>
      <button
        onClick={() => onCopy(String(value), fieldKey)}
        className="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent"
        aria-label={`Copy ${label}`}
      >
        <Copy className="h-3.5 w-3.5 inline mr-1" />
        {copied === fieldKey ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}

export function TimestampConverterTool() {
  const [tsInput, setTsInput] = useState('')
  const [isMs, setIsMs] = useState(false)
  const [dateInput, setDateInput] = useState('')
  const [tsResult, setTsResult] = useState<TimestampResult | null>(null)
  const [dateResult, setDateResult] = useState<TimestampResult | null>(null)
  const [tsError, setTsError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)
  const [copied, setCopied] = useState<CopiedField>(null)

  const handleCopy = useCallback(async (value: string, key: string) => {
    await copyToClipboard(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const handleTsInput = useCallback((val: string, ms: boolean) => {
    setTsInput(val)
    if (!val.trim()) { setTsResult(null); setTsError(null); return }
    const n = Number(val.trim())
    if (isNaN(n)) { setTsError('Enter a valid number'); setTsResult(null); return }
    setTsResult(fromUnix(n, ms))
    setTsError(null)
  }, [])

  const handleDateInput = useCallback((val: string) => {
    setDateInput(val)
    if (!val.trim()) { setDateResult(null); setDateError(null); return }
    const r = fromDateString(val)
    if (!r) { setDateError('Enter a valid date/time string'); setDateResult(null); return }
    setDateResult(r)
    setDateError(null)
  }, [])

  const handleNow = useCallback(() => {
    const r = nowResult()
    setTsInput(String(r.unix))
    setIsMs(false)
    setTsResult(r)
    setTsError(null)
  }, [])

  // Re-run conversion when isMs toggles
  useEffect(() => {
    if (tsInput) handleTsInput(tsInput, isMs)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMs])

  return (
    <ToolLayout>
      <ToolHeader
        title="Unix Timestamp Converter"
        description="Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Unix → Date */}
        <div className="space-y-4">
          <ToolSection label="Unix Timestamp → Date">
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={tsInput}
                onChange={(e) => handleTsInput(e.target.value, isMs)}
                placeholder="1700000000"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Unix timestamp input"
              />
              <Button variant="outline" size="sm" onClick={handleNow} title="Use current timestamp">
                <Clock className="h-3.5 w-3.5 mr-1" />Now
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Unit:</span>
              {(['seconds', 'milliseconds'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => { setIsMs(u === 'milliseconds') }}
                  aria-pressed={isMs === (u === 'milliseconds')}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${isMs === (u === 'milliseconds') ? 'bg-foreground text-background border-foreground' : 'border-input text-muted-foreground hover:bg-accent'}`}
                >
                  {u}
                </button>
              ))}
            </div>
            {tsError && <p className="text-xs text-destructive" role="alert">{tsError}</p>}
          </ToolSection>

          {tsResult && (
            <div className="rounded-md border border-border overflow-hidden">
              {[
                { label: 'Unix (s)', value: tsResult.unix, key: 'ts-unix' },
                { label: 'Unix (ms)', value: tsResult.unixMs, key: 'ts-ms' },
                { label: 'ISO 8601', value: tsResult.iso, key: 'ts-iso' },
                { label: 'UTC', value: tsResult.utc, key: 'ts-utc' },
                { label: 'Local', value: tsResult.local, key: 'ts-local' },
                { label: 'Relative', value: tsResult.relative, key: 'ts-rel' },
              ].map((row) => (
                <ResultRow key={row.key} label={row.label} value={row.value} fieldKey={row.key} copied={copied} onCopy={handleCopy} />
              ))}
            </div>
          )}
        </div>

        {/* Date → Unix */}
        <div className="space-y-4">
          <ToolSection label="Date → Unix Timestamp">
            <input
              type="text"
              value={dateInput}
              onChange={(e) => handleDateInput(e.target.value)}
              placeholder="2024-01-15T12:00:00Z or Jan 15 2024"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Date string input"
            />
            <input
              type="datetime-local"
              onChange={(e) => handleDateInput(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-muted-foreground"
              aria-label="Date picker"
            />
            {dateError && <p className="text-xs text-destructive" role="alert">{dateError}</p>}
          </ToolSection>

          {dateResult && (
            <div className="rounded-md border border-border overflow-hidden">
              {[
                { label: 'Unix (s)', value: dateResult.unix, key: 'd-unix' },
                { label: 'Unix (ms)', value: dateResult.unixMs, key: 'd-ms' },
                { label: 'ISO 8601', value: dateResult.iso, key: 'd-iso' },
                { label: 'UTC', value: dateResult.utc, key: 'd-utc' },
                { label: 'Local', value: dateResult.local, key: 'd-local' },
                { label: 'Relative', value: dateResult.relative, key: 'd-rel' },
              ].map((row) => (
                <ResultRow key={row.key} label={row.label} value={row.value} fieldKey={row.key} copied={copied} onCopy={handleCopy} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
