'use client'

import { useState, useCallback } from 'react'
import { formatJSON, minifyJSON, sortJSONKeys, tokeniseJSON, type JSONFormatterError } from '@/lib/tools/json-formatter'
import { copyToClipboard, downloadFile } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Copy, Download, CheckCircle2, XCircle, AlignJustify, Minimize2, ArrowUpDown, Trash2 } from 'lucide-react'

const TOKEN_COLORS: Record<string, string> = {
  key: 'text-blue-500 dark:text-blue-400',
  string: 'text-green-600 dark:text-green-400',
  number: 'text-orange-500 dark:text-orange-400',
  boolean: 'text-purple-500 dark:text-purple-400',
  null: 'text-red-500 dark:text-red-400',
  punctuation: 'text-muted-foreground',
}

function SyntaxHighlight({ json }: { json: string }) {
  const tokens = tokeniseJSON(json)
  return (
    <pre className="text-sm font-mono overflow-auto p-4 rounded-md bg-muted/50 min-h-[200px] max-h-[500px]" aria-label="Formatted JSON output">
      <code>
        {tokens.map((tok, i) => (
          <span key={i} className={TOKEN_COLORS[tok.type] ?? ''}>
            {tok.value}
          </span>
        ))}
      </code>
    </pre>
  )
}

export function JSONFormatterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<JSONFormatterError | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)
  const [indent, setIndent] = useState(2)

  const handleFormat = useCallback(() => {
    const result = formatJSON(input, indent)
    if (result.error) {
      setError(result.error)
      setOutput('')
      setIsValid(false)
    } else {
      setOutput(result.output)
      setError(null)
      setIsValid(true)
    }
  }, [input, indent])

  const handleMinify = useCallback(() => {
    const result = minifyJSON(input)
    if (result.error) {
      setError(result.error)
      setOutput('')
      setIsValid(false)
    } else {
      setOutput(result.output)
      setError(null)
      setIsValid(true)
    }
  }, [input])

  const handleSort = useCallback(() => {
    const result = sortJSONKeys(input, indent)
    if (result.error) {
      setError(result.error)
      setOutput('')
      setIsValid(false)
    } else {
      setOutput(result.output)
      setError(null)
      setIsValid(true)
    }
  }, [input, indent])

  const handleCopy = useCallback(async () => {
    if (!output) return
    await copyToClipboard(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const handleDownload = useCallback(() => {
    if (!output) return
    downloadFile(output, 'formatted.json', 'application/json')
  }, [output])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setError(null)
    setIsValid(null)
  }, [])

  return (
    <ToolLayout>
      <ToolHeader
        title="JSON Formatter"
        description="Prettify, minify, validate and explore JSON with syntax highlighting."
        toolbar={
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Indent</label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="text-xs border rounded px-2 py-1 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Indentation size"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 space</option>
            </select>
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <ToolSection label="Input JSON">
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setIsValid(null); setError(null) }}
            placeholder='Paste your JSON here...\n\n{"name":"DevTools","version":"1.0"}'
            className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            aria-label="JSON input"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleFormat} disabled={!input.trim()}>
              <AlignJustify className="h-3.5 w-3.5 mr-1" />
              Prettify
            </Button>
            <Button variant="outline" size="sm" onClick={handleMinify} disabled={!input.trim()}>
              <Minimize2 className="h-3.5 w-3.5 mr-1" />
              Minify
            </Button>
            <Button variant="outline" size="sm" onClick={handleSort} disabled={!input.trim()}>
              <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
              Sort Keys
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>
        </ToolSection>

        <ToolSection label="Output">
          {isValid !== null && (
            <div className={`flex items-center gap-1.5 text-xs mb-2 ${isValid ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
              {isValid ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
              {isValid ? 'Valid JSON' : `Invalid JSON${error?.line ? ` — line ${error.line}, col ${error.column}` : ''}`}
            </div>
          )}

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive mb-2" role="alert">
              {error.message}
            </div>
          )}

          {output ? (
            <Tabs defaultValue="highlighted">
              <div className="flex items-center justify-between mb-2">
                <TabsList>
                  <TabsTrigger value="highlighted">Highlighted</TabsTrigger>
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                </TabsList>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              <TabsContent value="highlighted">
                <SyntaxHighlight json={output} />
              </TabsContent>
              <TabsContent value="raw">
                <textarea
                  readOnly
                  value={output}
                  className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Raw JSON output"
                />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="h-80 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Formatted JSON will appear here
            </div>
          )}
        </ToolSection>
      </div>

    </ToolLayout>
  )
}
