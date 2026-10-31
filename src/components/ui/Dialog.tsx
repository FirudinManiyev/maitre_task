import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'

interface DialogProps {
  labelledBy: string
  describedBy: string
  onRequestClose: () => void
  children: ReactNode
}

export function Dialog({ labelledBy, describedBy, onRequestClose, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    dialog?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      trigger?.focus()
    }
  }, [])

  function keepFocusInside(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const dialog = event.currentTarget
    const controls = dialog.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
    )
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (!first) {
      event.preventDefault()
      dialog.focus()
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      className="modal-dialog"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onKeyDown={keepFocusInside}
      onCancel={(event) => {
        event.preventDefault()
        onRequestClose()
      }}
    >
      {children}
    </dialog>
  )
}
