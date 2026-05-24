export interface ColorError {
  message: string
}

export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

export interface ColorResult {
  hex: string
  rgb: RGB
  hsl: HSL
  error: ColorError | null
}

export function parseHex(hex: string): ColorResult | null {
  const clean = hex.replace('#', '').trim()
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return buildResult(r, g, b)
}

export function parseRGB(input: string): ColorResult | null {
  const m = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.exec(input.trim())
    ?? /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)$/.exec(input.trim())
  if (!m) return null
  const r = parseInt(m[1] ?? '0', 10)
  const g = parseInt(m[2] ?? '0', 10)
  const b = parseInt(m[3] ?? '0', 10)
  if (r > 255 || g > 255 || b > 255) return null
  return buildResult(r, g, b)
}

export function parseHSL(input: string): ColorResult | null {
  const m = /^hsl\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%?\s*,\s*(\d+(?:\.\d+)?)%?\s*\)$/i.exec(input.trim())
    ?? /^(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)$/.exec(input.trim())
  if (!m) return null
  const h = parseFloat(m[1] ?? '0')
  const s = parseFloat(m[2] ?? '0')
  const l = parseFloat(m[3] ?? '0')
  if (h > 360 || s > 100 || l > 100) return null
  const rgb = hslToRgb(h, s, l)
  return buildResult(rgb.r, rgb.g, rgb.b)
}

function buildResult(r: number, g: number, b: number): ColorResult {
  const hex = rgbToHex(r, g, b)
  const hsl = rgbToHsl(r, g, b)
  return { hex, rgb: { r, g, b }, hsl, error: null }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const sn = s / 100, ln = l / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = ln - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else { r = c; b = x }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}
