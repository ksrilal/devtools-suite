export interface XMLError { message: string; line?: number }
export interface XMLResult { output: string; error: XMLError | null }

export async function formatXML(input: string, indent = 2): Promise<XMLResult> {
  try {
    const { XMLParser, XMLBuilder, XMLValidator } = await import('fast-xml-parser')

    const validation = XMLValidator.validate(input, { allowBooleanAttributes: true })
    if (validation !== true) {
      return {
        output: '',
        error: {
          message: validation.err.msg,
          line: validation.err.line,
        },
      }
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      parseAttributeValue: false,
      cdataPropName: '__cdata',
      commentPropName: '__comment',
      preserveOrder: true,
    })
    const parsed: unknown = parser.parse(input)

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      cdataPropName: '__cdata',
      commentPropName: '__comment',
      format: true,
      indentBy: ' '.repeat(indent),
      preserveOrder: true,
      suppressBooleanAttributes: false,
    })
    const output: string = builder.build(parsed)
    return { output: output.trim(), error: null }
  } catch (e) {
    return { output: '', error: { message: e instanceof Error ? e.message : String(e) } }
  }
}

export async function minifyXML(input: string): Promise<XMLResult> {
  try {
    const { XMLValidator } = await import('fast-xml-parser')
    const validation = XMLValidator.validate(input, { allowBooleanAttributes: true })
    if (validation !== true) {
      return { output: '', error: { message: validation.err.msg, line: validation.err.line } }
    }
    // Simple minification: collapse whitespace between tags
    const minified = input
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ')
      .trim()
    return { output: minified, error: null }
  } catch (e) {
    return { output: '', error: { message: e instanceof Error ? e.message : String(e) } }
  }
}
