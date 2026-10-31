import { describe, expect, it } from 'vitest'
import { formatPrice } from './format'

describe('AZN formatting', () => {
  it('uses comma decimals and two digits', () => {
    expect(formatPrice(4.5)).toBe('4,50 ₼')
    expect(formatPrice(18)).toBe('18,00 ₼')
    expect(formatPrice(0.01)).toBe('0,01 ₼')
  })
})
