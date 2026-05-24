export interface ZodGenResult {
  schema: string
  error: string | null
}

function inferZodType(value: unknown, depth: number, strict: boolean): string {
  if (value === null) return 'z.null()'
  if (value === undefined) return 'z.undefined()'

  switch (typeof value) {
    case 'string':  return 'z.string()'
    case 'number':  return Number.isInteger(value) ? (strict ? 'z.number().int()' : 'z.number()') : 'z.number()'
    case 'boolean': return 'z.boolean()'
    case 'object':
      if (Array.isArray(value)) {
        if (value.length === 0) return 'z.array(z.unknown())'
        const itemType = inferZodType(value[0], depth + 1, strict)
        return `z.array(${itemType})`
      }
      return buildObjectSchema(value as Record<string, unknown>, depth, strict)
    default:
      return 'z.unknown()'
  }
}

function buildObjectSchema(obj: Record<string, unknown>, depth: number, strict: boolean): string {
  if (depth > 8) return 'z.record(z.unknown())'
  const indent = '  '.repeat(depth + 1)
  const closingIndent = '  '.repeat(depth)
  const entries = Object.entries(obj)
  if (entries.length === 0) return 'z.object({})'

  const fields = entries
    .map(([key, val]) => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key)
      const zodType = inferZodType(val, depth + 1, strict)
      return `${indent}${safeKey}: ${zodType},`
    })
    .join('\n')

  const suffix = strict ? '.strict()' : ''
  return `z.object({\n${fields}\n${closingIndent}})${suffix}`
}

export function generateZodSchema(jsonInput: string, rootName: string, strict: boolean): ZodGenResult {
  if (!jsonInput.trim()) return { schema: '', error: null }

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonInput)
  } catch {
    return { schema: '', error: 'Invalid JSON — check syntax and try again.' }
  }

  const name = rootName.trim() || 'MySchema'
  const safeName = name.charAt(0).toUpperCase() + name.slice(1)
  const schemaVar = safeName.charAt(0).toLowerCase() + safeName.slice(1) + 'Schema'

  const zodBody = inferZodType(parsed, 0, strict)
  const schema = `import { z } from 'zod'\n\nexport const ${schemaVar} = ${zodBody}\n\nexport type ${safeName} = z.infer<typeof ${schemaVar}>`

  return { schema, error: null }
}
