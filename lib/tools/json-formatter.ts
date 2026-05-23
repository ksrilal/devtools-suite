export interface JSONFormatterError {
  message: string
  line?: number
  column?: number
}

export interface FormatResult {
  output: string
  error: JSONFormatterError | null
}

export function formatJSON(input: string, indent = 2): FormatResult {
  try {
    const parsed: unknown = JSON.parse(input)
    return { output: JSON.stringify(parsed, null, indent), error: null }
  } catch (e) {
    return { output: '', error: parseJSONError(e, input) }
  }
}

export function minifyJSON(input: string): FormatResult {
  try {
    const parsed: unknown = JSON.parse(input)
    return { output: JSON.stringify(parsed), error: null }
  } catch (e) {
    return { output: '', error: parseJSONError(e, input) }
  }
}

export function sortJSONKeys(input: string, indent = 2): FormatResult {
  try {
    const parsed: unknown = JSON.parse(input)
    return { output: JSON.stringify(sortDeep(parsed), null, indent), error: null }
  } catch (e) {
    return { output: '', error: parseJSONError(e, input) }
  }
}

function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep)
  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    return Object.keys(obj)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        acc[k] = sortDeep(obj[k])
        return acc
      }, {})
  }
  return value
}

export function parseJSONError(e: unknown, input: string): JSONFormatterError {
  if (!(e instanceof SyntaxError)) {
    return { message: String(e) }
  }
  const msg = e.message
  // Extract line/column from error message like "at position N" or "line N column M"
  const posMatch = /at position (\d+)/.exec(msg)
  if (posMatch) {
    const pos = parseInt(posMatch[1] ?? '0', 10)
    const before = input.substring(0, pos)
    const line = (before.match(/\n/g) ?? []).length + 1
    const lastNewline = before.lastIndexOf('\n')
    const column = pos - lastNewline
    return { message: msg, line, column }
  }
  const lineColMatch = /line (\d+) column (\d+)/.exec(msg)
  if (lineColMatch) {
    return {
      message: msg,
      line: parseInt(lineColMatch[1] ?? '1', 10),
      column: parseInt(lineColMatch[2] ?? '1', 10),
    }
  }
  return { message: msg }
}

export type TokenType = 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation'

export interface JSONToken {
  type: TokenType
  value: string
}

export function tokeniseJSON(input: string): JSONToken[] {
  const tokens: JSONToken[] = []
  let i = 0

  while (i < input.length) {
    const ch = input[i]

    if (ch === undefined) break

    // Whitespace
    if (/\s/.test(ch)) {
      tokens.push({ type: 'punctuation', value: ch })
      i++
      continue
    }

    // Structural
    if ('{}[],:'.includes(ch)) {
      tokens.push({ type: 'punctuation', value: ch })
      i++
      continue
    }

    // String
    if (ch === '"') {
      let str = '"'
      i++
      while (i < input.length && input[i] !== '"') {
        if (input[i] === '\\') {
          str += input[i]
          i++
        }
        str += input[i] ?? ''
        i++
      }
      str += '"'
      i++
      tokens.push({ type: 'string', value: str })
      continue
    }

    // Number
    if (/[-\d]/.test(ch)) {
      let num = ''
      while (i < input.length && /[-\d.eE+]/.test(input[i] ?? '')) {
        num += input[i]
        i++
      }
      tokens.push({ type: 'number', value: num })
      continue
    }

    // true / false / null
    if (input.startsWith('true', i)) {
      tokens.push({ type: 'boolean', value: 'true' })
      i += 4
      continue
    }
    if (input.startsWith('false', i)) {
      tokens.push({ type: 'boolean', value: 'false' })
      i += 5
      continue
    }
    if (input.startsWith('null', i)) {
      tokens.push({ type: 'null', value: 'null' })
      i += 4
      continue
    }

    tokens.push({ type: 'punctuation', value: ch })
    i++
  }

  // Mark keys: a string token followed by ':' (ignoring whitespace) is a key
  for (let j = 0; j < tokens.length; j++) {
    if (tokens[j]?.type === 'string') {
      let k = j + 1
      while (k < tokens.length && tokens[k]?.value?.trim() === '') k++
      if (tokens[k]?.value === ':') {
        const t = tokens[j]
        if (t) tokens[j] = { ...t, type: 'key' }
      }
    }
  }

  return tokens
}
