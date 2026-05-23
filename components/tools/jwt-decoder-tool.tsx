'use client'

import { useState, useCallback } from 'react'
import {
  decodeJWT,
  formatRelativeTime,
  annotateStandardClaims,
  type JWTDecoded,
  type ExpiryStatus,
} from '@/lib/tools/jwt-decoder'
import { copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, CheckCircle2, XCircle, Clock, AlertCircle, RotateCcw } from 'lucide-react'

const EXPIRY_CONFIG: Record<ExpiryStatus, { icon: typeof CheckCircle2; label: string; className: string }> = {
  valid: { icon: CheckCircle2, label: 'Valid', className: 'text-green-600 dark:text-green-400' },
  expired: { icon: XCircle, label: 'Expired', className: 'text-destructive' },
  'not-yet-valid': { icon: Clock, label: 'Not Yet Valid', className: 'text-yellow-600 dark:text-yellow-400' },
  'no-expiry': { icon: AlertCircle, label: 'No Expiry', className: 'text-muted-foreground' },
}

function ClaimValue({ value }: { value: unknown }) {
  if (typeof value === 'number' && (value > 1000000000) && (value < 9999999999)) {
    const date = new Date(value * 1000)
    return (
      <span className="font-mono text-sm">
        {value}{' '}
        <span className="text-muted-foreground text-xs">
          ({date.toISOString()} · {formatRelativeTime(value)})
        </span>
      </span>
    )
  }
  return <span className="font-mono text-sm break-all">{JSON.stringify(value)}</span>
}

export function JWTDecoderTool() {
  const [input, setInput] = useState('')
  const [decoded, setDecoded] = useState<JWTDecoded | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const handleDecode = useCallback(() => {
    if (!input.trim()) return
    try {
      const result = decodeJWT(input.trim())
      setDecoded(result)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to decode token')
      setDecoded(null)
    }
  }, [input])

  function handleReset() {
    setInput('')
    setDecoded(null)
    setError(null)
  }

  async function handleCopy(text: string, key: string) {
    await copyToClipboard(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const payloadAnnotated = decoded ? annotateStandardClaims(decoded.payload) : []
  const statusConfig = decoded ? EXPIRY_CONFIG[decoded.expiryStatus] : null

  return (
    <ToolLayout>
      <ToolHeader
        title="JWT Decoder"
        description="Decode JSON Web Tokens and inspect claims. Your token never leaves your browser."
      />

      <ToolSection label="Token Input" className="mb-6">
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setDecoded(null); setError(null) }}
          placeholder="Paste your JWT token here...&#10;&#10;eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          className="w-full h-28 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
          aria-label="JWT token input"
        />
        <div className="flex gap-2">
          <Button onClick={handleDecode} disabled={!input.trim()}>
            Decode Token
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={!input && !decoded && !error}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        </div>
      </ToolSection>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-4" role="alert">
          <XCircle className="inline h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {decoded && (
        <div className="space-y-4">
          {/* Status badge */}
          {statusConfig && (
            <div className={`flex items-center gap-2 text-sm font-medium ${statusConfig.className}`}>
              <statusConfig.icon className="h-4 w-4" aria-hidden="true" />
              Token status: {statusConfig.label}
            </div>
          )}

          {/* Header */}
          <div className="rounded-lg border">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
              <h2 className="text-sm font-semibold">Header</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2), 'header')}
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                {copied === 'header' ? 'Copied!' : 'Copy JSON'}
              </Button>
            </div>
            <div className="divide-y">
              {Object.entries(decoded.header).map(([k, v]) => (
                <div key={k} className="flex items-start gap-3 px-4 py-2">
                  <span className="text-blue-500 dark:text-blue-400 font-mono text-sm font-medium w-16 shrink-0">{k}</span>
                  <ClaimValue value={v} />
                </div>
              ))}
            </div>
          </div>

          {/* Payload */}
          <div className="rounded-lg border">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
              <h2 className="text-sm font-semibold">Payload</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2), 'payload')}
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                {copied === 'payload' ? 'Copied!' : 'Copy JSON'}
              </Button>
            </div>
            <div className="divide-y">
              {payloadAnnotated.map(({ key, value, description }) => (
                <div key={key} className="flex items-start gap-3 px-4 py-2">
                  <div className="w-16 shrink-0">
                    <span className="text-blue-500 dark:text-blue-400 font-mono text-sm font-medium">{key}</span>
                    {description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                    )}
                  </div>
                  <ClaimValue value={value} />
                </div>
              ))}
            </div>
          </div>

          {/* Signature */}
          <div className="rounded-lg border p-4">
            <h2 className="text-sm font-semibold mb-2">Signature (not verified)</h2>
            <p className="font-mono text-xs text-muted-foreground break-all">{decoded.signatureRaw}</p>
          </div>
        </div>
      )}

    </ToolLayout>
  )
}
