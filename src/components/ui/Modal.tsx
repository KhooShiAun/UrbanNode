import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconButton } from './IconButton'
import { X } from '../icons'
import './Modal.css'

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    // Lock background scroll while the modal is open.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Move focus into the dialog.
    const content = contentRef.current
    const firstFocusable = content?.querySelector<HTMLElement>(FOCUSABLE)
    ;(firstFocusable ?? content)?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && content) {
        const focusables = Array.from(content.querySelectorAll<HTMLElement>(FOCUSABLE))
        if (focusables.length === 0) {
          e.preventDefault()
          return
        }
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement
        if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      previouslyFocused.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="un-modal" role="presentation">
      <div className="un-modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={contentRef}
        className="un-modal__content"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <header className="un-modal__header">
          <h2 className="un-modal__title">{title}</h2>
          <IconButton aria-label="Close" variant="ghost" size="sm" onClick={onClose}>
            <X />
          </IconButton>
        </header>
        <div className="un-modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
