import { PackageOpen, SearchX } from 'lucide-react'
import { Button } from '../../../components/ui/Button'

export function ProductsLoading() {
  return (
    <div role="status" className="overflow-hidden rounded-2xl border border-line bg-white">
      <span className="sr-only">Məhsullar yüklənir...</span>
      <div className="h-12 border-b border-line bg-background" />
      {Array.from({ length: 10 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex h-16 items-center gap-8 border-b border-line px-6 last:border-0"
        >
          <div className="w-[34%] space-y-2">
            <div className="skeleton h-3 w-3/5" />
            <div className="skeleton h-2 w-2/5" />
          </div>
          <div className="skeleton hidden h-6 w-[12%] sm:block" />
          <div className="skeleton ml-auto h-3 w-[10%]" />
          <div className="skeleton h-6 w-10" />
        </div>
      ))}
    </div>
  )
}

export function ProductsEmpty({
  filtered,
  onReset,
  onCreate,
  canCreate,
}: {
  filtered: boolean
  onReset: () => void
  onCreate: () => void
  canCreate: boolean
}) {
  const Icon = filtered ? SearchX : PackageOpen
  return (
    <div
      role="status"
      className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-line bg-white px-6 py-12 text-center"
    >
      <span className="mb-5 rounded-full bg-sand p-4 text-primary">
        <Icon className="size-8" aria-hidden="true" />
      </span>
      <h2 className="mb-2 text-xl font-semibold">
        {filtered ? 'Məhsul tapılmadı' : 'Hələ məhsul yoxdur'}
      </h2>
      <p className="mb-6 max-w-sm text-sm text-muted">
        {filtered
          ? 'Axtarışı və ya kateqoriyanı dəyişərək yenidən yoxlayın.'
          : 'Menyunuzu yaratmaq üçün ilk məhsulu əlavə edin.'}
      </p>
      <Button
        variant="primary"
        onClick={filtered ? onReset : onCreate}
        disabled={!filtered && !canCreate}
      >
        {filtered ? 'Filtrləri təmizlə' : 'Yeni məhsul'}
      </Button>
    </div>
  )
}
