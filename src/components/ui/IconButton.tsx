import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import './IconButton.css'

type IconButtonVariant = 'primary' | 'secondary' | 'ghost'
type IconButtonSize = 'sm' | 'md' | 'lg'

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant
  size?: IconButtonSize
  'aria-label': string
  children: ReactNode
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'ghost', size = 'md', className, children, type = 'button', ...rest },
  ref,
) {
  const classes = [
    'un-icon-button',
    `un-icon-button--${variant}`,
    `un-icon-button--${size}`,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {children}
    </button>
  )
})
