export interface JWTHeader {
  alg?: string
  typ?: string
  kid?: string
  [key: string]: unknown
}

export interface JWTClaims {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  iat?: number
  jti?: string
  [key: string]: unknown
}

export interface JWTDecoded {
  header: JWTHeader
  payload: JWTClaims
  signatureRaw: string
  isExpired: boolean
  expiryStatus: ExpiryStatus
}

export type ExpiryStatus = 'valid' | 'expired' | 'no-expiry' | 'not-yet-valid'

function base64UrlDecode(str: string): string {
  // Normalize base64url to base64
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  try {
    return decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
  } catch {
    return atob(padded)
  }
}

export function decodeJWT(token: string): JWTDecoded {
  const parts = token.trim().split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT: expected 3 parts separated by dots')

  const [headerB64, payloadB64, signatureRaw] = parts as [string, string, string]

  let header: JWTHeader
  let payload: JWTClaims

  try {
    header = JSON.parse(base64UrlDecode(headerB64)) as JWTHeader
  } catch {
    throw new Error('Failed to decode JWT header')
  }

  try {
    payload = JSON.parse(base64UrlDecode(payloadB64)) as JWTClaims
  } catch {
    throw new Error('Failed to decode JWT payload')
  }

  const expiryStatus = getExpiryStatus(payload)
  const isExpired = expiryStatus === 'expired'

  return { header, payload, signatureRaw, isExpired, expiryStatus }
}

export function getExpiryStatus(payload: JWTClaims): ExpiryStatus {
  const now = Math.floor(Date.now() / 1000)

  if (payload.nbf !== undefined && now < payload.nbf) return 'not-yet-valid'
  if (payload.exp === undefined) return 'no-expiry'
  if (now > payload.exp) return 'expired'
  return 'valid'
}

export function formatRelativeTime(unixSeconds: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = unixSeconds - now
  const abs = Math.abs(diff)

  const units: Array<[string, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ]

  for (const [unit, secs] of units) {
    if (abs >= secs) {
      const value = Math.floor(abs / secs)
      const label = `${value} ${unit}${value !== 1 ? 's' : ''}`
      return diff > 0 ? `in ${label}` : `${label} ago`
    }
  }

  return 'just now'
}

const STANDARD_CLAIM_DESCRIPTIONS: Record<string, string> = {
  iss: 'Issuer — who issued the token',
  sub: 'Subject — who the token is about',
  aud: 'Audience — intended recipient',
  exp: 'Expiration Time',
  nbf: 'Not Before — token validity start',
  iat: 'Issued At',
  jti: 'JWT ID — unique identifier',
}

export function annotateStandardClaims(
  payload: JWTClaims
): Array<{ key: string; value: unknown; description?: string }> {
  return Object.entries(payload).map(([key, value]) => {
    const description = STANDARD_CLAIM_DESCRIPTIONS[key]
    return description !== undefined ? { key, value, description } : { key, value }
  })
}
