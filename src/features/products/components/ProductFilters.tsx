import { ChevronDown, Search, X } from 'lucide-react'
import type { Category } from '../../../../maitre_task/api'
import { MAX_SEARCH_LENGTH } from '../constants'

interface ProductFiltersProps {
  search: string
  categoryId?: number
  categories: Category[]
  categoriesPending: boolean
  onSearch: (value: string) => void
  onCategory: (value?: number) => void
}

export function ProductFilters({
  search,
  categoryId,
  categories,
  categoriesPending,
  onSearch,
  onCategory,
}: ProductFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <div className="relative w-full sm:w-[380px]">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-5 size-[18px] -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          aria-label="Ada görə axtar"
          placeholder="Ada görə axtar..."
          maxLength={MAX_SEARCH_LENGTH}
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="input pr-12 pl-[46px]"
        />
        {search && (
          <button
            type="button"
            aria-label="Axtarışı təmizlə"
            onClick={() => onSearch('')}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 text-muted"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="relative w-full sm:w-[240px]">
        <select
          aria-label="Kateqoriyaya görə filtr"
          value={categoryId ?? ''}
          disabled={categoriesPending}
          onChange={(event) =>
            onCategory(event.target.value ? Number(event.target.value) : undefined)
          }
          className="input appearance-none pr-11"
        >
          <option value="">
            {categoriesPending ? 'Kateqoriyalar yüklənir...' : 'Bütün kateqoriyalar'}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted"
        />
      </div>
    </div>
  )
}
