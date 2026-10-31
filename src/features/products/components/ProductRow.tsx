import type { Product } from '../../../../maitre_task/api'
import { Button } from '../../../components/ui/Button'
import { Toggle } from '../../../components/ui/Toggle'
import { getErrorMessage } from '../../../lib/errors'
import { formatPrice } from '../../../lib/format'
import { useProductStatus } from '../api/productQueries'

interface ProductRowProps {
  product: Product
  categoryName: string
  onEdit: (product: Product) => void
  canEdit: boolean
}

export function ProductRow({ product, categoryName, onEdit, canEdit }: ProductRowProps) {
  const statusMutation = useProductStatus()
  const changeStatus = () =>
    statusMutation.mutate({ id: product.id, isAvailable: !product.isAvailable })

  return (
    <tr className={`product-row ${!product.isAvailable ? 'product-unavailable' : ''}`}>
      <td className="product-name">
        <span className="block font-medium">{product.nameAz}</span>
        <span
          className="mt-1 block text-[13px] leading-[18px] text-muted"
          lang={product.nameEn ? 'en' : undefined}
        >
          {product.nameEn || '—'}
        </span>
      </td>
      <td className="product-category">
        <span className="category-badge">{categoryName}</span>
      </td>
      <td className="product-price tabular-nums">{formatPrice(product.price)}</td>
      <td className="product-status">
        <div className="flex items-center gap-3">
          <Toggle
            checked={product.isAvailable}
            pending={statusMutation.isPending}
            label={`${product.nameAz}: satış statusu`}
            onChange={changeStatus}
          />
          <span className="text-sm">{product.isAvailable ? 'Satışda' : 'Satışda deyil'}</span>
        </div>
        {statusMutation.isError && (
          <div role="alert" className="mt-2 max-w-[250px] text-xs text-danger">
            <p>{getErrorMessage(statusMutation.error)}</p>
            <button
              type="button"
              onClick={changeStatus}
              className="mt-1 rounded underline underline-offset-2"
            >
              Yenidən cəhd et
            </button>
          </div>
        )}
      </td>
      <td className="product-actions">
        <Button
          small
          disabled={statusMutation.isPending || !canEdit}
          onClick={() => onEdit(product)}
          aria-label={`${product.nameAz}: düzəlt`}
        >
          Düzəlt
        </Button>
      </td>
    </tr>
  )
}
