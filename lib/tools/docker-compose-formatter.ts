export interface DockerFormatResult {
  output: string
  error: string | null
}

export async function formatDockerCompose(input: string): Promise<DockerFormatResult> {
  if (!input.trim()) return { output: '', error: null }
  try {
    const yaml = (await import('js-yaml')).default
    // Parse to validate, then dump with controlled formatting
    const parsed = yaml.load(input)
    if (parsed === null || parsed === undefined) return { output: '', error: 'Empty or null YAML document.' }
    const formatted = yaml.dump(parsed, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
    })
    return { output: formatted, error: null }
  } catch (e) {
    return { output: '', error: e instanceof Error ? e.message : 'Invalid YAML.' }
  }
}

export async function minifyDockerCompose(input: string): Promise<DockerFormatResult> {
  if (!input.trim()) return { output: '', error: null }
  try {
    const yaml = (await import('js-yaml')).default
    const parsed = yaml.load(input)
    if (parsed === null || parsed === undefined) return { output: '', error: 'Empty or null YAML document.' }
    const minified = yaml.dump(parsed, {
      indent: 1,
      lineWidth: 9999,
      noRefs: true,
      flowLevel: 99,
    })
    return { output: minified.trim(), error: null }
  } catch (e) {
    return { output: '', error: e instanceof Error ? e.message : 'Invalid YAML.' }
  }
}

export async function validateDockerCompose(input: string): Promise<{ valid: boolean; error: string | null }> {
  if (!input.trim()) return { valid: false, error: 'Empty input.' }
  try {
    const yaml = (await import('js-yaml')).default
    yaml.load(input)
    return { valid: true, error: null }
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : 'Invalid YAML.' }
  }
}
