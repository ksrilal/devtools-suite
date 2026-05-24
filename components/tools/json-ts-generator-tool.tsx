'use client'

import { useState, useCallback } from 'react'
import { generateTypeScript } from '@/lib/tools/json-to-typescript'
import { copyToClipboard, downloadFile } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, Download, Trash2, Wand2 } from 'lucide-react'

const SAMPLE = `{
  "user": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "roles": ["admin", "editor"],
    "address": {
      "street": "123 Main St",
      "city": "Springfield",
      "zip": "12345"
    },
    "active": true,
    "score": 98.6
  }
}`

export function JSONTSGeneratorTool() {
  const [input, setInput] = useState('')
  const [rootName, setRootName] = useState('Root')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generate = useCallback((json: string, name: string) => {
    if (!json.trim()) { setOutput(''); setError(null); return }
    const result = generateTypeScript(json, name || 'Root')
    if (result.error) { setError(result.error.message); setOutput('') }
    else { setOutput(result.output); setError(null) }
  }, [])

  const handleInput = useCallback((val: string) => {
    setInput(val)
    generate(val, rootName)
  }, [rootName, generate])

  const handleRootName = useCallback((name: string) => {
    setRootName(name)
    generate(input, name)
  }, [input, generate])

  const handleCopy = useCallback(async () => {
    if (!output) return
    await copyToClipboard(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const handleDownload = useCallback(() => {
    if (!output) return
    downloadFile(output, 'types.ts', 'text/plain')
  }, [output])

  const handleClear = useCallback(() => { setInput(''); setOutput(''); setError(null) }, [])

  const handleSample = useCallback(() => { handleInput(SAMPLE) }, [handleInput])

  return (
    <ToolLayout>
      <ToolHeader
        title="JSON → TypeScript Generator"
        description="Paste JSON and instantly generate typed TypeScript interfaces. Handles nesting, arrays, and optional fields."
        toolbar={
          <div className="flex items-center gap-2">
            <label htmlFor="root-name" className="text-xs text-muted-foreground">Root name</label>
            <input
              id="root-name"
              type="text"
              value={rootName}
              onChange={(e) => handleRootName(e.target.value)}
              className="w-28 text-xs border rounded px-2 py-1 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
            />
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <ToolSection label="JSON Input">
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={'{\n  "name": "Alice",\n  "age": 30\n}'}
            className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            aria-label="JSON input"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleSample} variant="outline">
              <Wand2 className="h-3.5 w-3.5 mr-1" />
              Sample
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>
        </ToolSection>

        <ToolSection label="TypeScript Output">
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </div>
          )}
          {output ? (
            <>
              <div className="flex gap-1 mb-1">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Save .ts
                </Button>
              </div>
              <textarea
                readOnly
                value={output}
                className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="TypeScript interfaces output"
              />
            </>
          ) : (
            <div className="h-80 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              TypeScript interfaces will appear here
            </div>
          )}
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
