import type { ReactNode } from 'react'
import './EmptyState.css'

export type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  const classes = ['un-empty', className ?? ''].filter(Boolean).join(' ')
  return (
    <div className={classes}>
      {icon && <div className="un-empty__icon">{icon}</div>}
      <h3 className="un-empty__title">{title}</h3>
      {description && <p className="un-empty__description">{description}</p>}
      {action && <div className="un-empty__action">{action}</div>}
    </div>
  )
}
