import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { readProductFilters, useProductFilters } from './useProductFilters'

describe('URL filters', () => {
  it('reads persisted filters and page', () => {
    expect(readProductFilters('?search=Dov%C4%9Fa&category=1&page=2')).toEqual({
      search: 'Dovğa',
      categoryId: 1,
      page: 2,
    })
  })

  it.each(['-1', '0', '2.5', 'Infinity', 'NaN', '99999999999999999999999'])(
    'rejects malformed numeric parameters: %s',
    (value) => {
      expect(readProductFilters(`?page=${value}&category=${value}`)).toEqual({
        search: '',
        categoryId: undefined,
        page: 1,
      })
    },
  )

  it('limits search length', () => {
    expect(readProductFilters(`?search=${'a'.repeat(1000)}`).search).toHaveLength(120)
  })

  it('debounces search, resets page and keeps unrelated URL parameters', async () => {
    window.history.replaceState(null, '', '/?page=3&source=menu')
    const { result } = renderHook(useProductFilters)
    act(() => result.current.setSearchInput('Mərci'))
    expect(result.current.filters.page).toBe(3)
    await waitFor(() => expect(result.current.filters.search).toBe('Mərci'))
    expect(result.current.filters.page).toBe(1)
    expect(new URLSearchParams(window.location.search).get('source')).toBe('menu')
    act(() => result.current.setCategory(2))
    expect(new URLSearchParams(window.location.search).get('category')).toBe('2')
  })

  it('responds to browser navigation', () => {
    const { result } = renderHook(useProductFilters)
    act(() => {
      window.history.pushState(null, '', '/?search=salat&category=4&page=2')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(result.current.filters).toEqual({ search: 'salat', categoryId: 4, page: 2 })
    expect(result.current.searchInput).toBe('salat')
  })
})
