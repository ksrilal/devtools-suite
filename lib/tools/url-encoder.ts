export interface URLEncoderError {
  message: string
}

export interface URLEncoderResult {
  output: string
  error: URLEncoderError | null
}

export function encodeURL(input: string): URLEncoderResult {
  try {
    return { output: encodeURIComponent(input), error: null }
  } catch (e) {
    return { output: '', error: { message: e instanceof Error ? e.message : String(e) } }
  }
}

export function decodeURL(input: string): URLEncoderResult {
  try {
    return { output: decodeURIComponent(input), error: null }
  } catch {
    return { output: '', error: { message: 'Invalid URL encoding — the input contains malformed percent-encoded sequences.' } }
  }
}
