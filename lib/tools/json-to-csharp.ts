export interface CSharpGenResult {
  code: string
  error: string | null
}

function toPascalCase(str: string): string {
  return str.replace(/(^|[_\s-])(\w)/g, (_, __, c: string) => (c ?? '').toUpperCase())
}

function csharpType(value: unknown, key: string, classes: Map<string, string>, nullable: boolean): string {
  const q = nullable ? '?' : ''
  if (value === null || value === undefined) return 'object?'
  if (typeof value === 'string') {
    const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (GUID_RE.test(value)) return `Guid${q}`
    return `string${q}`
  }
  if (typeof value === 'boolean') return `bool${q}`
  if (typeof value === 'number') return Number.isInteger(value) ? `int${q}` : `double${q}`
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List<object>'
    const inner = csharpType(value[0], key, classes, nullable)
    return `List<${inner}>`
  }
  if (typeof value === 'object') {
    const className = toPascalCase(key)
    generateCSharpClass(value as Record<string, unknown>, className, classes, nullable)
    return `${className}${q}`
  }
  return 'object'
}

function generateCSharpClass(
  obj: Record<string, unknown>,
  className: string,
  classes: Map<string, string>,
  nullable: boolean
): void {
  if (classes.has(className)) return

  const props: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const propName = toPascalCase(key)
    const type = csharpType(value, key, classes, nullable)
    props.push(`    [JsonPropertyName("${key}")]\n    public ${type} ${propName} { get; set; }`)
  }

  const classBody = `public class ${className}\n{\n${props.join('\n\n')}\n}`
  classes.set(className, classBody)
}

export function generateCSharpClasses(
  jsonInput: string,
  rootName: string,
  nullable: boolean,
  namespaceName: string
): CSharpGenResult {
  if (!jsonInput.trim()) return { code: '', error: null }

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonInput)
  } catch {
    return { code: '', error: 'Invalid JSON — check syntax and try again.' }
  }

  const root = Array.isArray(parsed) ? (parsed[0] ?? {}) : parsed
  if (typeof root !== 'object' || root === null) {
    return { code: '', error: 'JSON must be an object or array of objects.' }
  }

  const className = toPascalCase(rootName.trim() || 'MyModel')
  const classes = new Map<string, string>()
  generateCSharpClass(root as Record<string, unknown>, className, classes, nullable)

  const ns = namespaceName.trim() || 'MyApp.Models'
  const usings = `using System;\nusing System.Text.Json.Serialization;\nusing System.Collections.Generic;\n\n`
  const nsOpen = `namespace ${ns}\n{\n`
  const nsClose = `}\n`
  const body = Array.from(classes.values())
    .map((c) => c.split('\n').map((l) => `    ${l}`).join('\n'))
    .join('\n\n')

  const code = usings + nsOpen + body + '\n' + nsClose
  return { code, error: null }
}
