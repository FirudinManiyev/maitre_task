export function AppHeader() {
  return (
    <header className="h-[72px] border-b border-line">
      <div className="page-container flex h-full items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5" aria-label="maitre">
            <svg width="28" height="24" viewBox="0 0 28 24" fill="none" aria-hidden="true">
              <path
                d="M2 20V4L14 14L26 4V20"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              />
              <path d="m14 14 3 3-3 3-3-3 3-3Z" fill="currentColor" className="text-primary" />
            </svg>
            <span className="text-[23px] leading-none font-semibold tracking-[-1px]">maitre</span>
          </div>
          <span className="font-label rounded-full bg-ink px-2.5 py-1 text-[11px] tracking-[.6px] text-white">
            ADMIN
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-muted">
          <span className="hidden sm:inline">Firudin Maniyev</span>
          <span
            className="flex size-9 items-center justify-center rounded-full bg-sand font-medium text-primary"
            aria-label="Firudin Maniyev"
          >
            FM
          </span>
        </div>
      </div>
    </header>
  )
}
