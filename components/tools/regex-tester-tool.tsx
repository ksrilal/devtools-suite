'use client'

import { useState, useMemo } from 'react'
import {
  compileRegex,
  findMatches,
  previewReplace,
  explainRegex,
  tokeniseRegex,
  type RegexMatch,
} from '@/lib/tools/regex-tester'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

const FLAG_OPTIONS = [
  { flag: 'g', label: 'g', title: 'Global — find all matches' },
  { flag: 'i', label: 'i', title: 'Case-insensitive' },
  { flag: 'm', label: 'm', title: 'Multiline — ^ and $ match line boundaries' },
  { flag: 's', label: 's', title: 'DotAll — . matches newlines' },
  { flag: 'u', label: 'u', title: 'Unicode' },
]

function HighlightedText({ text, matches }: { text: string; matches: RegexMatch[] }) {
  if (matches.length === 0) return <span>{text}</span>

  const parts: React.ReactNode[] = []
  let cursor = 0

  for (const match of matches) {
    if (match.index > cursor) {
      parts.push(<span key={`text-${cursor}`}>{text.slice(cursor, match.index)}</span>)
    }
    parts.push(
      <mark
        key={`match-${match.index}`}
        className="bg-yellow-200 dark:bg-yellow-800/60 rounded-sm"
        title={`Match: "${match.value}"`}
      >
        {text.slice(match.index, match.index + match.length)}
      </mark>
    )
    cursor = match.index + match.length
  }

  if (cursor < text.length) {
    parts.push(<span key="text-end">{text.slice(cursor)}</span>)
  }

  return <>{parts}</>
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState<Set<string>>(new Set(['g']))
  const [testInput, setTestInput] = useState('')
  const [replacement, setReplacement] = useState('')

  const flagString = Array.from(flags).join('')

  const { regex, error } = useMemo(
    () => (pattern ? compileRegex(pattern, flagString) : { regex: null, error: null }),
    [pattern, flagString]
  )

  const matchResult = useMemo(
    () => (regex && testInput ? findMatches(regex, testInput) : null),
    [regex, testInput]
  )

  const replacePreview = useMemo(() => {
    if (!regex || !testInput) return ''
    return previewReplace(regex, testInput, replacement)
  }, [regex, testInput, replacement])

  const explanation = useMemo(() => explainRegex(pattern), [pattern])
  const tokens = useMemo(() => (pattern ? tokeniseRegex(pattern) : []), [pattern])

  function toggleFlag(flag: string) {
    setFlags((prev) => {
      const next = new Set(prev)
      if (next.has(flag)) next.delete(flag)
      else next.add(flag)
      return next
    })
  }

  function handleReset() {
    setPattern('')
    setFlags(new Set(['g']))
    setTestInput('')
    setReplacement('')
  }

  return (
    <ToolLayout>
      <ToolHeader
        title="Regex Tester"
        description="Test regular expressions live with match highlighting, replace preview, and explanations."
      />

      {/* Pattern input */}
      <ToolSection label="Pattern" className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-mono text-lg">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background ${error ? 'border-destructive' : 'border-input'}`}
            aria-label="Regular expression pattern"
            spellCheck={false}
          />
          <span className="text-muted-foreground font-mono text-lg">/{flagString}</span>
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={!pattern && !testInput && !replacement}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        </div>

        {error && (
          <p className="text-xs text-destructive mt-1" role="alert">{error}</p>
        )}

        {/* Flags */}
        <div className="flex flex-wrap items-start gap-x-4 gap-y-2 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Flags:</span>
            {FLAG_OPTIONS.map(({ flag, label, title }) => (
              <button
                key={flag}
                onClick={() => toggleFlag(flag)}
                title={title}
                aria-pressed={flags.has(flag)}
                className={`w-7 h-7 text-xs font-mono rounded border transition-colors ${flags.has(flag) ? 'bg-primary text-primary-foreground border-primary' : 'border-input hover:bg-muted'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {FLAG_OPTIONS.map(({ flag, title }) => (
              <span key={flag} className="text-xs text-muted-foreground/60">
                <span className="font-mono text-foreground/70">{flag}</span> {title}
              </span>
            ))}
          </div>
        </div>
      </ToolSection>

      {/* Token breakdown */}
      {tokens.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {tokens.filter(t => t.type !== 'literal').map((tok, i) => (
            <span
              key={i}
              title={tok.description}
              className={`px-2 py-0.5 text-xs font-mono rounded-full border cursor-help ${
                tok.type === 'meta' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300' :
                tok.type === 'quantifier' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/30 dark:border-orange-800 dark:text-orange-300' :
                tok.type === 'anchor' ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-300' :
                tok.type === 'group' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-300' :
                tok.type === 'class' ? 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-950/30 dark:border-yellow-800 dark:text-yellow-300' :
                'bg-muted border-border text-muted-foreground'
              }`}
            >
              {tok.value}
            </span>
          ))}
        </div>
      )}

      <Tabs defaultValue="match">
        <TabsList className="mb-4">
          <TabsTrigger value="match">
            Match
            {matchResult && matchResult.matchCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                {matchResult.matchCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="replace">Replace</TabsTrigger>
          <TabsTrigger value="explain">Explain</TabsTrigger>
        </TabsList>

        <TabsContent value="match">
          <ToolSection label="Test Input">
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter text to test against your regex..."
              className="w-full h-40 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              aria-label="Test input text"
            />
          </ToolSection>

          {testInput && matchResult && (
            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {matchResult.matchCount === 0
                  ? 'No matches'
                  : `${matchResult.matchCount} match${matchResult.matchCount !== 1 ? 'es' : ''}`}
              </p>
              <div className="rounded-md border bg-muted/30 px-3 py-2 font-mono text-sm whitespace-pre-wrap break-all min-h-[80px]" aria-live="polite" aria-label="Match highlights">
                <HighlightedText text={testInput} matches={matchResult.matches} />
              </div>
              {matchResult.matches.length > 0 && (
                <div className="mt-3 space-y-1 max-h-40 overflow-auto">
                  {matchResult.matches.map((m, i) => (
                    <div key={i} className="text-xs font-mono text-muted-foreground">
                      <span className="text-foreground">#{i + 1}</span>{' '}
                      pos {m.index}–{m.index + m.length}:{' '}
                      <span className="text-yellow-600 dark:text-yellow-400">"{m.value}"</span>
                      {m.groups && Object.keys(m.groups).length > 0 && (
                        <span className="ml-2 text-blue-500">
                          {JSON.stringify(m.groups)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="replace">
          <ToolSection label="Replacement String">
            <input
              type="text"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="Replacement (use $1, $2 for capture groups, $& for full match)..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Replacement string"
            />
          </ToolSection>

          {testInput && replacePreview !== testInput && (
            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Preview</p>
              <div className="rounded-md border bg-muted/30 px-3 py-2 font-mono text-sm whitespace-pre-wrap break-all min-h-[80px]">
                {replacePreview}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="explain">
          {pattern ? (
            <div className="rounded-md border bg-muted/30 p-4">
              <pre className="text-sm whitespace-pre-wrap font-mono">{explanation || 'Literal pattern — matches the exact characters.'}</pre>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter a pattern above to see an explanation.</p>
          )}
        </TabsContent>
      </Tabs>

    </ToolLayout>
  )
}
