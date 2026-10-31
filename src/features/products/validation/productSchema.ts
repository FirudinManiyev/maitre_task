import { z } from 'zod'
import { MAX_NAME_LENGTH } from '../constants'

const validName = (required: boolean) =>
  z
    .string()
    .trim()
    .min(required ? 1 : 0, 'Azərbaycan dilində ad məcburidir.')
    .max(MAX_NAME_LENGTH, `Ad ən çox ${MAX_NAME_LENGTH} simvol ola bilər.`)
    .refine(
      (value) =>
        [...value].every(
          (character) => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127,
        ),
      'Adda idarəetmə simvolları ola bilməz.',
    )

export function createProductSchema(categoryIds: number[]) {
  return z.object({
    nameAz: validName(true),
    nameEn: validName(false),
    categoryId: z
      .string()
      .refine((value) => categoryIds.includes(Number(value)), 'Kateqoriya seçin.'),
    price: z
      .string()
      .trim()
      .min(1, 'Qiymət məcburidir.')
      .refine(
        (value) => /^\d+(?:[.,]\d{1,2})?$/.test(value),
        'Qiyməti ən çox 2 onluq rəqəmlə daxil edin.',
      )
      .refine((value) => {
        const price = Number(value.replace(',', '.'))
        return Number.isFinite(price) && price > 0 && price <= Number.MAX_SAFE_INTEGER / 100
      }, 'Qiymət 0-dan böyük və etibarlı məbləğ olmalıdır.'),
    isAvailable: z.boolean(),
  })
}

export interface ProductFormValues {
  nameAz: string
  nameEn: string
  categoryId: string
  price: string
  isAvailable: boolean
}
