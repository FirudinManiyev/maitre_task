import { describe, expect, it } from 'vitest'
import { paginationItems } from './pagination'

describe('pagination', () => {
  it('matches the supplied first-page layout', () =>
    expect(paginationItems(1, 5)).toEqual([1, 2, 3, 'gap-5', 5]))
  it('keeps first, current and last pages accessible', () =>
    expect(paginationItems(6, 10)).toEqual([1, 'gap-5', 5, 6, 7, 'gap-10', 10]))
  it('shows the final three pages', () =>
    expect(paginationItems(5, 5)).toEqual([1, 'gap-3', 3, 4, 5]))
  it('shows every page for a short list', () => expect(paginationItems(2, 3)).toEqual([1, 2, 3]))
})
