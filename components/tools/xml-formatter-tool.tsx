'use client'

import { useState, useCallback } from 'react'
import { formatXML, minifyXML } from '@/lib/tools/xml-formatter'
import { copyToClipboard, downloadFile } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, Download, Trash2, AlignJustify, Minimize2 } from 'lucide-react'

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<users><user id="1"><name>Alice</name><email>alice@example.com</email><roles><role>admin</role><role>editor</role></roles></user><user id="2"><name>Bob</name><email>bob@example.com</email></user></users>`

export function XMLFormatterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)

  const handleFormat = useCallback(async () => {
    if (!input.trim()) return
    const result = await formatXML(input, indent)
    if (result.error) { setError(`${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ''}`); setOutput('') }
    else { setOutput(result.output); setError(null) }
  }, [input, indent])

  const handleMinify = useCallback(async () => {
    if (!input.trim()) return
    const result = await minifyXML(input)
    if (result.error) { setError(result.error.message); setOutput('') }
    else { setOutput(result.output); setError(null) }
  }, [input])

  const handleCopy = useCallback(async () => {
    if (!output) return
    await copyToClipboard(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const handleDownload = useCallback(() => {
    if (!output) return
    downloadFile(output, 'formatted.xml', 'text/xml')
  }, [output])

  const handleClear = useCallback(() => { setInput(''); setOutput(''); setError(null) }, [])
  const handleSample = useCallback(() => { setInput(SAMPLE_XML); setOutput(''); setError(null) }, [])

  return (
    <ToolLayout>
      <ToolHeader
        title="XML Formatter"
        description="Pretty-print or minify XML with validation. Handles attributes, CDATA, and nested elements."
        toolbar={
          <div className="flex items-center gap-2">
            <label htmlFor="xml-indent" className="text-xs text-muted-foreground">Indent</label>
            <select
              id="xml-indent"
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="text-xs border rounded px-2 py-1 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <ToolSection label="XML Input">
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null) }}
            placeholder={'<?xml version="1.0"?>\n<root>\n  <item>value</item>\n</root>'}
            className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            aria-label="XML input"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => void handleFormat()} disabled={!input.trim()}>
              <AlignJustify className="h-3.5 w-3.5 mr-1" />Format
            </Button>
            <Button variant="outline" size="sm" onClick={() => void handleMinify()} disabled={!input.trim()}>
              <Minimize2 className="h-3.5 w-3.5 mr-1" />Minify
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSample}>Sample</Button>
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />Clear
            </Button>
          </div>
        </ToolSection>

        <ToolSection label="Output">
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
                aria-label="Formatted XML output"
              />
            </>
          ) : (
            <div className="h-80 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Formatted XML will appear here
            </div>
          )}
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
