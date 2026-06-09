import type { HTMLAttributes, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Card } from './Card'
import './StatCard.css'

export type StatCardProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode
  label: string
  value: string | number
  /** Animation stagger delay in ms (e.g. 0, 100, 200 for a row of 3) */
  staggerMs?: number
}

export function StatCard({ icon, label, value, staggerMs = 0, className, ...rest }: StatCardProps) {
  const classes = ['un-stat-card', className ?? ''].filter(Boolean).join(' ')
  return (
    <Card
      variant="elevated"
      className={classes}
      style={{ '--un-stagger': `${staggerMs}ms` } as React.CSSProperties}
      {...rest}
    >
      {icon && <div className="un-stat-card__icon">{icon}</div>}
      <span className="un-stat-card__value">{value}</span>
      <span className="un-stat-card__label">{label}</span>
    </Card>
  )
}

