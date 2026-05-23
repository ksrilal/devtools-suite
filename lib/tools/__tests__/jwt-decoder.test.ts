import { describe, it, expect } from 'vitest'
import { decodeJWT, getExpiryStatus, formatRelativeTime } from '../jwt-decoder'

// A well-known test JWT (no sensitive data)
const TEST_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('decodeJWT', () => {
  it('decodes a valid JWT', () => {
    const decoded = decodeJWT(TEST_JWT)
    expect(decoded.header.alg).toBe('HS256')
    expect(decoded.header.typ).toBe('JWT')
    expect(decoded.payload['sub']).toBe('1234567890')
    expect(decoded.payload['name']).toBe('John Doe')
  })

  it('throws for strings without 3 parts', () => {
    expect(() => decodeJWT('invalid')).toThrow()
    expect(() => decodeJWT('only.two')).toThrow()
  })

  it('detects no-expiry status when exp is absent', () => {
    const decoded = decodeJWT(TEST_JWT)
    expect(decoded.expiryStatus).toBe('no-expiry')
  })
})

describe('getExpiryStatus', () => {
  it('returns expired for past timestamp', () => {
    const status = getExpiryStatus({ exp: 1000000 }) // Far past
    expect(status).toBe('expired')
  })

  it('returns valid for future timestamp', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600
    expect(getExpiryStatus({ exp: futureExp })).toBe('valid')
  })

  it('returns no-expiry when exp is absent', () => {
    expect(getExpiryStatus({})).toBe('no-expiry')
  })
})

describe('formatRelativeTime', () => {
  it('formats future time', () => {
    const future = Math.floor(Date.now() / 1000) + 3600
    expect(formatRelativeTime(future)).toMatch(/in \d+ hour/)
  })

  it('formats past time', () => {
    const past = Math.floor(Date.now() / 1000) - 86400
    expect(formatRelativeTime(past)).toMatch(/day.* ago/)
  })
})
