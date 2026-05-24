export type CaseType =
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant'
  | 'lower'
  | 'upper'
  | 'title'
  | 'sentence'

export const CASE_LABELS: Record<CaseType, string> = {
  camel: 'camelCase',
  pascal: 'PascalCase',
  snake: 'snake_case',
  kebab: 'kebab-case',
  constant: 'CONSTANT_CASE',
  lower: 'lowercase',
  upper: 'UPPERCASE',
  title: 'Title Case',
  sentence: 'Sentence case',
}

function tokenize(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')  // split camelCase / PascalCase
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

export function convertCase(input: string, to: CaseType): string {
  if (!input.trim()) return ''

  const lines = input.split('\n')
  return lines
    .map((line) => {
      if (!line.trim()) return ''
      const words = tokenize(line)
      switch (to) {
        case 'camel':
          return words
            .map((w, i) => i === 0 ? w.toLowerCase() : (w[0] ?? '').toUpperCase() + w.slice(1).toLowerCase())
            .join('')
        case 'pascal':
          return words.map((w) => (w[0] ?? '').toUpperCase() + w.slice(1).toLowerCase()).join('')
        case 'snake':
          return words.map((w) => w.toLowerCase()).join('_')
        case 'kebab':
          return words.map((w) => w.toLowerCase()).join('-')
        case 'constant':
          return words.map((w) => w.toUpperCase()).join('_')
        case 'lower':
          return line.toLowerCase()
        case 'upper':
          return line.toUpperCase()
        case 'title':
          return words.map((w) => (w[0] ?? '').toUpperCase() + w.slice(1).toLowerCase()).join(' ')
        case 'sentence': {
          const first = words[0] ?? ''
          const rest = words.slice(1)
          return (first[0] ?? '').toUpperCase() + first.slice(1).toLowerCase() + (rest.length > 0 ? ' ' + rest.map((w) => w.toLowerCase()).join(' ') : '')
        }
      }
    })
    .join('\n')
}

export function convertAllCases(input: string): Record<CaseType, string> {
  const result = {} as Record<CaseType, string>
  for (const key of Object.keys(CASE_LABELS) as CaseType[]) {
    result[key] = convertCase(input, key)
  }
  return result
}
