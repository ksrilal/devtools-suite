'use client'

import { useState, useCallback } from 'react'
import { type SQLDialect, SQL_DIALECTS } from '@/lib/tools/sql-formatter-tool'
import { copyToClipboard, downloadFile } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, Download, Trash2, AlignJustify, Minimize2 } from 'lucide-react'

const SAMPLE_SQL = `SELECT u.id, u.name, u.email, COUNT(o.id) AS order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2024-01-01' GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 5 ORDER BY order_count DESC LIMIT 20;`

export function SQLFormatterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [dialect, setDialect] = useState<SQLDialect>('sql')
  const [copied, setCopied] = useState(false)

  const formatSQL = useCallback(async (minify = false) => {
    if (!input.trim()) return
    try {
      const { format } = await import('sql-formatter')
      const result = format(input, {
        language: dialect,
        tabWidth: 2,
        useTabs: false,
        keywordCase: 'upper',
        indentStyle: minify ? 'standard' : 'standard',
      })
      const finalOutput = minify
        ? result.replace(/\s+/g, ' ').trim()
        : result
      setOutput(finalOutput)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to format SQL.')
      setOutput('')
    }
  }, [input, dialect])

  const handleFormat = useCallback(() => { void formatSQL(false) }, [formatSQL])
  const handleMinify = useCallback(() => { void formatSQL(true) }, [formatSQL])

  const handleCopy = useCallback(async () => {
    if (!output) return
    await copyToClipboard(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const handleDownload = useCallback(() => {
    if (!output) return
    downloadFile(output, 'formatted.sql', 'text/plain')
  }, [output])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setError(null)
  }, [])

  const handleLoadSample = useCallback(() => {
    setInput(SAMPLE_SQL)
    setOutput('')
    setError(null)
  }, [])

  return (
    <ToolLayout>
      <ToolHeader
        title="SQL Formatter"
        description="Beautify or minify SQL queries with dialect-aware formatting. No data sent anywhere."
        toolbar={
          <div className="flex items-center gap-2">
            <label htmlFor="sql-dialect" className="text-xs text-muted-foreground">Dialect</label>
            <select
              id="sql-dialect"
              value={dialect}
              onChange={(e) => setDialect(e.target.value as SQLDialect)}
              className="text-xs border rounded px-2 py-1 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {SQL_DIALECTS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <ToolSection label="SQL Input">
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null) }}
            placeholder="Paste your SQL query here..."
            className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            aria-label="SQL input"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleFormat} disabled={!input.trim()}>
              <AlignJustify className="h-3.5 w-3.5 mr-1" />
              Format
            </Button>
            <Button variant="outline" size="sm" onClick={handleMinify} disabled={!input.trim()}>
              <Minimize2 className="h-3.5 w-3.5 mr-1" />
              Minify
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLoadSample}>
              Sample
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>
        </ToolSection>

        <ToolSection label="Formatted Output">
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
                aria-label="Formatted SQL output"
              />
            </>
          ) : (
            <div className="h-80 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Formatted SQL will appear here
            </div>
          )}
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
