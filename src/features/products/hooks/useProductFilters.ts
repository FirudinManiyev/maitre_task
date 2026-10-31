import { useCallback, useEffect, useState } from 'react'
import { MAX_SEARCH_LENGTH, SEARCH_DELAY } from '../constants'

export interface ProductFilters {
  search: string
  categoryId?: number
  page: number
}

function positiveInteger(value: string | null): number | undefined {
  if (!value || !/^[1-9]\d*$/.test(value)) return undefined
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) ? parsed : undefined
}

export function readProductFilters(search: string): ProductFilters {
  const params = new URLSearchParams(search)
  return {
    search: (params.get('search') ?? '').slice(0, MAX_SEARCH_LENGTH),
    categoryId: positiveInteger(params.get('category')),
    page: positiveInteger(params.get('page')) ?? 1,
  }
}

export function useProductFilters() {
  const [filters, setFilters] = useState(() => readProductFilters(window.location.search))
  const [searchInput, setSearchInput] = useState(filters.search)

  useEffect(() => {
    const onPopState = () => {
      const next = readProductFilters(window.location.search)
      setSearchInput(next.search)
      setFilters(next)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFilters((previous) =>
        previous.search === searchInput ? previous : { ...previous, search: searchInput, page: 1 },
      )
    }, SEARCH_DELAY)
    return () => window.clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.delete('search')
    url.searchParams.delete('category')
    url.searchParams.delete('page')
    if (filters.search.trim()) url.searchParams.set('search', filters.search.trim())
    if (filters.categoryId) url.searchParams.set('category', String(filters.categoryId))
    if (filters.page > 1) url.searchParams.set('page', String(filters.page))
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }, [filters])

  const setCategory = useCallback((categoryId?: number) => {
    setFilters((previous) => ({ ...previous, categoryId, page: 1 }))
  }, [])

  const setPage = useCallback((page: number) => {
    setFilters((previous) => ({ ...previous, page }))
  }, [])

  function resetFilters() {
    setSearchInput('')
    setFilters({ search: '', page: 1 })
  }

  return { filters, searchInput, setSearchInput, setCategory, setPage, resetFilters }
}
