'use client'

import { useState, useCallback, useRef } from 'react'
import {
  diffLines,
  diffChars,
  diffJSON,
  formatAsPatch,
  type DiffResult,
} from '@/lib/tools/diff-checker'
import { downloadFile, readFileAsText } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Upload, Download, GitCompare, RotateCcw } from 'lucide-react'

type DiffMode = 'lines' | 'chars' | 'json'

const MODE_LABELS: Record<DiffMode, string> = {
  lines: 'Line Diff',
  chars: 'Character Diff',
  json: 'JSON Diff',
}

function DiffView({ result }: { result: DiffResult }) {
  return (
    <div className="rounded-md border overflow-auto max-h-[500px]" aria-label="Diff result">
      <div className="flex items-center gap-4 px-3 py-2 border-b bg-muted/30 text-xs text-muted-foreground sticky top-0">
        <span className="text-green-600 dark:text-green-400">+{result.summary.added} added</span>
        <span className="text-red-600 dark:text-red-400">-{result.summary.removed} removed</span>
        <span>{result.summary.unchanged} unchanged</span>
      </div>
      <div className="font-mono text-sm">
        {result.lines.map((line, i) => (
          <div
            key={i}
            className={`px-3 py-0.5 whitespace-pre-wrap break-all ${
              line.type === 'added'
                ? 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200'
                : line.type === 'removed'
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200'
                  : ''
            }`}
          >
            <span className="select-none text-muted-foreground mr-2 text-xs">
              {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
            </span>
            {line.value}
          </div>
        ))}
      </div>
    </div>
  )
}

export function DiffCheckerTool() {
  const [original, setOriginal] = useState('')
  const [modified, setModified] = useState('')
  const [mode, setMode] = useState<DiffMode>('lines')
  const [result, setResult] = useState<DiffResult | null>(null)
  const [loading, setLoading] = useState(false)
  const origFileRef = useRef<HTMLInputElement>(null)
  const modFileRef = useRef<HTMLInputElement>(null)

  const handleCompare = useCallback(async () => {
    setLoading(true)
    try {
      let r: DiffResult
      if (mode === 'lines') r = await diffLines(original, modified)
      else if (mode === 'chars') r = await diffChars(original, modified)
      else r = await diffJSON(original, modified)
      setResult(r)
    } finally {
      setLoading(false)
    }
  }, [original, modified, mode])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, target: 'original' | 'modified') {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await readFileAsText(file)
    if (target === 'original') setOriginal(text)
    else setModified(text)
  }

  function handleDownload() {
    if (!result) return
    downloadFile(formatAsPatch(result.lines), 'diff.patch', 'text/plain')
  }

  function handleReset() {
    setOriginal('')
    setModified('')
    setResult(null)
    if (origFileRef.current) origFileRef.current.value = ''
    if (modFileRef.current) modFileRef.current.value = ''
  }

  return (
    <ToolLayout>
      <ToolHeader
        title="Diff Checker"
        description="Compare two texts side by side and see exactly what changed."
        toolbar={
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border overflow-hidden">
              {(Object.keys(MODE_LABELS) as DiffMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 text-xs transition-colors ${mode === m ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  aria-pressed={mode === m}
                >
                  {MODE_LABELS[m]}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {(['original', 'modified'] as const).map((side) => (
          <ToolSection key={side} label={side === 'original' ? 'Original' : 'Modified'}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground/50">.txt .json .md .csv .yaml</span>
              <button
                onClick={() => (side === 'original' ? origFileRef : modFileRef).current?.click()}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Upload ${side} file`}
              >
                <Upload className="h-3 w-3" />
                Upload file
              </button>
              <input
                ref={side === 'original' ? origFileRef : modFileRef}
                type="file"
                accept="text/*,.json,.md,.txt,.csv,.yaml,.yml"
                className="hidden"
                onChange={(e) => handleFileUpload(e, side)}
                aria-label={`${side} file input`}
              />
            </div>
            <textarea
              value={side === 'original' ? original : modified}
              onChange={(e) => side === 'original' ? setOriginal(e.target.value) : setModified(e.target.value)}
              placeholder={`Paste ${side} text here...`}
              className="w-full h-64 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              aria-label={`${side} text`}
            />
          </ToolSection>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <Button onClick={handleCompare} disabled={loading || (!original && !modified)}>
          <GitCompare className="h-4 w-4 mr-2" />
          {loading ? 'Comparing...' : 'Compare'}
        </Button>
        {result && (
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Patch
          </Button>
        )}
        <Button variant="ghost" onClick={handleReset} disabled={!original && !modified && !result}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {result && <DiffView result={result} />}

    </ToolLayout>
  )
}
