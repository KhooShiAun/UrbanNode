import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import './Input.css'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string
  helperText?: string
  error?: string
  iconLeft?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, error, iconLeft, id, className, ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`
  const describedBy = error ? errorId : helperText ? helperId : undefined

  const fieldClasses = ['un-field', error ? 'un-field--error' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={fieldClasses}>
      {label && (
        <label htmlFor={inputId} className="un-field__label">
          {label}
        </label>
      )}
      <div className="un-field__control">
        {iconLeft && <span className="un-field__icon">{iconLeft}</span>}
        <input
          ref={ref}
          id={inputId}
          className="un-field__input"
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
