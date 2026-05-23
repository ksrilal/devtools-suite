export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  value: string
  lineNumber?: number
}

export interface DiffSummary {
  added: number
  removed: number
  unchanged: number
}

export interface DiffResult {
  lines: DiffLine[]
  summary: DiffSummary
}

export async function diffLines(original: string, modified: string): Promise<DiffResult> {
  const { diffLines: diff } = await import('diff')
  const changes = diff(original, modified)

  const lines: DiffLine[] = []
  for (const change of changes) {
    const type: DiffLine['type'] = change.added
      ? 'added'
      : change.removed
        ? 'removed'
        : 'unchanged'
    const lineValues = change.value.split('\n')
    // Remove trailing empty string from split
    if (lineValues[lineValues.length - 1] === '') lineValues.pop()
    for (const line of lineValues) {
      lines.push({ type, value: line })
    }
  }

  return { lines, summary: summariseDiff(lines) }
}

export async function diffChars(original: string, modified: string): Promise<DiffResult> {
  const { diffChars: diff } = await import('diff')
  const changes = diff(original, modified)

  const lines: DiffLine[] = changes.map((c) => ({
    type: c.added ? 'added' : c.removed ? 'removed' : 'unchanged',
    value: c.value,
  }))

  return { lines, summary: summariseDiff(lines) }
}

export async function diffJSON(original: string, modified: string): Promise<DiffResult> {
  let a = original
  let b = modified

  try {
    a = JSON.stringify(JSON.parse(original), null, 2)
    b = JSON.stringify(JSON.parse(modified), null, 2)
  } catch {
    // Fall back to raw line diff if either side is invalid JSON
  }

  return diffLines(a, b)
}

export function summariseDiff(lines: DiffLine[]): DiffSummary {
  return {
    added: lines.filter((l) => l.type === 'added').length,
    removed: lines.filter((l) => l.type === 'removed').length,
    unchanged: lines.filter((l) => l.type === 'unchanged').length,
  }
}

export function formatAsPatch(lines: DiffLine[], fileA = 'original', fileB = 'modified'): string {
  const header = `--- ${fileA}\n+++ ${fileB}\n`
  const body = lines
    .map((l) => {
      if (l.type === 'added') return `+ ${l.value}`
      if (l.type === 'removed') return `- ${l.value}`
      return `  ${l.value}`
    })
    .join('\n')
  return header + body
}
