export interface DartGenResult {
  code: string
  error: string | null
}

function toPascalCase(str: string): string {
  return str.replace(/(^|[_\s-])(\w)/g, (_, __, c: string) => (c ?? '').toUpperCase())
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function dartType(value: unknown, key: string, classes: Map<string, string>, nullSafety: boolean): string {
  const nullable = nullSafety ? '?' : ''
  if (value === null || value === undefined) return `dynamic`
  if (typeof value === 'string') return `String${nullable}`
  if (typeof value === 'boolean') return `bool${nullable}`
  if (typeof value === 'number') return Number.isInteger(value) ? `int${nullable}` : `double${nullable}`
  if (Array.isArray(value)) {
    if (value.length === 0) return `List<dynamic>?`
    const inner = dartType(value[0], key, classes, nullSafety)
    return `List<${inner}>?`
  }
  if (typeof value === 'object') {
    const className = toPascalCase(key)
    generateDartClass(value as Record<string, unknown>, className, classes, nullSafety)
    return `${className}${nullable}`
  }
  return 'dynamic'
}

function generateDartClass(
  obj: Record<string, unknown>,
  className: string,
  classes: Map<string, string>,
  nullSafety: boolean,
  fromToJson = true
): void {
  if (classes.has(className)) return

  const fields: string[] = []
  const constructorParams: string[] = []
  const fromJsonLines: string[] = []
  const toJsonLines: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const fieldName = toCamelCase(key)
    const type = dartType(value, key, classes, nullSafety)
    fields.push(`  final ${type} ${fieldName};`)
    constructorParams.push(`    required this.${fieldName},`)
    fromJsonLines.push(`      ${fieldName}: json['${key}'] as ${type},`)
    toJsonLines.push(`      '${key}': ${fieldName},`)
  }

  const nullability = nullSafety ? '' : ''
  let classBody = `class ${className} {\n${fields.join('\n')}\n\n  const ${className}({\n${constructorParams.join('\n')}\n  });\n`

  if (fromToJson) {
    classBody += `\n  factory ${className}.fromJson(Map<String, dynamic> json) => ${className}(\n${fromJsonLines.join('\n')}\n  );\n`
    classBody += `\n  Map<String, dynamic> toJson() => {\n${toJsonLines.join('\n')}\n  };\n`
  }

  classBody += `}\n`
  void nullability
  classes.set(className, classBody)
}

export function generateDartModels(
  jsonInput: string,
  rootName: string,
  nullSafety: boolean,
  fromToJson: boolean
): DartGenResult {
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
  generateDartClass(root as Record<string, unknown>, className, classes, nullSafety, fromToJson)

  const header = nullSafety ? '// ignore_for_file: invalid_annotation_target\n\n' : ''
  const code = header + Array.from(classes.values()).join('\n')
  return { code, error: null }
}
