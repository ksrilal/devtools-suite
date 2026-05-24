'use client'

import { useState, useCallback, useEffect } from 'react'
import { generateJWT, decodeJWTParts } from '@/lib/tools/jwt-generator'
import { copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, RefreshCw } from 'lucide-react'

const DEFAULT_HEADER = JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2)
const DEFAULT_PAYLOAD = JSON.stringify({
  sub: '1234567890',
  name: 'Alice',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
}, null, 2)

export function JWTGeneratorTool() {
  const [header, setHeader] = useState(DEFAULT_HEADER)
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD)
  const [secret, setSecret] = useState('your-256-bit-secret')
  const [token, setToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [decoded, setDecoded] = useState<{ header: string; payload: string } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const generate = useCallback(async (h: string, p: string, s: string) => {
    if (!h.trim() || !p.trim()) { setToken(''); setError(null); setDecoded(null); return }
    const result = await generateJWT(h, p, s)
    if (result.error) { setError(result.error.message); setToken(''); setDecoded(null) }
    else {
      setToken(result.token)
      setError(null)
      setDecoded(decodeJWTParts(result.token))
    }
  }, [])

  useEffect(() => { void generate(header, payload, secret) }, [header, payload, secret, generate])

  const handleCopy = useCallback(async (value: string, key: string) => {
    await copyToClipboard(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const handleReset = useCallback(() => {
    setHeader(DEFAULT_HEADER)
    setPayload(DEFAULT_PAYLOAD)
    setSecret('your-256-bit-secret')
  }, [])

  return (
    <ToolLayout>
      <ToolHeader
        title="JWT Generator"
        description="Generate signed JWT tokens locally using HS256 and the browser Web Crypto API. No server involved."
        toolbar={
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />Reset
          </Button>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Inputs */}
        <div className="space-y-4">
          <ToolSection label="Header JSON">
            <textarea
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="JWT header JSON"
              spellCheck={false}
            />
          </ToolSection>

          <ToolSection label="Payload JSON">
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={8}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="JWT payload JSON"
              spellCheck={false}
            />
          </ToolSection>

          <ToolSection label="Secret (HS256)">
            <div className="flex gap-2">
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="JWT secret"
                spellCheck={false}
              />
            </div>
            <p className="text-xs text-muted-foreground">Only HS256 is supported. The secret never leaves your browser.</p>
          </ToolSection>
        </div>

        {/* Output */}
        <div className="space-y-4">
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</div>
          )}

          {token && (
            <>
              <ToolSection label="Generated Token">
                <div className="flex gap-1 mb-1">
                  <Button variant="outline" size="sm" onClick={() => void handleCopy(token, 'token')}>
                    <Copy className="h-3.5 w-3.5 mr-1" />{copied === 'token' ? 'Copied!' : 'Copy Token'}
                  </Button>
                </div>
                <div className="rounded-md border border-input bg-muted/30 px-3 py-3 text-xs font-mono break-all leading-relaxed">
                  <span className="text-red-400">{token.split('.')[0]}</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-purple-400">{token.split('.')[1]}</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-cyan-400">{token.split('.')[2]}</span>
                </div>
              </ToolSection>

              {decoded && (
                <>
                  <ToolSection label="Decoded Header">
                    <div className="flex gap-1 mb-1">
                      <Button variant="ghost" size="sm" onClick={() => void handleCopy(decoded.header, 'dheader')}>
                        <Copy className="h-3.5 w-3.5 mr-1" />{copied === 'dheader' ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <pre className="rounded-md border border-input bg-muted/30 px-3 py-2 text-xs font-mono overflow-auto">{decoded.header}</pre>
                  </ToolSection>
                  <ToolSection label="Decoded Payload">
                    <div className="flex gap-1 mb-1">
                      <Button variant="ghost" size="sm" onClick={() => void handleCopy(decoded.payload, 'dpayload')}>
                        <Copy className="h-3.5 w-3.5 mr-1" />{copied === 'dpayload' ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <pre className="rounded-md border border-input bg-muted/30 px-3 py-2 text-xs font-mono overflow-auto">{decoded.payload}</pre>
                  </ToolSection>
                </>
              )}
            </>
          )}

          {!token && !error && (
            <div className="h-64 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Token will appear as you edit
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
