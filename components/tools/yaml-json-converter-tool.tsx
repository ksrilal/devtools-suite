'use client'

import { useState, useCallback } from 'react'
import { copyToClipboard, downloadFile } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, Download, Trash2, ArrowDownUp } from 'lucide-react'

const SAMPLE_YAML = `name: DevTools Suite
version: 2.0.0
tools:
  - name: JSON Formatter
    path: /json-formatter
  - name: UUID Generator
    path: /uuid-generator
features:
  privacyFirst: true
  requiresLogin: false
  offline: true`

const SAMPLE_JSON = `{
  "name": "DevTools Suite",
  "version": "2.0.0",
  "tools": [
    { "name": "JSON Formatter", "path": "/json-formatter" },
    { "name": "UUID Generator", "path": "/uuid-generator" }
  ],
  "features": {
    "privacyFirst": true,
    "requiresLogin": false,
    "offline": true
  }
}`

export function YAMLJSONConverterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json')
  const [copied, setCopied] = useState(false)

  const convert = useCallback(async (text: string, currentMode: 'yaml-to-json' | 'json-to-yaml') => {
    if (!text.trim()) {
      setOutput('')
      setError(null)
      return
    }
    try {
      const yaml = await import('js-yaml')
      if (currentMode === 'yaml-to-json') {
        const parsed = yaml.load(text)
        setOutput(JSON.stringify(parsed, null, 2))
      } else {
        const parsed: unknown = JSON.parse(text)
        setOutput(yaml.dump(parsed, { indent: 2, lineWidth: 120 }))
      }
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed.')
      setOutput('')
    }
  }, [])

  const handleInput = useCallback((value: string) => {
    setInput(value)
    void convert(value, mode)
  }, [mode, convert])

  const handleModeToggle = useCallback(() => {
    const next = mode === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json'
    setMode(next)
    void convert(input, next)
  }, [mode, input, convert])

  const handleCopy = useCallback(async () => {
    if (!output) return
    await copyToClipboard(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const handleDownload = useCallback(() => {
    if (!output) return
    const ext = mode === 'yaml-to-json' ? 'json' : 'yaml'
    const mime = mode === 'yaml-to-json' ? 'application/json' : 'text/yaml'
    downloadFile(output, `output.${ext}`, mime)
  }, [output, mode])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setError(null)
  }, [])

  const handleSample = useCallback(() => {
    const sample = mode === 'yaml-to-json' ? SAMPLE_YAML : SAMPLE_JSON
    setInput(sample)
    void convert(sample, mode)
  }, [mode, convert])

  return (
    <ToolLayout>
      <ToolHeader
        title="YAML ↔ JSON Converter"
        description="Convert between YAML and JSON formats with validation and pretty-printing."
        toolbar={
          <Button variant="outline" size="sm" onClick={handleModeToggle}>
            <ArrowDownUp className="h-3.5 w-3.5 mr-1" />
            {mode === 'yaml-to-json' ? 'Switch to JSON → YAML' : 'Switch to YAML → JSON'}
          </Button>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <ToolSection label={mode === 'yaml-to-json' ? 'YAML Input' : 'JSON Input'}>
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={mode === 'yaml-to-json' ? 'Paste your YAML here...' : 'Paste your JSON here...'}
            className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            aria-label={mode === 'yaml-to-json' ? 'YAML input' : 'JSON input'}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={handleSample}>
              Sample
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>
        </ToolSection>

        <ToolSection label={mode === 'yaml-to-json' ? 'JSON Output' : 'YAML Output'}>
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
                  Save
                </Button>
              </div>
              <textarea
                readOnly
                value={output}
                className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={mode === 'yaml-to-json' ? 'JSON output' : 'YAML output'}
              />
            </>
          ) : (
            <div className="h-80 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              {mode === 'yaml-to-json' ? 'JSON output will appear here' : 'YAML output will appear here'}
            </div>
          )}
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
