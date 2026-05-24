export interface DockerFormatResult {
  output: string
  error: YamlError | null
}

export interface YamlError {
  summary: string      // one-line headline
  detail: string       // explanation
  hint: string | null  // concrete fix suggestion
  line: number | null  // 1-based, null if unknown
}

// Convert a js-yaml YAMLException (or plain string) into a structured, human-readable error.
// Accepts the raw Error object so we can read mark.line (0-based) directly — the
// (line:col) suffix in the message string can be misleading (points to where the parser
// gave up, not where the bad character is).
export function humanizeYamlError(raw: string, markLine?: number, input?: string): YamlError {
  // Prefer the mark line from the exception object (0-based → 1-based)
  let line: number | null = markLine !== undefined ? markLine + 1 : null

  // Fallback: parse "(line:col)" from message string only when no mark available
  if (line === null) {
    const posMatch = /\((\d+):(\d+)\)/.exec(raw)
    line = posMatch ? parseInt(posMatch[1] ?? '0', 10) : null
  }

  // Strip the technical position suffix for display
  const clean = raw.replace(/\s*\(\d+:\d+\)[^)]*$/, '').trim()

  // Source-scan: find the first key:value line (no space after colon) regardless of what
  // js-yaml reports — cascading parse failures often cause wrong error types/lines.
  if (input) {
    const lines = input.split('\n')
    const idx = lines.findIndex((l) => /^\s*[^#\s][^:]*:[^\s\r]/.test(l))
    if (idx !== -1) {
      return {
        summary: 'Missing space after colon',
        detail: 'YAML requires a space between a key and its value.',
        hint: 'Change  key:value  →  key: value',
        line: idx + 1,
      }
    }
  }

  // Pattern-match common YAML mistakes
  if (/missing.*space.*after.*:|end of the stream.*document separator/i.test(raw)) {
    return {
      summary: 'Missing space after colon',
      detail: 'YAML requires a space between a key and its value.',
      hint: 'Change  key:value  →  key: value',
      line,
    }
  }
  if (/tab/i.test(raw)) {
    return {
      summary: 'Unexpected tab character',
      detail: 'YAML does not allow tab characters for indentation — use spaces only.',
      hint: 'Replace all tab characters with 2 or 4 spaces.',
      line,
    }
  }
  if (/bad indentation|wrong indentation/i.test(raw)) {
    return {
      summary: 'Incorrect indentation',
      detail: 'A line is indented at an unexpected level.',
      hint: 'Check that nested keys are indented with consistent spaces (2 per level).',
      line,
    }
  }
  if (/duplicate key/i.test(raw)) {
    return {
      summary: 'Duplicate key',
      detail: 'The same key appears more than once at the same level.',
      hint: 'Remove or rename the duplicate key.',
      line,
    }
  }
  if (/unexpected end|unexpected.*<stream end>/i.test(raw)) {
    return {
      summary: 'Unexpected end of file',
      detail: 'The document ended before a value or block was complete.',
      hint: 'Check for an unclosed quote, a key with no value, or a trailing colon with nothing after it.',
      line,
    }
  }
  if (/cannot read property|unexpected token/i.test(raw)) {
    return {
      summary: 'Malformed YAML',
      detail: 'The parser encountered an unexpected character.',
      hint: 'Check for unquoted special characters like : { } [ ] , & * # ? | - < > = ! % @ \\',
      line,
    }
  }
  if (/unknown.*tag|unresolved.*tag/i.test(raw)) {
    return {
      summary: 'Unknown YAML tag',
      detail: 'A custom YAML tag was used that this parser does not recognise.',
      hint: 'Remove the tag or replace it with a plain value.',
      line,
    }
  }
  if (/mapping.*values.*not.*allowed|block mapping/i.test(raw)) {
    return {
      summary: 'Invalid mapping',
      detail: 'A mapping value appeared in an unexpected position.',
      hint: 'Check for a stray colon or a key that is missing its indentation.',
      line,
    }
  }

  // Fallback — clean up the raw message but still show it
  return {
    summary: 'Invalid YAML',
    detail: clean,
    hint: null,
    line,
  }
}

export async function formatDockerCompose(input: string): Promise<DockerFormatResult> {
  if (!input.trim()) return { output: '', error: null }
  try {
    const yaml = (await import('js-yaml')).default
    const parsed = yaml.load(input)
    if (parsed === null || parsed === undefined) return { output: '', error: { summary: 'Empty document', detail: 'The YAML input is empty or contains only null.', hint: null, line: null } }
    const formatted = yaml.dump(parsed, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
    })
    return { output: formatted, error: null }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid YAML.'
    const markLine = (e as { mark?: { line?: number } })?.mark?.line
    return { output: '', error: humanizeYamlError(msg, markLine, input) }
  }
}

export async function minifyDockerCompose(input: string): Promise<DockerFormatResult> {
  if (!input.trim()) return { output: '', error: null }
  try {
    const yaml = (await import('js-yaml')).default
    const parsed = yaml.load(input)
    if (parsed === null || parsed === undefined) return { output: '', error: { summary: 'Empty document', detail: 'The YAML input is empty or contains only null.', hint: null, line: null } }
    const minified = yaml.dump(parsed, {
      indent: 1,
      lineWidth: 9999,
      noRefs: true,
      flowLevel: 99,
    })
    return { output: minified.trim(), error: null }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid YAML.'
    const markLine = (e as { mark?: { line?: number } })?.mark?.line
    return { output: '', error: humanizeYamlError(msg, markLine, input) }
  }
}

export async function validateDockerCompose(input: string): Promise<{ valid: boolean; error: YamlError | null }> {
  if (!input.trim()) return { valid: false, error: { summary: 'Empty input', detail: 'Nothing to validate.', hint: null, line: null } }
  try {
    const yaml = (await import('js-yaml')).default
    yaml.load(input)
    return { valid: true, error: null }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid YAML.'
    const markLine = (e as { mark?: { line?: number } })?.mark?.line
    return { valid: false, error: humanizeYamlError(msg, markLine, input) }
  }
}
