import { describe, it, expect } from 'vitest'
import { compileRegex, findMatches, previewReplace, testMatch, explainRegex } from '../regex-tester'

describe('compileRegex', () => {
  it('compiles valid patterns', () => {
    const { regex, error } = compileRegex('\\d+', 'g')
    expect(error).toBeNull()
    expect(regex).not.toBeNull()
  })

  it('returns error for invalid patterns', () => {
    const { regex, error } = compileRegex('[invalid', 'g')
    expect(regex).toBeNull()
    expect(error).not.toBeNull()
  })
})

describe('findMatches', () => {
  it('finds all digit sequences', () => {
    const { regex } = compileRegex('\\d+', 'g')
    if (!regex) throw new Error('regex is null')
    const result = findMatches(regex, 'abc 123 def 456')
    expect(result.matchCount).toBe(2)
    expect(result.matches[0]?.value).toBe('123')
    expect(result.matches[1]?.value).toBe('456')
  })

  it('returns zero matches when no match', () => {
    const { regex } = compileRegex('xyz', 'g')
    if (!regex) throw new Error('regex is null')
    const result = findMatches(regex, 'hello world')
    expect(result.matchCount).toBe(0)
  })
})

describe('previewReplace', () => {
  it('replaces all matches', () => {
    const { regex } = compileRegex('\\d+', 'g')
    if (!regex) throw new Error('regex is null')
    const result = previewReplace(regex, 'abc 123 def 456', 'NUM')
    expect(result).toBe('abc NUM def NUM')
  })
})

describe('testMatch', () => {
  it('returns true for matching input', () => {
    const { regex } = compileRegex('^\\d+$', '')
    if (!regex) throw new Error('regex is null')
    expect(testMatch(regex, '12345')).toBe(true)
    expect(testMatch(regex, 'abc')).toBe(false)
  })
})

describe('explainRegex', () => {
  it('explains common metacharacters', () => {
    const explanation = explainRegex('\\d+')
    expect(explanation).toContain('\\d')
    expect(explanation).toContain('+')
  })

  it('returns fallback for literal patterns', () => {
    expect(explainRegex('hello')).toContain('Literal')
  })
})
