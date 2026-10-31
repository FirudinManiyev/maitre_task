import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import type { Category, Product } from '../../../../maitre_task/api'
import { Button } from '../../../components/ui/Button'
import { Dialog } from '../../../components/ui/Dialog'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import { Spinner } from '../../../components/ui/Spinner'
import { Toggle } from '../../../components/ui/Toggle'
import { MAX_NAME_LENGTH } from '../constants'
import { useProductForm } from '../hooks/useProductForm'
import { ProductFormField } from './ProductFormField'

interface ProductFormDialogProps {
  product: Product | null
  categories: Category[]
  onClose: () => void
  onSaved: (created: boolean) => void
}

export function ProductFormDialog({
  product,
  categories,
  onClose,
  onSaved,
}: ProductFormDialogProps) {
  const [confirmClose, setConfirmClose] = useState(false)
  const {
    register,
    errors,
    isDirty,
    isAvailable,
    pending,
    saveError,
    onSubmit,
    toggleAvailability,
  } = useProductForm(product, categories, onSaved)

  function requestClose() {
    if (pending) return
    if (isDirty) setConfirmClose(true)
    else onClose()
  }

  return (
    <Dialog
      labelledBy="product-dialog-title"
      describedBy="product-dialog-description"
      onRequestClose={requestClose}
    >
      <div className="flex items-start justify-between gap-4 px-6 pt-6">
        <div>
          <h2 id="product-dialog-title" className="text-xl font-semibold">
            {product ? 'Məhsulu düzəlt' : 'Yeni məhsul'}
          </h2>
          <p id="product-dialog-description" className="mt-1 text-sm text-muted">
            Məhsulun məlumatlarını daxil edin. * işarəli sahələr məcburidir.
          </p>
        </div>
        <button
          type="button"
          aria-label="Formanı bağla"
          disabled={pending}
          onClick={requestClose}
          className="-mr-2 -mt-2 rounded-full p-2 text-muted hover:bg-background"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <form onSubmit={onSubmit} noValidate aria-busy={pending} className="p-6">
        <fieldset disabled={pending} className="space-y-5">
          <ProductFormField
            id="nameAz"
            label="Ad (Azərbaycan dilində)"
            error={errors.nameAz?.message}
          >
            <input
              id="nameAz"
              data-autofocus
              autoComplete="off"
              maxLength={MAX_NAME_LENGTH}
              aria-required="true"
              aria-invalid={!!errors.nameAz}
              aria-describedby={errors.nameAz ? 'nameAz-error' : undefined}
              {...register('nameAz')}
              className="input"
              placeholder="Məsələn, Mərci şorbası"
            />
          </ProductFormField>
          <ProductFormField
            id="nameEn"
            label="Ad (ingilis dilində)"
            optional
            error={errors.nameEn?.message}
          >
            <input
              id="nameEn"
              autoComplete="off"
              maxLength={MAX_NAME_LENGTH}
              aria-invalid={!!errors.nameEn}
              aria-describedby={errors.nameEn ? 'nameEn-error' : undefined}
              {...register('nameEn')}
              className="input"
              placeholder="Məsələn, Lentil soup"
            />
          </ProductFormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <ProductFormField id="categoryId" label="Kateqoriya" error={errors.categoryId?.message}>
              <div className="relative">
                <select
                  id="categoryId"
                  aria-required="true"
                  aria-invalid={!!errors.categoryId}
                  aria-describedby={errors.categoryId ? 'categoryId-error' : undefined}
                  {...register('categoryId')}
                  className="input appearance-none pr-10"
                >
                  <option value="">Kateqoriya seçin</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-4 right-4 size-4 text-muted"
                />
              </div>
            </ProductFormField>
            <ProductFormField id="price" label="Qiymət (₼)" error={errors.price?.message}>
              <input
                id="price"
                inputMode="decimal"
                autoComplete="off"
                maxLength={20}
                aria-required="true"
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? 'price-error' : undefined}
                {...register('price')}
                className="input tabular-nums"
                placeholder="0,00"
              />
            </ProductFormField>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-background p-4">
            <div>
              <p className="text-sm font-medium">Satış statusu</p>
              <p className="mt-1 text-xs text-muted">
                {isAvailable ? 'Məhsul satışdadır' : 'Məhsul satışda deyil'}
              </p>
            </div>
            <Toggle
              label="Məhsulun satış statusu"
              checked={isAvailable}
              disabled={pending}
              onChange={toggleAvailability}
            />
          </div>
        </fieldset>
        {saveError && (
          <div className="mt-5">
            <ErrorMessage message={saveError} />
          </div>
        )}
        {confirmClose && (
          <div role="alert" className="mt-5 rounded-2xl border border-line bg-background p-4">
            <p className="text-sm">
              Yadda saxlanılmamış dəyişikliklər var. Formanı bağlamaq istəyirsiniz?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button small disabled={pending} onClick={() => setConfirmClose(false)}>
                Redaktəyə davam et
              </Button>
              <Button small disabled={pending} onClick={onClose}>
                Dəyişiklikləri ləğv et
              </Button>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3 border-t border-line pt-5">
          <Button disabled={pending} onClick={requestClose}>
            Ləğv et
          </Button>
          <Button type="submit" variant="primary" disabled={pending}>
            {pending && <Spinner />}
            {pending ? 'Yadda saxlanılır...' : 'Yadda saxla'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
