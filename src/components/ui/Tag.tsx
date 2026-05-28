import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Tag.css'

export type TagProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
  children: ReactNode
}

export function Tag({ active = false, className, children, type = 'button', ...rest }: TagProps) {
  const classes = ['un-tag', active ? 'un-tag--active' : '', className ?? '']
    .filter(Boolean)
    .join(' ')
  return (
    <button type={type} className={classes} aria-pressed={active} {...rest}>
      {children}
    </button>
  )
}
