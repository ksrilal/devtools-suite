'use client'

import { useState, useCallback, useEffect } from 'react'
import { generateHash, HASH_ALGORITHMS, type HashAlgorithm } from '@/lib/tools/hash-generator'
import { copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, Loader2 } from 'lucide-react'

type CopiedField = HashAlgorithm | null

interface HashState {
  value: string
  loading: boolean
  error: string | null
}

function makeInitialState(): Record<HashAlgorithm, HashState> {
  const s: Partial<Record<HashAlgorithm, HashState>> = {}
  for (const alg of HASH_ALGORITHMS) {
    s[alg] = { value: '', loading: false, error: null }
  }
  return s as Record<HashAlgorithm, HashState>
}

export function HashGeneratorTool() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<HashAlgorithm, HashState>>(makeInitialState)
  const [copied, setCopied] = useState<CopiedField>(null)

  const computeAll = useCallback(async (text: string) => {
    if (!text) {
      setHashes(makeInitialState())
      return
    }
    // Mark all loading
    setHashes((prev) => {
      const next = { ...prev }
      for (const alg of HASH_ALGORITHMS) {
        next[alg] = { value: '', loading: true, error: null }
      }
      return next
    })
    // Compute all in parallel
    const results = await Promise.all(
      HASH_ALGORITHMS.map((alg) => generateHash(text, alg).then((r) => ({ alg, r })))
    )
    setHashes((prev) => {
      const next = { ...prev }
      for (const { alg, r } of results) {
        next[alg] = {
          value: r.hash,
          loading: false,
          error: r.error?.message ?? null,
        }
      }
      return next
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      void computeAll(input)
    }, 200)
    return () => clearTimeout(timer)
  }, [input, computeAll])

  const handleCopy = useCallback(async (value: string, alg: HashAlgorithm) => {
    await copyToClipboard(value)
    setCopied(alg)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  return (
    <ToolLayout>
      <ToolHeader
        title="Hash Generator"
        description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes using browser-native Web Crypto APIs."
      />

      <div className="space-y-4">
        <ToolSection label="Input Text">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-40 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            aria-label="Text input for hashing"
          />
        </ToolSection>

        <ToolSection label="Hash Outputs">
          {!input ? (
            <div className="h-40 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Type text above to generate hashes
            </div>
          ) : (
            <div className="rounded-md border border-border overflow-hidden">
              {HASH_ALGORITHMS.map((alg) => {
                const state = hashes[alg]
                return (
                  <div key={alg} className="border-b border-border/50 last:border-0 p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{alg}</span>
                      {state.value && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => void handleCopy(state.value, alg)}
                          className="h-6 px-2"
                          aria-label={`Copy ${alg} hash`}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          <span className="text-xs">{copied === alg ? 'Copied!' : 'Copy'}</span>
                        </Button>
                      )}
                    </div>
                    {state.loading ? (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Computing…
                      </div>
                    ) : state.error ? (
                      <p className="text-xs text-destructive">{state.error}</p>
                    ) : (
                      <code className="text-xs font-mono break-all text-foreground/80">{state.value}</code>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
