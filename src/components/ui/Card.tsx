import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import './Card.css'

type CardVariant = 'default' | 'elevated' | 'bordered'
type SeverityAccent = 'critical' | 'urgent' | 'high' | 'routine' | 'low'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant
  accentColor?: SeverityAccent
  children: ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'default', accentColor, className, children, ...rest },
  ref,
) {
  const classes = [
    'un-card',
    `un-card--${variant}`,
    accentColor ? `un-card--accent-${accentColor}` : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={classes} {...rest}>
      {children}
    </div>
  )
})
