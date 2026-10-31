import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createProduct,
  getCategories,
  getProducts,
  updateProduct,
} from '../../../../maitre_task/api'
import type {
  GetProductsParams,
  Product,
  ProductInput,
  PagedResult,
} from '../../../../maitre_task/api'

export const productKeys = {
  all: ['products'] as const,
  list: (params: GetProductsParams) => ['products', params] as const,
  categories: ['categories'] as const,
}

export const categoriesQuery = queryOptions({
  queryKey: productKeys.categories,
  queryFn: getCategories,
  staleTime: Infinity,
})

export function productsQuery(params: GetProductsParams) {
  return queryOptions({ queryKey: productKeys.list(params), queryFn: () => getProducts(params) })
}

export function useSaveProduct(productId?: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProductInput) =>
      productId === undefined ? createProduct(input) : updateProduct(productId, input),
    onSuccess: () => {
      // Refetch every affected filter/page without repeating the write request.
      void queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}

export function useProductStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isAvailable }: Pick<Product, 'id' | 'isAvailable'>) =>
      updateProduct(id, { isAvailable }),
    onSuccess: (updated) => {
      // The supplied API reads live data when a request resolves. Keep concurrent reads running,
      // including refreshes triggered by creating/editing another product.
      queryClient.setQueriesData<PagedResult<Product>>(
        { queryKey: productKeys.all },
        (current) =>
          current && {
            ...current,
            items: current.items.map((item) => (item.id === updated.id ? updated : item)),
          },
      )
    },
  })
}
