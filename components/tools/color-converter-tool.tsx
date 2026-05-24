'use client'

import { useState, useCallback } from 'react'
import { parseHex, parseRGB, parseHSL, type ColorResult } from '@/lib/tools/color-converter'
import { copyToClipboard } from '@/lib/utils'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'

type CopiedField = 'hex' | 'rgb' | 'hsl' | null

function tryParse(input: string): ColorResult | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('#') || /^[0-9a-fA-F]{3,6}$/.test(trimmed)) return parseHex(trimmed)
  if (/^rgb/i.test(trimmed) || /^\d+\s*,/.test(trimmed)) return parseRGB(trimmed)
  if (/^hsl/i.test(trimmed)) return parseHSL(trimmed)
  // Try all parsers
  return parseHex(trimmed) ?? parseRGB(trimmed) ?? parseHSL(trimmed) ?? null
}

export function ColorConverterTool() {
  const [input, setInput] = useState('')
  const [pickerColor, setPickerColor] = useState('#3b82f6')
  const [result, setResult] = useState<ColorResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<CopiedField>(null)

  const process = useCallback((value: string) => {
    if (!value.trim()) {
      setResult(null)
      setError(null)
      return
    }
    const parsed = tryParse(value)
    if (parsed) {
      setResult(parsed)
      setError(null)
      setPickerColor(parsed.hex)
    } else {
      setError('Unrecognised color format. Try: #FF0000, rgb(255,0,0), or hsl(0,100%,50%)')
      setResult(null)
    }
  }, [])

  const handleInput = useCallback((value: string) => {
    setInput(value)
    process(value)
  }, [process])

  const handlePicker = useCallback((hex: string) => {
    setPickerColor(hex)
    setInput(hex)
    process(hex)
  }, [process])

  const handleCopy = useCallback(async (text: string, field: CopiedField) => {
    await copyToClipboard(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const rgbStr = result ? `rgb(${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})` : ''
  const hslStr = result ? `hsl(${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)` : ''

  return (
    <ToolLayout>
      <ToolHeader
        title="Color Converter"
        description="Convert between HEX, RGB, and HSL color formats with a live color preview."
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <ToolSection label="Color Input">
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => handleInput(e.target.value)}
                placeholder="#3b82f6 or rgb(59,130,246) or hsl(217,91%,60%)"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
                aria-label="Color value input"
              />
              <label className="relative cursor-pointer" aria-label="Color picker">
                <span className="sr-only">Pick a color</span>
                <div
                  className="w-10 h-10 rounded-md border border-input cursor-pointer"
                  style={{ backgroundColor: pickerColor }}
                />
                <input
                  type="color"
                  value={pickerColor}
                  onChange={(e) => handlePicker(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  aria-label="Color picker"
                />
              </label>
            </div>

            {error && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}

            {result && (
              <div
                className="w-full h-32 rounded-md border border-border transition-colors duration-200"
                style={{ backgroundColor: result.hex }}
                aria-label={`Color preview: ${result.hex}`}
              />
            )}
          </div>
        </ToolSection>

        <ToolSection label="Converted Values">
          {result ? (
            <div className="space-y-3">
              {[
                { label: 'HEX', value: result.hex, field: 'hex' as CopiedField },
                { label: 'RGB', value: rgbStr, field: 'rgb' as CopiedField },
                { label: 'HSL', value: hslStr, field: 'hsl' as CopiedField },
              ].map(({ label, value, field }) => (
                <div key={label} className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2.5">
                  <span className="text-xs font-medium text-muted-foreground w-8 shrink-0">{label}</span>
                  <code className="flex-1 text-sm font-mono">{value}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void handleCopy(value, field)}
                    className="h-7 px-2"
                    aria-label={`Copy ${label} value`}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span className="ml-1 text-xs">{copied === field ? 'Copied!' : 'Copy'}</span>
                  </Button>
                </div>
              ))}

              <div className="mt-2 rounded-md border border-border/60 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Color Components</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Red</p>
                    <p className="font-mono font-medium">{result.rgb.r}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Green</p>
                    <p className="font-mono font-medium">{result.rgb.g}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Blue</p>
                    <p className="font-mono font-medium">{result.rgb.b}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hue</p>
                    <p className="font-mono font-medium">{result.hsl.h}°</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Saturation</p>
                    <p className="font-mono font-medium">{result.hsl.s}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lightness</p>
                    <p className="font-mono font-medium">{result.hsl.l}%</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Enter a color value to convert
            </div>
          )}
        </ToolSection>
      </div>
    </ToolLayout>
  )
}
