'use client'

import { useState, useCallback } from 'react'
import { generatePassword, measureStrength, type PasswordOptions } from '@/lib/tools/password-generator'
import { copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, RefreshCw, Trash2 } from 'lucide-react'

const DEFAULT_OPTS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
}

const COUNT_OPTIONS = [1, 5, 10]

export function PasswordGeneratorTool() {
  const [opts, setOpts] = useState<PasswordOptions>(DEFAULT_OPTS)
  const [count, setCount] = useState(1)
  const [passwords, setPasswords] = useState<string[]>([])
  const [copied, setCopied] = useState<number | 'all' | null>(null)

  const generate = useCallback((options: PasswordOptions, num: number) => {
    const list = Array.from({ length: num }, () => generatePassword(options))
    setPasswords(list)
    setCopied(null)
  }, [])

  const handleGenerate = useCallback(() => generate(opts, count), [generate, opts, count])

  const updateOpt = useCallback(<K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleCopyOne = useCallback(async (pw: string, i: number) => {
    await copyToClipboard(pw)
    setCopied(i)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const handleCopyAll = useCallback(async () => {
    if (!passwords.length) return
    await copyToClipboard(passwords.join('\n'))
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
  }, [passwords])

  const strength = passwords[0] ? measureStrength(passwords[0]) : null

  const Toggle = ({ label, field }: { label: string; field: keyof PasswordOptions }) => (
    <button
      onClick={() => updateOpt(field, !opts[field])}
      aria-pressed={!!opts[field]}
      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${opts[field] ? 'bg-foreground text-background border-foreground' : 'border-input text-muted-foreground hover:bg-accent'}`}
    >
      {label}
    </button>
  )

  return (
    <ToolLayout>
      <ToolHeader
        title="Password Generator"
        description="Generate cryptographically secure passwords using browser-native Web Crypto APIs. No passwords sent anywhere."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Options */}
        <div className="space-y-5">
          <ToolSection label="Length">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={4}
                max={128}
                value={opts.length}
                onChange={(e) => updateOpt('length', Number(e.target.value))}
                className="flex-1 accent-foreground"
                aria-label="Password length"
              />
              <input
                type="number"
                min={4}
                max={128}
                value={opts.length}
                onChange={(e) => updateOpt('length', Math.min(128, Math.max(4, Number(e.target.value))))}
                className="w-16 rounded-md border border-input bg-background px-2 py-1 text-sm font-mono text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Password length value"
              />
            </div>
          </ToolSection>

          <ToolSection label="Character sets">
            <div className="flex flex-wrap gap-2">
              <Toggle label="A–Z Uppercase" field="uppercase" />
              <Toggle label="a–z Lowercase" field="lowercase" />
              <Toggle label="0–9 Numbers" field="numbers" />
              <Toggle label="!@# Symbols" field="symbols" />
            </div>
          </ToolSection>

          <ToolSection label="Count">
            <div className="flex gap-2">
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  aria-pressed={count === n}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${count === n ? 'bg-foreground text-background border-foreground' : 'border-input text-muted-foreground hover:bg-accent'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </ToolSection>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGenerate}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Generate
            </Button>
            {passwords.length > 1 && (
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                <Copy className="h-3.5 w-3.5 mr-1" />
                {copied === 'all' ? 'Copied all!' : 'Copy all'}
              </Button>
            )}
            {passwords.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setPasswords([])}>
                <Trash2 className="h-3.5 w-3.5 mr-1" />Clear
              </Button>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          {passwords.length === 0 ? (
            <div className="h-48 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Click Generate to create passwords
            </div>
          ) : (
            <>
              {/* Strength indicator for first password */}
              {strength && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Strength</span>
                    <span className={`font-medium capitalize ${strength.label === 'strong' ? 'text-green-500' : strength.label === 'good' ? 'text-blue-500' : strength.label === 'fair' ? 'text-yellow-500' : 'text-red-500'}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 7) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="rounded-md border border-border overflow-hidden">
                {passwords.map((pw, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2.5 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                    <code className="flex-1 text-sm font-mono break-all select-all">{pw}</code>
                    <button
                      onClick={() => void handleCopyOne(pw, i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent shrink-0"
                      aria-label={`Copy password ${i + 1}`}
                    >
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    {copied === i && <span className="text-xs text-green-500 shrink-0">Copied!</span>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
