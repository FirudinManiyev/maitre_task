import type { ReactNode } from 'react'

export function ProductFormField({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string
  label: string
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-muted">(məcburi deyil)</span>
        ) : (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
