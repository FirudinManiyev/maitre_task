import { Spinner } from './Spinner'

interface ToggleProps {
  checked: boolean
  onChange: () => void
  label: string
  disabled?: boolean
  pending?: boolean
}

export function Toggle({ checked, onChange, label, disabled, pending }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-busy={pending || undefined}
      disabled={disabled || pending}
      onClick={onChange}
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-success' : 'bg-switch-off'}`}
    >
      <span
        className={`flex size-[18px] items-center justify-center rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-[19px]' : 'translate-x-[3px]'}`}
      >
        {pending && <Spinner className="size-3 text-muted" />}
      </span>
    </button>
  )
}
