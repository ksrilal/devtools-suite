export interface Base64Error {
  message: string
}

export interface Base64Result {
  output: string
  error: Base64Error | null
}

export function encodeBase64(input: string): Base64Result {
  try {
    const encoded = btoa(unescape(encodeURIComponent(input)))
    return { output: encoded, error: null }
  } catch (e) {
    return { output: '', error: { message: e instanceof Error ? e.message : String(e) } }
  }
}

export function decodeBase64(input: string): Base64Result {
  try {
    const trimmed = input.trim()
    const decoded = decodeURIComponent(escape(atob(trimmed)))
    return { output: decoded, error: null }
  } catch {
    return { output: '', error: { message: 'Invalid Base64 string — make sure the input is valid Base64 encoded text.' } }
  }
}
