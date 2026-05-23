import { describe, it, expect } from 'vitest'
import {
  parseChecklistInput,
  transitionState,
  computeProgress,
  filterItems,
  exportAsPlainText,
  exportAsMarkdown,
} from '../checklist'

describe('parseChecklistInput', () => {
  it('splits newline-separated items', () => {
    const items = parseChecklistInput('foo\nbar\nbaz')
    expect(items).toHaveLength(3)
    expect(items[0]?.text).toBe('foo')
    expect(items[1]?.text).toBe('bar')
  })

  it('splits comma-separated items', () => {
    const items = parseChecklistInput('foo,bar,baz')
    expect(items).toHaveLength(3)
  })

  it('ignores empty lines', () => {
    const items = parseChecklistInput('\n\nfoo\n\nbar\n')
    expect(items).toHaveLength(2)
  })

  it('auto-detects [x] as checked state', () => {
    const items = parseChecklistInput('[x] done item')
    expect(items[0]?.state).toBe('checked')
    expect(items[0]?.text).toBe('done item')
  })

  it('auto-detects [~] as invalid state', () => {
    const items = parseChecklistInput('[~] invalid item')
    expect(items[0]?.state).toBe('invalid')
  })

  it('returns empty array for empty input', () => {
    expect(parseChecklistInput('')).toHaveLength(0)
    expect(parseChecklistInput('   ')).toHaveLength(0)
  })
})

describe('transitionState', () => {
  it('unchecked → checked → invalid → unchecked', () => {
    expect(transitionState('unchecked')).toBe('checked')
    expect(transitionState('checked')).toBe('invalid')
    expect(transitionState('invalid')).toBe('unchecked')
  })
})

describe('computeProgress', () => {
  it('calculates percentages correctly', () => {
    const items = parseChecklistInput('a\nb\nc\nd')
    if (items[0]) items[0].state = 'checked'
    if (items[1]) items[1].state = 'checked'
    const p = computeProgress(items)
    expect(p.total).toBe(4)
    expect(p.checked).toBe(2)
    expect(p.percent).toBe(50)
  })

  it('returns 0% for empty list', () => {
    expect(computeProgress([])).toMatchObject({ total: 0, percent: 0 })
  })
})

describe('filterItems', () => {
  it('returns all items when query is empty', () => {
    const items = parseChecklistInput('foo\nbar')
    expect(filterItems(items, '')).toHaveLength(2)
  })

  it('filters case-insensitively', () => {
    const items = parseChecklistInput('Deploy database\nRun tests\nUpdate docs')
    expect(filterItems(items, 'deploy')).toHaveLength(1)
    expect(filterItems(items, 'DEPLOY')).toHaveLength(1)
  })
})

describe('exportAsPlainText', () => {
  it('includes state prefixes', () => {
    const items = parseChecklistInput('foo\nbar')
    if (items[0]) items[0].state = 'checked'
    const text = exportAsPlainText(items)
    expect(text).toContain('[x] foo')
    expect(text).toContain('[ ] bar')
  })
})

describe('exportAsMarkdown', () => {
  it('formats invalid items with strikethrough', () => {
    const items = parseChecklistInput('broken item')
    if (items[0]) items[0].state = 'invalid'
    const md = exportAsMarkdown(items)
    expect(md).toContain('~~broken item~~')
  })
})
