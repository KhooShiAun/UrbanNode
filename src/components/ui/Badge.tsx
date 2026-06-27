import type { HTMLAttributes, ReactNode } from 'react'
import './Badge.css'

export type BadgeVariant =
  | 'urgent'
  | 'routine'
  | 'low'
  | 'new'
  | 'in-progress'
  | 'resolved'
  | 'uncategorised'
  | 'critical'
  | 'high'
  | 'default'
  | 'success'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant: BadgeVariant
  children: ReactNode
}

export function Badge({ variant, className, children, ...rest }: BadgeProps) {
  const classes = ['un-badge', `un-badge--${variant}`, className ?? '']
    .filter(Boolean)
    .join(' ')
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  )
}
