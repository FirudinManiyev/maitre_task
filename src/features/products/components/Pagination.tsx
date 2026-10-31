import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PAGE_SIZE } from '../constants'
import { paginationItems } from '../utils/pagination'

interface PaginationProps {
  page: number
  total: number
  onChange: (page: number) => void
  disabled: boolean
}

export function Pagination({ page, total, onChange, disabled }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, total)
  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-muted" aria-live="polite">
        {start}–{end} / {total} məhsul
      </p>
      {totalPages > 1 && (
        <nav aria-label="Səhifələmə" className="flex items-center gap-1.5">
          <button
            type="button"
            className="page-button"
            aria-label="Əvvəlki səhifə"
            disabled={disabled || page <= 1}
            onClick={() => onChange(page - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          {paginationItems(page, totalPages).map((item) =>
            typeof item === 'number' ? (
              <button
                type="button"
                key={item}
                className={`page-button ${page === item ? 'page-active' : ''}`}
                aria-label={`Səhifə ${item}`}
                aria-current={page === item ? 'page' : undefined}
                disabled={disabled}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            ) : (
              <span key={item} className="px-1 text-muted" aria-hidden="true">
                ...
              </span>
            ),
          )}
          <button
            type="button"
            className="page-button"
            aria-label="Növbəti səhifə"
            disabled={disabled || page >= totalPages}
            onClick={() => onChange(page + 1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  )
}
