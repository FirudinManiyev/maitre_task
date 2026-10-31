import { CheckCircle2, X } from 'lucide-react'
import { useEffect } from 'react'

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 6000)
    return () => window.clearTimeout(timeout)
  }, [message, onClose])

  return (
    <div
      role="status"
      className="fixed right-4 bottom-5 left-4 z-50 flex items-center gap-3 rounded-2xl border border-success/20 bg-success-soft p-4 text-success shadow-lg sm:left-auto sm:max-w-md"
    >
      <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
      <p className="text-sm">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Bildirişi bağla"
        className="ml-auto rounded-full p-1"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
