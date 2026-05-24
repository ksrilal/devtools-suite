'use client'

import { useState, useCallback } from 'react'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { Check, X, Loader2, RotateCcw } from 'lucide-react'

export function BcryptGeneratorTool() {
  const [password, setPassword] = useState('')
  const [rounds, setRounds] = useState(12)
  const [hash, setHash] = useState('')
  const [generating, setGenerating] = useState(false)

  const [verifyPassword, setVerifyPassword] = useState('')
  const [verifyHash, setVerifyHash] = useState('')
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null)
  const [verifying, setVerifying] = useState(false)

  const handleResetGenerator = useCallback(() => {
    setPassword('')
    setRounds(12)
    setHash('')
  }, [])

  const handleResetVerifier = useCallback(() => {
    setVerifyPassword('')
    setVerifyHash('')
    setVerifyResult(null)
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!password) return
    setGenerating(true)
    try {
      const bcrypt = (await import('bcryptjs')).default
      const salt = await bcrypt.genSalt(rounds)
      const h = await bcrypt.hash(password, salt)
      setHash(h)
    } finally {
      setGenerating(false)
    }
  }, [password, rounds])

  const handleVerify = useCallback(async () => {
    if (!verifyPassword || !verifyHash) return
    setVerifying(true)
    try {
      const bcrypt = (await import('bcryptjs')).default
      const match = await bcrypt.compare(verifyPassword, verifyHash)
      setVerifyResult(match)
    } finally {
      setVerifying(false)
    }
  }, [verifyPassword, verifyHash])

  return (
    <ToolLayout>
      <ToolHeader
        title="Bcrypt Generator"
        description="Generate and verify bcrypt hashes locally in your browser. No data is transmitted."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generator */}
        <div className="space-y-4">
          <ToolSection
            label="Generate Hash"
            className="space-y-2"
          >
            <div className="flex justify-end -mt-1 mb-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetGenerator}
                disabled={!password && rounds === 12 && !hash}
                className="h-7 px-2 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />Reset
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block" htmlFor="bcrypt-password">
                  Password
                </label>
                <input
                  id="bcrypt-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') void handleGenerate() }}
                  placeholder="Enter password to hash"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
                  aria-label="Password to hash"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block" htmlFor="bcrypt-rounds">
                  Salt rounds: <span className="font-mono text-foreground">{rounds}</span>
                  <span className="text-muted-foreground/60 ml-2">
                    ({rounds <= 10 ? 'fast' : rounds <= 12 ? 'recommended' : 'slow'})
                  </span>
                </label>
                <input
                  id="bcrypt-rounds"
                  type="range"
                  min={4}
                  max={16}
                  value={rounds}
                  onChange={(e) => setRounds(Number(e.target.value))}
                  className="w-full accent-foreground"
                  aria-label="Salt rounds"
                />
                <div className="flex justify-between text-xs text-muted-foreground/60 mt-0.5">
                  <span>4 (fastest)</span>
                  <span>16 (strongest)</span>
                </div>
              </div>

              <Button
                onClick={() => void handleGenerate()}
                disabled={!password || generating}
                className="w-full"
              >
                {generating ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Hashing…</>
                ) : 'Generate Hash'}
              </Button>
            </div>
          </ToolSection>

          {hash && (
            <ToolSection label="Generated Hash">
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2.5">
                <code className="text-xs font-mono break-all text-foreground">{hash}</code>
              </div>
              <div className="mt-2 flex justify-end">
                <CopyButton text={hash} />
              </div>
            </ToolSection>
          )}
        </div>

        {/* Verifier */}
        <ToolSection label="Verify Hash">
          <div className="flex justify-end -mt-1 mb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetVerifier}
              disabled={!verifyPassword && !verifyHash && verifyResult === null}
              className="h-7 px-2 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />Reset
            </Button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block" htmlFor="verify-pw">
                Password
              </label>
              <input
                id="verify-pw"
                type="password"
                value={verifyPassword}
                onChange={(e) => { setVerifyPassword(e.target.value); setVerifyResult(null) }}
                placeholder="Password to verify"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
                aria-label="Password to verify"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block" htmlFor="verify-hash">
                Hash
              </label>
              <input
                id="verify-hash"
                type="text"
                value={verifyHash}
                onChange={(e) => { setVerifyHash(e.target.value); setVerifyResult(null) }}
                placeholder="$2b$12$..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
                aria-label="Hash to verify against"
              />
            </div>
            <Button
              onClick={() => void handleVerify()}
              disabled={!verifyPassword || !verifyHash || verifying}
              variant="outline"
              className="w-full"
            >
              {verifying ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Verifying…</>
              ) : 'Verify'}
            </Button>

            {verifyResult !== null && (
              <div
                className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium ${
                  verifyResult
                    ? 'border border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
                role="status"
              >
                {verifyResult
                  ? <><Check className="h-4 w-4" />Password matches the hash</>
                  : <><X className="h-4 w-4" />Password does not match</>}
              </div>
            )}

            <div className="rounded-md border border-border/50 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground space-y-1">
              <p className="font-medium">How bcrypt works</p>
              <p>Bcrypt is a one-way hashing function — you cannot reverse a hash to get the original password. Verification computes a new hash and compares the result.</p>
            </div>
          </div>
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
