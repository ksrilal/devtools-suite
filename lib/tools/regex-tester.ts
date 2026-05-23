export interface RegexMatch {
  index: number
  length: number
  value: string
  groups?: Record<string, string | undefined> | undefined
}

export interface RegexCompileResult {
  regex: RegExp | null
  error: string | null
}

export interface RegexTestResult {
  matches: RegexMatch[]
  matchCount: number
}

export interface RegexToken {
  type: 'literal' | 'meta' | 'quantifier' | 'group' | 'class' | 'anchor' | 'flag'
  value: string
  description?: string
}

export function compileRegex(pattern: string, flags: string): RegexCompileResult {
  try {
    const regex = new RegExp(pattern, flags)
    return { regex, error: null }
  } catch (e) {
    return { regex: null, error: e instanceof Error ? e.message : String(e) }
  }
}

export function findMatches(regex: RegExp, input: string): RegexTestResult {
  const matches: RegexMatch[] = []

  if (!regex.source || !input) return { matches, matchCount: 0 }

  // Ensure global flag for iterating all matches
  const globalRegex = regex.flags.includes('g')
    ? regex
    : new RegExp(regex.source, regex.flags + 'g')

  let match: RegExpExecArray | null
  let safetyLimit = 10000
  while ((match = globalRegex.exec(input)) !== null && safetyLimit-- > 0) {
    const m: RegexMatch = {
      index: match.index,
      length: match[0].length,
      value: match[0],
    }
    if (match.groups !== undefined) {
      m.groups = match.groups as Record<string, string | undefined>
    }
    matches.push(m)
    // Advance for zero-length matches to avoid infinite loop
    if (match[0].length === 0) globalRegex.lastIndex++
  }

  return { matches, matchCount: matches.length }
}

export function previewReplace(regex: RegExp, input: string, replacement: string): string {
  try {
    const globalRegex = regex.flags.includes('g')
      ? regex
      : new RegExp(regex.source, regex.flags + 'g')
    return input.replace(globalRegex, replacement)
  } catch {
    return input
  }
}

export function testMatch(regex: RegExp, input: string): boolean {
  return regex.test(input)
}

const REGEX_DESCRIPTIONS: Record<string, string> = {
  '.': 'Any character except newline',
  '^': 'Start of string/line',
  $: 'End of string/line',
  '*': 'Zero or more (greedy)',
  '+': 'One or more (greedy)',
  '?': 'Zero or one (optional)',
  '\\d': 'Any digit [0-9]',
  '\\D': 'Any non-digit',
  '\\w': 'Word character [a-zA-Z0-9_]',
  '\\W': 'Non-word character',
  '\\s': 'Whitespace',
  '\\S': 'Non-whitespace',
  '\\b': 'Word boundary',
  '\\B': 'Non-word boundary',
  '(?:...)': 'Non-capturing group',
  '(?=...)': 'Positive lookahead',
  '(?!...)': 'Negative lookahead',
  '(?<=...)': 'Positive lookbehind',
  '(?<!...)': 'Negative lookbehind',
}

export function explainRegex(pattern: string): string {
  if (!pattern) return ''
  const parts: string[] = []
  for (const [sym, desc] of Object.entries(REGEX_DESCRIPTIONS)) {
    if (pattern.includes(sym)) {
      parts.push(`${sym} → ${desc}`)
    }
  }
  return parts.length ? parts.join('\n') : 'Literal pattern match'
}

function makeToken(
  type: RegexToken['type'],
  value: string,
  description?: string
): RegexToken {
  return description !== undefined ? { type, value, description } : { type, value }
}

export function tokeniseRegex(pattern: string): RegexToken[] {
  const tokens: RegexToken[] = []
  let i = 0

  while (i < pattern.length) {
    const ch = pattern[i]
    if (ch === undefined) break

    if (ch === '\\' && i + 1 < pattern.length) {
      const next = pattern[i + 1] ?? ''
      const escaped = `\\${next}`
      tokens.push(makeToken('meta', escaped, REGEX_DESCRIPTIONS[escaped]))
      i += 2
      continue
    }

    if (ch === '[') {
      let cls = '['
      i++
      while (i < pattern.length && pattern[i] !== ']') {
        cls += pattern[i]
        i++
      }
      cls += ']'
      i++
      tokens.push(makeToken('class', cls, 'Character class'))
      continue
    }

    if (ch === '(') {
      tokens.push(makeToken('group', ch, 'Group start'))
      i++
      continue
    }
    if (ch === ')') {
      tokens.push(makeToken('group', ch, 'Group end'))
      i++
      continue
    }

    if ('*+?'.includes(ch) || (ch === '{' && /\{\d/.test(pattern.slice(i)))) {
      tokens.push(makeToken('quantifier', ch, REGEX_DESCRIPTIONS[ch]))
      i++
      continue
    }

    if ('^$'.includes(ch)) {
      tokens.push(makeToken('anchor', ch, REGEX_DESCRIPTIONS[ch]))
      i++
      continue
    }

    if (ch === '.') {
      tokens.push(makeToken('meta', ch, REGEX_DESCRIPTIONS[ch]))
      i++
      continue
    }

    tokens.push(makeToken('literal', ch))
    i++
  }

  return tokens
}
