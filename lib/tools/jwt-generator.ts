// HS256 JWT generation using browser-native Web Crypto — no server, no external libs
export interface JWTGenError { message: string }
export interface JWTGenResult { token: string; error: JWTGenError | null }

function base64urlEncode(data: string | ArrayBuffer): string {
  let bytes: Uint8Array
  if (typeof data === 'string') {
    bytes = new TextEncoder().encode(data)
  } else {
    bytes = new Uint8Array(data)
  }
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - (str.length % 4)) % 4), '=')
  return atob(padded)
}

export async function generateJWT(
  headerJson: string,
  payloadJson: string,
  secret: string
): Promise<JWTGenResult> {
  try {
    let header: Record<string, unknown>
    let payload: Record<string, unknown>
    try {
      header = JSON.parse(headerJson) as Record<string, unknown>
    } catch {
      return { token: '', error: { message: 'Invalid JSON in header' } }
    }
    try {
      payload = JSON.parse(payloadJson) as Record<string, unknown>
    } catch {
      return { token: '', error: { message: 'Invalid JSON in payload' } }
    }

    const headerB64 = base64urlEncode(JSON.stringify(header))
    const payloadB64 = base64urlEncode(JSON.stringify(payload))
    const signingInput = `${headerB64}.${payloadB64}`

    const keyData = new TextEncoder().encode(secret)
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(signingInput))
    const sigB64 = base64urlEncode(signature)

    return { token: `${signingInput}.${sigB64}`, error: null }
  } catch (e) {
    return { token: '', error: { message: e instanceof Error ? e.message : String(e) } }
  }
}

export function decodeJWTParts(token: string): { header: string; payload: string } | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const header = JSON.stringify(JSON.parse(base64urlDecode(parts[0] ?? '')), null, 2)
    const payload = JSON.stringify(JSON.parse(base64urlDecode(parts[1] ?? '')), null, 2)
    return { header, payload }
  } catch {
    return null
  }
}
