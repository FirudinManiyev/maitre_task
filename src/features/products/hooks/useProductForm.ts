import { useRef, type FormEvent } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Category, Product } from '../../../../maitre_task/api'
import { getErrorMessage } from '../../../lib/errors'
import { useSaveProduct } from '../api/productQueries'
import { createProductSchema, type ProductFormValues } from '../validation/productSchema'

export function useProductForm(
  product: Product | null,
  categories: Category[],
  onSaved: (created: boolean) => void,
) {
  const submitLock = useRef(false)
  const saveMutation = useSaveProduct(product?.id)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema(categories.map((category) => category.id))),
    mode: 'onBlur',
    defaultValues: {
      nameAz: product?.nameAz ?? '',
      nameEn: product?.nameEn ?? '',
      categoryId: product ? String(product.categoryId) : '',
      price: product ? String(product.price).replace('.', ',') : '',
      isAvailable: product?.isAvailable ?? true,
    },
  })
  const isAvailable = useWatch({ control, name: 'isAvailable' })

  async function saveProduct(values: ProductFormValues) {
    if (submitLock.current) return
    submitLock.current = true
    try {
      await saveMutation.mutateAsync({
        nameAz: values.nameAz,
        nameEn: values.nameEn || null,
        categoryId: Number(values.categoryId),
        price: Number(values.price.replace(',', '.')),
        isAvailable: values.isAvailable,
      })
      onSaved(!product)
    } catch {
      // Preserve the fields and expose the mutation error for an explicit retry.
    } finally {
      submitLock.current = false
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    void handleSubmit(saveProduct)(event)
  }

  return {
    register,
    errors,
    isDirty,
    isAvailable,
    onSubmit,
    pending: isSubmitting || saveMutation.isPending,
    saveError: saveMutation.isError ? getErrorMessage(saveMutation.error) : undefined,
    toggleAvailability: () => setValue('isAvailable', !isAvailable, { shouldDirty: true }),
  }
}
