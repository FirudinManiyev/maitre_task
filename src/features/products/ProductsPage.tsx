import { useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import type { Product } from '../../../maitre_task/api'
import { Button } from '../../components/ui/Button'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import { Toast } from '../../components/ui/Toast'
import { getErrorMessage } from '../../lib/errors'
import { categoriesQuery, productsQuery } from './api/productQueries'
import { Pagination } from './components/Pagination'
import { ProductFilters } from './components/ProductFilters'
import { ProductFormDialog } from './components/ProductFormDialog'
import { ProductsEmpty, ProductsLoading } from './components/ProductListState'
import { ProductTable } from './components/ProductTable'
import { PAGE_SIZE } from './constants'
import { useProductFilters } from './hooks/useProductFilters'

export function ProductsPage() {
  const { filters, searchInput, setSearchInput, setCategory, setPage, resetFilters } =
    useProductFilters()
  const categories = useQuery(categoriesQuery)
  const products = useQuery(productsQuery({ ...filters, pageSize: PAGE_SIZE }))
  const [editor, setEditor] = useState<{ product: Product | null } | null>(null)
  const [toast, setToast] = useState('')
  const closeToast = useCallback(() => setToast(''), [])
  const hasFilters = !!filters.search.trim() || filters.categoryId !== undefined
  const categoryList = categories.data ?? []
  const canEdit = !!categories.data
  const totalPages = products.data
    ? Math.max(1, Math.ceil(products.data.total / PAGE_SIZE))
    : undefined

  useEffect(() => {
    if (totalPages !== undefined && filters.page > totalPages) setPage(totalPages)
  }, [totalPages, filters.page, setPage])

  useEffect(() => {
    if (
      categories.data &&
      filters.categoryId !== undefined &&
      !categories.data.some((category) => category.id === filters.categoryId)
    )
      setCategory(undefined)
  }, [categories.data, filters.categoryId, setCategory])

  function onSaved(created: boolean) {
    setEditor(null)
    setToast(created ? 'Məhsul uğurla əlavə edildi.' : 'Dəyişikliklər yadda saxlanıldı.')
  }

  return (
    <main id="main-content" className="page-container pt-10 pb-10">
      <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-[38px] leading-[44px] font-normal tracking-[-1.3px]">Məhsullar</h1>
          <p className="mt-2 text-base leading-5 text-muted">
            {hasFilters ? 'Axtarış nəticələri' : 'Menyudakı bütün məhsullar'}
            {products.data ? ` · ${products.data.total} məhsul` : ''}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setEditor({ product: null })}
          disabled={!canEdit}
          className="self-start sm:self-auto"
        >
          <Plus className="size-5" aria-hidden="true" />
          Yeni məhsul
        </Button>
      </div>
      <ProductFilters
        search={searchInput}
        categoryId={filters.categoryId}
        categories={categoryList}
        categoriesPending={categories.isPending}
        onSearch={setSearchInput}
        onCategory={setCategory}
      />
      {categories.isError && (
        <div className="mb-4">
          <ErrorMessage
            message={`Kateqoriyalar yüklənmədi. ${getErrorMessage(categories.error)}`}
            onRetry={() => void categories.refetch()}
            pending={categories.isFetching}
          />
        </div>
      )}
      {products.isError && (
        <div className="mb-4">
          <ErrorMessage
            message={getErrorMessage(products.error)}
            onRetry={() => void products.refetch()}
            pending={products.isFetching}
          />
        </div>
      )}
      <div aria-live="polite" className="sr-only">
        {products.isFetching && !products.isPending ? 'Məhsullar yenilənir...' : ''}
      </div>
      {products.isPending || categories.isPending ? (
        <ProductsLoading />
      ) : (
        products.data &&
        (products.data.items.length > 0 ? (
          <ProductTable
            products={products.data.items}
            categories={categoryList}
            onEdit={(product) => setEditor({ product })}
            busy={products.isFetching}
            canEdit={canEdit}
          />
        ) : (
          <ProductsEmpty
            filtered={hasFilters}
            onReset={resetFilters}
            onCreate={() => setEditor({ product: null })}
            canCreate={canEdit}
          />
        ))
      )}
      {products.data && products.data.total > 0 && (
        <Pagination
          page={Math.min(filters.page, totalPages ?? 1)}
          total={products.data.total}
          onChange={setPage}
          disabled={products.isFetching}
        />
      )}
      {editor && (
        <ProductFormDialog
          product={editor.product}
          categories={categoryList}
          onClose={() => setEditor(null)}
          onSaved={onSaved}
        />
      )}
      {toast && <Toast message={toast} onClose={closeToast} />}
    </main>
  )
}
