'use client'

import { useState, useCallback } from 'react'
import { generateMultipleUUIDs } from '@/lib/tools/uuid-generator'
import { copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, RefreshCw, Trash2 } from 'lucide-react'

const COUNT_OPTIONS = [1, 5, 10, 20, 50]

export function UUIDGeneratorTool() {
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const generate = useCallback(() => {
    setUuids(generateMultipleUUIDs(count))
    setCopiedIndex(null)
    setCopiedAll(false)
  }, [count])

  const handleCopySingle = useCallback(async (uuid: string, index: number) => {
    await copyToClipboard(uuid)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }, [])

  const handleCopyAll = useCallback(async () => {
    if (!uuids.length) return
    await copyToClipboard(uuids.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }, [uuids])

  const handleClear = useCallback(() => {
    setUuids([])
  }, [])

  return (
    <ToolLayout>
      <ToolHeader
        title="UUID Generator"
        description="Generate cryptographically random UUID v4 values in your browser."
        toolbar={
          <div className="flex items-center gap-2">
            <label htmlFor="uuid-count" className="text-xs text-muted-foreground">Count</label>
            <select
              id="uuid-count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="text-xs border rounded px-2 py-1 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {COUNT_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        }
      />

      <ToolSection label="Generated UUIDs">
        <div className="flex flex-wrap gap-2 mb-3">
          <Button size="sm" onClick={generate}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Generate
          </Button>
          {uuids.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                <Copy className="h-3.5 w-3.5 mr-1" />
                {copiedAll ? 'Copied all!' : 'Copy all'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            </>
          )}
        </div>

        {uuids.length === 0 ? (
          <div className="h-64 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
            Click Generate to create UUIDs
          </div>
        ) : (
          <div className="rounded-md border border-border overflow-hidden">
            {uuids.map((uuid, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2.5 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group"
              >
                <code className="text-sm font-mono text-foreground select-all">{uuid}</code>
                <button
                  onClick={() => handleCopySingle(uuid, i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent ml-2 shrink-0"
                  aria-label={`Copy UUID ${uuid}`}
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  {copiedIndex === i && (
                    <span className="sr-only">Copied</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {copiedIndex !== null && (
          <p className="text-xs text-muted-foreground mt-1">UUID copied to clipboard</p>
        )}
      </ToolSection>
    </ToolLayout>
  )
}
