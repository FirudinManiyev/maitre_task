import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from './Button'
import { Spinner } from './Spinner'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  pending?: boolean
}

export function ErrorMessage({ message, onRetry, pending }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-danger/20 bg-danger-soft p-4 text-danger"
    >
      <p className="flex items-center gap-2 text-sm">
        <AlertCircle aria-hidden="true" className="size-5 shrink-0" />
        {message}
      </p>
      {onRetry && (
        <Button small onClick={onRetry} disabled={pending}>
          {pending ? <Spinner /> : <RotateCcw className="size-4" aria-hidden="true" />}Yenidən cəhd
          et
        </Button>
      )}
    </div>
  )
}
