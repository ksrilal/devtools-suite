export interface JSONSchemaResult {
  schema: string
  error: string | null
}

function inferJsonSchemaType(value: unknown, depth: number): Record<string, unknown> {
  if (value === null) return { type: 'null' }

  switch (typeof value) {
    case 'string':  return { type: 'string' }
    case 'number':  return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' }
    case 'boolean': return { type: 'boolean' }
    case 'object':
      if (Array.isArray(value)) {
        if (value.length === 0) return { type: 'array', items: {} }
        return { type: 'array', items: inferJsonSchemaType(value[0], depth + 1) }
      }
      return buildObjectSchema(value as Record<string, unknown>, depth)
    default:
      return {}
  }
}

function buildObjectSchema(obj: Record<string, unknown>, depth: number): Record<string, unknown> {
  if (depth > 8) return { type: 'object' }
  const properties: Record<string, unknown> = {}
  const required: string[] = []

  for (const [key, val] of Object.entries(obj)) {
    properties[key] = inferJsonSchemaType(val, depth + 1)
    if (val !== null && val !== undefined) required.push(key)
  }

  const schema: Record<string, unknown> = { type: 'object', properties }
  if (required.length > 0) schema['required'] = required
  schema['additionalProperties'] = false
  return schema
}

export function generateJSONSchema(jsonInput: string, title: string): JSONSchemaResult {
  if (!jsonInput.trim()) return { schema: '', error: null }

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonInput)
  } catch {
    return { schema: '', error: 'Invalid JSON — check syntax and try again.' }
  }

  const schemaTitle = title.trim() || 'MySchema'
  const root = inferJsonSchemaType(parsed, 0)
  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `https://example.com/${schemaTitle.toLowerCase().replace(/\s+/g, '-')}.schema.json`,
    title: schemaTitle,
    description: `JSON Schema for ${schemaTitle}`,
    ...root,
  }

  return { schema: JSON.stringify(schema, null, 2), error: null }
}
