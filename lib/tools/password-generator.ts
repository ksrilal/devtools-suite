export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMS = '0123456789'
const SYMS = '!@#$%^&*()-_=+[]{}|;:,.<>?'

export function generatePassword(opts: PasswordOptions): string {
  let charset = ''
  const required: string[] = []

  if (opts.uppercase) { charset += UPPER; required.push(randomFrom(UPPER)) }
  if (opts.lowercase) { charset += LOWER; required.push(randomFrom(LOWER)) }
  if (opts.numbers) { charset += NUMS; required.push(randomFrom(NUMS)) }
  if (opts.symbols) { charset += SYMS; required.push(randomFrom(SYMS)) }

  if (!charset) charset = LOWER

  const len = Math.max(required.length, opts.length)
  const arr = new Uint32Array(len)
  crypto.getRandomValues(arr)

  const password = Array.from(arr, (n) => charset[n % charset.length]).join('')

  // Splice required chars in at random positions (crypto-secure shuffle)
  const chars = password.split('')
  const positions = new Uint32Array(required.length)
  crypto.getRandomValues(positions)
  required.forEach((ch, i) => {
    const pos = (positions[i] ?? 0) % len
    chars[pos] = ch
  })

  return chars.join('')
}

function randomFrom(str: string): string {
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return str[(arr[0] ?? 0) % str.length] ?? str[0] ?? ''
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

export function measureStrength(password: string): { score: number; label: PasswordStrength; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { score, label: 'weak', color: 'bg-red-500' }
  if (score <= 4) return { score, label: 'fair', color: 'bg-yellow-500' }
  if (score <= 5) return { score, label: 'good', color: 'bg-blue-500' }
  return { score, label: 'strong', color: 'bg-green-500' }
}
