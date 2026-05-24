'use client'

import { useState, useCallback, useMemo } from 'react'
import { convertAllCases, CASE_LABELS, type CaseType } from '@/lib/tools/case-converter'
import { copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, Trash2 } from 'lucide-react'

const SAMPLE = 'hello world from devtools suite'

export function CaseConverterTool() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const results = useMemo(() => convertAllCases(input), [input])

  const handleCopy = useCallback(async (value: string, key: string) => {
    if (!value) return
    await copyToClipboard(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const handleClear = useCallback(() => setInput(''), [])
  const handleSample = useCallback(() => setInput(SAMPLE), [])

  return (
    <ToolLayout>
      <ToolHeader
        title="Case Converter"
        description="Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE and more — instantly."
      />

      <ToolSection label="Input Text" className="mb-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="hello world from devtools suite"
          className="w-full h-28 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
          aria-label="Text to convert"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSample}>Sample</Button>
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input}>
            <Trash2 className="h-3.5 w-3.5 mr-1" />Clear
          </Button>
        </div>
      </ToolSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(Object.keys(CASE_LABELS) as CaseType[]).map((caseType) => {
          const value = results[caseType]
          const isCopied = copied === caseType
          return (
            <div
              key={caseType}
              className="group rounded-lg border border-border/60 bg-card p-3 flex flex-col gap-1.5 hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{CASE_LABELS[caseType]}</span>
                <button
                  onClick={() => void handleCopy(value, caseType)}
                  disabled={!value}
                  className="opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 p-1 rounded hover:bg-accent"
                  aria-label={`Copy ${CASE_LABELS[caseType]}`}
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono break-all text-foreground min-h-[1.25rem]">
                  {value || <span className="text-muted-foreground/40">—</span>}
                </code>
                {isCopied && <span className="text-xs text-green-500 shrink-0">Copied!</span>}
              </div>
            </div>
          )
        })}
      </div>
    </ToolLayout>
  )
}
