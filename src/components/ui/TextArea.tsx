import type { TextareaHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import './Input.css'
import './TextArea.css'

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  helperText?: string
  error?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, helperText, error, id, className, rows = 4, ...rest },
  ref,
) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const helperId = `${fieldId}-helper`
  const errorId = `${fieldId}-error`
  const describedBy = error ? errorId : helperText ? helperId : undefined

  const fieldClasses = ['un-field', error ? 'un-field--error' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={fieldClasses}>
      {label && (
        <label htmlFor={fieldId} className="un-field__label">
          {label}
        </label>
      )}
      <div className="un-field__control un-field__control--textarea">
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          className="un-field__input un-field__textarea"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
      </div>
      {error ? (
        <span id={errorId} className="un-field__error">
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="un-field__helper">
          {helperText}
        </span>
      ) : null}
    </div>
  )
})
