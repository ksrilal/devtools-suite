import { describe, it, expect } from 'vitest'
import { formatJSON, minifyJSON, sortJSONKeys, parseJSONError, tokeniseJSON } from '../json-formatter'

describe('formatJSON', () => {
  it('prettifies valid JSON', () => {
    const { output, error } = formatJSON('{"a":1,"b":2}', 2)
    expect(error).toBeNull()
    expect(output).toContain('\n')
  })

  it('returns error for invalid JSON', () => {
    const { output, error } = formatJSON('{bad json}')
    expect(error).not.toBeNull()
    expect(output).toBe('')
  })
})

describe('minifyJSON', () => {
  it('removes whitespace', () => {
    const { output } = minifyJSON('{ "a" : 1 }')
    expect(output).toBe('{"a":1}')
  })
})

describe('sortJSONKeys', () => {
  it('sorts keys alphabetically', () => {
    const { output } = sortJSONKeys('{"z":3,"a":1,"m":2}')
    const parsed = JSON.parse(output)
    expect(Object.keys(parsed)).toEqual(['a', 'm', 'z'])
  })
})

describe('tokeniseJSON', () => {
  it('identifies string keys', () => {
    const tokens = tokeniseJSON('{"name":"value"}')
    const keyToken = tokens.find((t) => t.value === '"name"')
    expect(keyToken?.type).toBe('key')
  })

  it('identifies string values', () => {
    const tokens = tokeniseJSON('{"name":"value"}')
    const valToken = tokens.find((t) => t.value === '"value"')
    expect(valToken?.type).toBe('string')
  })

  it('identifies numbers', () => {
    const tokens = tokeniseJSON('{"n":42}')
    const numToken = tokens.find((t) => t.value === '42')
    expect(numToken?.type).toBe('number')
  })

  it('identifies booleans', () => {
    const tokens = tokeniseJSON('{"b":true}')
    const boolToken = tokens.find((t) => t.value === 'true')
    expect(boolToken?.type).toBe('boolean')
  })
})

describe('parseJSONError', () => {
  it('returns message from SyntaxError', () => {
    const err = new SyntaxError('Unexpected token')
    const result = parseJSONError(err, '')
    expect(result.message).toContain('Unexpected token')
  })
})
