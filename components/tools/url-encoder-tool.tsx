'use client'

import { useState, useCallback } from 'react'
import { encodeURL, decodeURL } from '@/lib/tools/url-encoder'
import { copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy, Trash2, ArrowDownUp } from 'lucide-react'

export function URLEncoderTool() {
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
    const result = currentMode === 'encode' ? encodeURL(value) : decodeURL(value)
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
        title="URL Encoder / Decoder"
        description="Percent-encode URLs or decode encoded URL strings — real-time, in your browser."
        toolbar={
          <Button variant="outline" size="sm" onClick={handleModeToggle}>
            <ArrowDownUp className="h-3.5 w-3.5 mr-1" />
            {mode === 'encode' ? 'Switch to Decode' : 'Switch to Encode'}
          </Button>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <ToolSection label={mode === 'encode' ? 'URL Input' : 'Encoded URL Input'}>
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'https://example.com/search?q=hello world&lang=en'
                : 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world'
            }
            className="w-full h-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            aria-label={mode === 'encode' ? 'URL to encode' : 'Encoded URL to decode'}
          />
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output}>
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        </ToolSection>

        <ToolSection label={mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}>
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
                aria-label={mode === 'encode' ? 'Encoded URL output' : 'Decoded URL output'}
              />
            </>
          ) : (
            <div className="h-80 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              {mode === 'encode' ? 'Encoded URL will appear here' : 'Decoded URL will appear here'}
            </div>
          )}
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
