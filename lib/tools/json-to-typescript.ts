export interface TSGenError {
  message: string
}

export interface TSGenResult {
  output: string
  error: TSGenError | null
}

function inferType(value: unknown, depth = 0): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'string') return 'string'

  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    const elementTypes = [...new Set(value.map((v) => inferType(v, depth)))]
    const elementType = elementTypes.length === 1 ? (elementTypes[0] ?? 'unknown') : `(${elementTypes.join(' | ')})`
    return `${elementType}[]`
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj)
    if (keys.length === 0) return 'Record<string, unknown>'
    const indent = '  '.repeat(depth + 1)
    const closingIndent = '  '.repeat(depth)
    const fields = keys
      .map((k) => {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k)
        return `${indent}${safeKey}: ${inferType(obj[k], depth + 1)}`
      })
      .join(';\n')
    return `{\n${fields};\n${closingIndent}}`
  }

  return 'unknown'
}

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toUpperCase())
}

function generateInterfaces(
  value: unknown,
  name: string,
  interfaces: Map<string, string>,
  depth = 0
): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    const first = value[0]
    if (first !== null && typeof first === 'object' && !Array.isArray(first)) {
      const elemName = toPascalCase(name.replace(/s$/, '')) + 'Item'
      generateInterfaces(first, elemName, interfaces, depth)
      return `${elemName}[]`
    }
    const elementTypes = [...new Set(value.map((v) => inferType(v, depth)))]
    const elementType = elementTypes.length === 1 ? (elementTypes[0] ?? 'unknown') : `(${elementTypes.join(' | ')})`
    return `${elementType}[]`
  }

  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj)
    if (keys.length === 0) return 'Record<string, unknown>'

    const interfaceName = toPascalCase(name)
    const fields = keys.map((k) => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k)
      const childName = toPascalCase(k)
      const childVal = obj[k]
      const fieldType =
        childVal !== null &&
        typeof childVal === 'object' &&
        !Array.isArray(childVal)
          ? (generateInterfaces(childVal, childName, interfaces, depth + 1), childName)
          : Array.isArray(childVal) &&
            childVal.length > 0 &&
            typeof childVal[0] === 'object' &&
            childVal[0] !== null
          ? generateInterfaces(childVal, k, interfaces, depth + 1)
          : inferType(childVal, 0)

      return `  ${safeKey}: ${fieldType}`
    })

    const body = `export interface ${interfaceName} {\n${fields.join(';\n')};\n}`
    interfaces.set(interfaceName, body)
    return interfaceName
  }

  return inferType(value, 0)
}

export function generateTypeScript(jsonInput: string, rootName = 'Root'): TSGenResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonInput)
  } catch (e) {
    return { output: '', error: { message: e instanceof Error ? e.message : 'Invalid JSON' } }
  }

  const interfaces = new Map<string, string>()
  generateInterfaces(parsed, rootName, interfaces)

  if (interfaces.size === 0) {
    // Primitive or simple array — just output a type alias
    const type = inferType(parsed, 0)
    return { output: `export type ${toPascalCase(rootName)} = ${type}\n`, error: null }
  }

  // Output deepest interfaces first (dependencies before dependents)
  const ordered = Array.from(interfaces.values()).reverse()
  return { output: ordered.join('\n\n') + '\n', error: null }
}
