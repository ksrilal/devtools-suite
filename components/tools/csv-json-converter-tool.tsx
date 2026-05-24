'use client'

import { useState, useCallback, useRef } from 'react'
import { csvToJSON, jsonToCSV } from '@/lib/tools/csv-json-converter'
import { copyToClipboard, downloadFile, readFileAsText } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, Download, Trash2, ArrowDownUp, Upload } from 'lucide-react'

const SAMPLE_CSV = `id,name,email,active,score
1,Alice,alice@example.com,true,98.6
2,Bob,bob@example.com,false,72.1
3,Carol,carol@example.com,true,88.0`

const SAMPLE_JSON = `[
  { "id": 1, "name": "Alice", "email": "alice@example.com", "active": true },
  { "id": 2, "name": "Bob", "email": "bob@example.com", "active": false },
  { "id": 3, "name": "Carol", "email": "carol@example.com", "active": true }
]`

export function CSVJSONConverterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json')
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const convert = useCallback(async (text: string, currentMode: 'csv-to-json' | 'json-to-csv') => {
    if (!text.trim()) { setOutput(''); setError(null); return }
    const result = currentMode === 'csv-to-json'
      ? await csvToJSON(text)
      : await jsonToCSV(text)
    if (result.error) { setError(result.error.message); setOutput('') }
    else { setOutput(result.output); setError(null) }
  }, [])

  const handleInput = useCallback((val: string) => {
    setInput(val)
    void convert(val, mode)
  }, [mode, convert])

  const handleModeToggle = useCallback(() => {
    const next = mode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json'
    setMode(next)
    void convert(input, next)
  }, [mode, input, convert])

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await readFileAsText(file)
    handleInput(text)
    if (fileRef.current) fileRef.current.value = ''
  }, [handleInput])

  const handleCopy = useCallback(async () => {
    if (!output) return
    await copyToClipboard(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const handleDownload = useCallback(() => {
    if (!output) return
    const ext = mode === 'csv-to-json' ? 'json' : 'csv'
    const mime = mode === 'csv-to-json' ? 'application/json' : 'text/csv'
    downloadFile(output, `output.${ext}`, mime)
  }, [output, mode])

  const handleClear = useCallback(() => { setInput(''); setOutput(''); setError(null) }, [])
  const handleSample = useCallback(() => {
    const s = mode === 'csv-to-json' ? SAMPLE_CSV : SAMPLE_JSON
    handleInput(s)
  }, [mode, handleInput])

  return (
    <ToolLayout>
      <ToolHeader
        title="CSV ↔ JSON Converter"
        description="Convert CSV to JSON or JSON arrays to CSV. Handles headers automatically. Upload files or paste directly."
        toolbar={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleModeToggle}>
              <ArrowDownUp className="h-3.5 w-3.5 mr-1" />
              {mode === 'csv-to-json' ? 'Switch to JSON → CSV' : 'Switch to CSV → JSON'}
            </Button>
            <label className="cursor-pointer">
              <span className="sr-only">Upload file</span>
              <div className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                Upload
              </div>
              <input
                ref={fileRef}
                type="file"
                accept={mode === 'csv-to-json' ? '.csv,.txt' : '.json'}
                onChange={handleFile}
                className="sr-only"
              />
            </label>
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <ToolSection label={mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}>
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={mode === 'csv-to-json' ? 'id,name,email\n1,Alice,alice@example.com' : '[{"id":1,"name":"Alice"}]'}
            className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            aria-label={mode === 'csv-to-json' ? 'CSV input' : 'JSON input'}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleSample}>Sample</Button>
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />Clear
            </Button>
          </div>
        </ToolSection>

        <ToolSection label={mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}>
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</div>
          )}
          {output ? (
            <>
              <div className="flex gap-1 mb-1">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-3.5 w-3.5 mr-1" />{copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-3.5 w-3.5 mr-1" />Save
                </Button>
              </div>
              <textarea readOnly value={output}
                className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={mode === 'csv-to-json' ? 'JSON output' : 'CSV output'}
              />
            </>
          ) : (
            <div className="h-80 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              {mode === 'csv-to-json' ? 'JSON output will appear here' : 'CSV output will appear here'}
            </div>
          )}
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
