import type { HTMLAttributes, ReactNode } from 'react'
import { Badge, Card } from '../ui'
import { Lock } from 'lucide-react'
import './GearCard.css'

export type GearCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Display name of the gear item */
  name: string
  /** Emoji or icon node representing the gear */
  icon: ReactNode
  /** Whether this gear is unlocked */
  unlocked: boolean
  /** The requirement to unlock this item */
  unlockCondition?: string
  /** Index in the grid for stagger animation */
  index?: number
}

export function GearCard({ name, icon, unlocked, unlockCondition, index = 0, className, style, ...rest }: GearCardProps) {
  const classes = [
    'un-gear-card',
    unlocked ? 'un-gear-card--unlocked' : 'un-gear-card--locked',
    className ?? '',
  ].filter(Boolean).join(' ')

  return (
    <Card
      variant="elevated"
      className={classes}
      style={{ '--un-gear-stagger': `${index * 80}ms`, ...style } as React.CSSProperties}
      {...rest}
    >
      <div className="un-gear-card__icon-wrapper">
        {unlocked ? <span className="un-gear-card__icon">{icon}</span> : <Lock size={24} color="#6b7280" strokeWidth={2} />}
      </div>
      <span className="un-gear-card__name">{name}</span>
      {unlockCondition && <span className="un-gear-card__condition">{unlockCondition}</span>}
      <div className="un-gear-card__status">
        <Badge 
          variant={unlocked ? 'resolved' : 'default'}
          style={!unlocked ? { background: '#6b7280', color: '#fff', border: 'none' } : { background: '#78c2a4', color: '#1a4f3b' }}
        >
          {unlocked ? 'Unlocked' : 'Locked'}
        </Badge>
      </div>
    </Card>
  )
}

