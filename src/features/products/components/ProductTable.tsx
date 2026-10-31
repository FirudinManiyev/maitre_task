import type { Category, Product } from '../../../../maitre_task/api'
import { ProductRow } from './ProductRow'

interface ProductTableProps {
  products: Product[]
  categories: Category[]
  onEdit: (product: Product) => void
  busy: boolean
  canEdit: boolean
}

export function ProductTable({ products, categories, onEdit, busy, canEdit }: ProductTableProps) {
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]))

  return (
    <div className="product-table-container" aria-busy={busy}>
      <table className="product-table">
        <caption className="sr-only">
          Menyudakı məhsullar: ad, kateqoriya, qiymət və satış statusu
        </caption>
        <colgroup>
          <col className="w-[34%]" />
          <col className="w-[22%]" />
          <col className="w-[10%]" />
          <col className="w-[22%]" />
          <col className="w-[12%]" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">AD</th>
            <th scope="col">KATEQORİYA</th>
            <th scope="col" className="text-right">
              QİYMƏT
            </th>
            <th scope="col">STATUS</th>
            <th scope="col">
              <span className="sr-only">Əməliyyatlar</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              categoryName={categoryNames.get(product.categoryId) ?? 'Naməlum kateqoriya'}
              onEdit={onEdit}
              canEdit={canEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
