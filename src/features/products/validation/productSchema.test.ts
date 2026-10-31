import { describe, expect, it } from 'vitest'
import { createProductSchema } from './productSchema'

const schema = createProductSchema([1, 2])
const valid = {
  nameAz: 'Mərci şorbası',
  nameEn: '',
  categoryId: '1',
  price: '4,50',
  isAvailable: true,
}

describe('product validation', () => {
  it('accepts optional English and trims names', () => {
    expect(schema.parse({ ...valid, nameAz: '  Dovğa  ', nameEn: '  ' })).toMatchObject({
      nameAz: 'Dovğa',
      nameEn: '',
    })
  })

  it.each(['', '   '])('rejects empty Azerbaijani name: %j', (nameAz) => {
    expect(schema.safeParse({ ...valid, nameAz }).success).toBe(false)
  })

  it.each(['', '0', '-2', 'NaN', 'Infinity', '1e4', '0x10', '2.555', '1,2.3', '9007199254740991'])(
    'rejects invalid price: %s',
    (price) => {
      expect(schema.safeParse({ ...valid, price }).success).toBe(false)
    },
  )

  it.each(['0.01', '0,01', '4.50', '4,50', '18'])(
    'accepts a valid monetary amount: %s',
    (price) => {
      expect(schema.safeParse({ ...valid, price }).success).toBe(true)
    },
  )

  it.each(['', '0', '999', 'NaN'])('rejects unknown categories: %s', (categoryId) => {
    expect(schema.safeParse({ ...valid, categoryId }).success).toBe(false)
  })

  it('rejects overlong names and embedded control characters', () => {
    expect(schema.safeParse({ ...valid, nameAz: 'a'.repeat(121) }).success).toBe(false)
    expect(schema.safeParse({ ...valid, nameEn: 'a'.repeat(121) }).success).toBe(false)
    expect(schema.safeParse({ ...valid, nameAz: 'a\u0000b' }).success).toBe(false)
  })
})
