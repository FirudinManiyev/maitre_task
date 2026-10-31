import { LoaderCircle } from 'lucide-react'

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <LoaderCircle
      aria-hidden="true"
      className={`size-4 animate-spin motion-reduce:animate-none ${className}`}
    />
  )
}
