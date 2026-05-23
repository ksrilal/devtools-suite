export interface CronField {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

export interface CronValidationResult {
  valid: boolean
  error?: string
}

export interface CronBuildResult {
  expression: string
  human: string
  nextExecutions: string[]
}

const FIELD_RANGES: Record<keyof CronField, { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 7 },
}

export function validateCronField(field: keyof CronField, value: string): CronValidationResult {
  if (value === '*' || value === '?') return { valid: true }

  const range = FIELD_RANGES[field]

  // Handle step values like */5 or 1-5/2
  if (value.includes('/')) {
    const [base, step] = value.split('/')
    const stepNum = parseInt(step ?? '', 10)
    if (isNaN(stepNum) || stepNum <= 0)
      return { valid: false, error: `Invalid step value: ${step ?? ''}` }
    if (base !== '*') {
      const baseValidation = validateCronField(field, base ?? '')
      if (!baseValidation.valid) return baseValidation
    }
    return { valid: true }
  }

  // Handle ranges like 1-5
  if (value.includes('-')) {
    const [startStr, endStr] = value.split('-')
    const start = parseInt(startStr ?? '', 10)
    const end = parseInt(endStr ?? '', 10)
    if (isNaN(start) || isNaN(end)) return { valid: false, error: 'Invalid range' }
    if (start < range.min || end > range.max || start > end)
      return { valid: false, error: `Range out of bounds (${range.min}-${range.max})` }
    return { valid: true }
  }

  // Handle lists like 1,2,3
  if (value.includes(',')) {
    const parts = value.split(',')
    for (const part of parts) {
      const v = validateCronField(field, part.trim())
      if (!v.valid) return v
    }
    return { valid: true }
  }

  // Single value
  const num = parseInt(value, 10)
  if (isNaN(num)) return { valid: false, error: `Not a number: ${value}` }
  if (num < range.min || num > range.max)
    return { valid: false, error: `Value ${num} out of range (${range.min}-${range.max})` }
  return { valid: true }
}

export function buildExpression(fields: CronField): string {
  return `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`
}

export async function parseExpression(expression: string): Promise<CronBuildResult> {
  const [cronstrue, { CronExpressionParser }] = await Promise.all([
    import('cronstrue').then((m) => m.default),
    import('cron-parser'),
  ])

  let human: string
  try {
    human = cronstrue.toString(expression, { throwExceptionOnParseError: true })
  } catch {
    human = 'Invalid expression'
  }

  const nextExecutions: string[] = []
  try {
    const interval = CronExpressionParser.parse(expression)
    for (let i = 0; i < 5; i++) {
      nextExecutions.push(interval.next().toDate().toUTCString())
    }
  } catch {
    // Invalid expression — no previews
  }

  return { expression, human, nextExecutions }
}

export function toEventBridge(expression: string): string {
  // AWS EventBridge uses: cron(min hour dom month dow year)
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return expression
  // EventBridge requires year field and uses ? for omitted fields
  const [min, hour, dom, month, dow] = parts
  const ebDom = dow !== '*' ? '?' : dom ?? '*'
  const ebDow = dom !== '*' && dow !== '*' ? '?' : dow ?? '*'
  return `cron(${min ?? '*'} ${hour ?? '*'} ${ebDom} ${month ?? '*'} ${ebDow} *)`
}

export function toSpringScheduled(expression: string): string {
  // Spring uses 6-field: second minute hour dom month dow
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return expression
  const [min, hour, dom, month, dow] = parts
  return `0 ${min ?? '*'} ${hour ?? '*'} ${dom ?? '*'} ${month ?? '*'} ${dow ?? '*'}`
}
