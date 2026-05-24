'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { ToolLayout, ToolHeader, ToolSection } from './tool-layout'
import { Button } from '@/components/ui/button'
import { Download, Trash2 } from 'lucide-react'

const SIZE_OPTIONS = [128, 256, 512] as const
type QRSize = typeof SIZE_OPTIONS[number]

const SAMPLE = 'https://devtoolssuite.dev'

export function QRCodeGeneratorTool() {
  const [input, setInput] = useState(SAMPLE)
  const [size, setSize] = useState<QRSize>(256)
  const [darkColor, setDarkColor] = useState('#000000')
  const [lightColor, setLightColor] = useState('#ffffff')
  const [error, setError] = useState<string | null>(null)
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generate = useCallback(async (text: string, sz: QRSize, dark: string, light: string) => {
    if (!text.trim()) { setDataUrl(null); setError(null); return }
    try {
      const QRCode = (await import('qrcode')).default
      const canvas = canvasRef.current
      if (!canvas) return
      await QRCode.toCanvas(canvas, text, {
        width: sz,
        color: { dark, light },
        errorCorrectionLevel: 'H',
      })
      setDataUrl(canvas.toDataURL('image/png'))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate QR code.')
      setDataUrl(null)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => { void generate(input, size, darkColor, lightColor) }, 200)
    return () => clearTimeout(timer)
  }, [input, size, darkColor, lightColor, generate])

  const handleDownload = useCallback(() => {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'qrcode.png'
    a.click()
  }, [dataUrl])

  const handleClear = useCallback(() => {
    setInput('')
    setDataUrl(null)
    setError(null)
  }, [])

  return (
    <ToolLayout>
      <ToolHeader
        title="QR Code Generator"
        description="Generate QR codes from any text or URL. Download as PNG. Fully client-side, nothing sent to a server."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Options */}
        <div className="space-y-5">
          <ToolSection label="Text or URL">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://example.com or any text..."
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              aria-label="QR code content"
            />
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />Clear
            </Button>
          </ToolSection>

          <ToolSection label="Size">
            <div className="flex gap-2">
              {SIZE_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${size === s ? 'bg-foreground text-background border-foreground' : 'border-input text-muted-foreground hover:bg-accent'}`}
                >
                  {s}×{s}
                </button>
              ))}
            </div>
          </ToolSection>

          <ToolSection label="Colors">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground text-xs">Dark</span>
                <div className="relative w-8 h-8 rounded border border-input overflow-hidden">
                  <div className="absolute inset-0" style={{ backgroundColor: darkColor }} />
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    aria-label="QR dark color"
                  />
                </div>
                <code className="text-xs font-mono">{darkColor}</code>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground text-xs">Light</span>
                <div className="relative w-8 h-8 rounded border border-input overflow-hidden">
                  <div className="absolute inset-0" style={{ backgroundColor: lightColor }} />
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    aria-label="QR light color"
                  />
                </div>
                <code className="text-xs font-mono">{lightColor}</code>
              </label>
            </div>
          </ToolSection>

          {dataUrl && (
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />Download PNG
            </Button>
          )}
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-start gap-3">
          <ToolSection label="QR Code Preview" className="w-full">
            {error && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</div>
            )}
            <div className={`flex items-center justify-center rounded-md border ${input.trim() ? 'border-border' : 'border-dashed border-border'} p-4 bg-background`}>
              <canvas
                ref={canvasRef}
                className={input.trim() ? 'block rounded' : 'hidden'}
                aria-label="Generated QR code"
              />
              {!input.trim() && (
                <div className="text-muted-foreground text-sm py-12">Enter text above to generate a QR code</div>
              )}
            </div>
          </ToolSection>
        </div>
      </div>
    </ToolLayout>
  )
}
