'use client'

import { useState, useCallback } from 'react'
import { encodeBase64, decodeBase64 } from '@/lib/tools/base64'
import { copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, Trash2, ArrowDownUp } from 'lucide-react'

export function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const process = useCallback((value: string, currentMode: 'encode' | 'decode') => {
    if (!value.trim()) {
      setOutput('')
      setError(null)
      return
    }
    const result = currentMode === 'encode' ? encodeBase64(value) : decodeBase64(value)
    if (result.error) {
      setError(result.error.message)
      setOutput('')
    } else {
      setOutput(result.output)
      setError(null)
    }
  }, [])

  const handleInput = useCallback((value: string) => {
    setInput(value)
    process(value, mode)
  }, [mode, process])

  const handleModeToggle = useCallback(() => {
    const next = mode === 'encode' ? 'decode' : 'encode'
    setMode(next)
    process(input, next)
  }, [mode, input, process])

  const handleCopy = useCallback(async () => {
    if (!output) return
    await copyToClipboard(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setError(null)
  }, [])

  return (
    <ToolLayout>
      <ToolHeader
        title="Base64 Encoder / Decoder"
        description="Encode text to Base64 or decode Base64 back to plain text — instantly in your browser."
        toolbar={
          <Button variant="outline" size="sm" onClick={handleModeToggle}>
            <ArrowDownUp className="h-3.5 w-3.5 mr-1" />
            {mode === 'encode' ? 'Switch to Decode' : 'Switch to Encode'}
          </Button>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <ToolSection label={mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}>
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            aria-label={mode === 'encode' ? 'Text input to encode' : 'Base64 input to decode'}
          />
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output}>
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        </ToolSection>

        <ToolSection label={mode === 'encode' ? 'Base64 Output' : 'Decoded Output'}>
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
              </div>
              <textarea
                readOnly
                value={output}
                className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={mode === 'encode' ? 'Base64 encoded output' : 'Decoded text output'}
              />
            </>
          ) : (
            <div className="h-80 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              {mode === 'encode' ? 'Base64 output will appear here' : 'Decoded text will appear here'}
            </div>
          )}
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
