import type { HTMLAttributes, ReactNode } from 'react'
import { Badge } from '../ui'
import './GearCard.css'

export type GearCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Display name of the gear item */
  name: string
  /** Emoji or icon node representing the gear */
  icon: ReactNode
  /** Whether this gear is unlocked */
  unlocked: boolean
  /** Index in the grid for stagger animation */
  index?: number
}

export function GearCard({ name, icon, unlocked, index = 0, className, style, ...rest }: GearCardProps) {
  const classes = [
    'un-gear-card',
    unlocked ? 'un-gear-card--unlocked' : 'un-gear-card--locked',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      style={{ '--un-gear-stagger': `${index * 80}ms`, ...style } as React.CSSProperties}
      {...rest}
    >
      <span className="un-gear-card__icon">{icon}</span>
      <span className="un-gear-card__name">{name}</span>
      <div className="un-gear-card__status">
        <Badge variant={unlocked ? 'resolved' : 'uncategorised'}>
          {unlocked ? 'Unlocked' : 'Locked'}
        </Badge>
      </div>
    </div>
  )
}

