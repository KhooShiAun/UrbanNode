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

function useCountUp(target: number, durationMs = 800, delayMs = 0) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now()
      const step = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / durationMs, 1)
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(eased * target))
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step)
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }, delayMs)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(rafRef.current)
    }
  }, [target, durationMs, delayMs])

  return display
}

export function StatCard({ icon, label, value, staggerMs = 0, className, ...rest }: StatCardProps) {
  const isNumeric = typeof value === 'number'
  const animated = useCountUp(isNumeric ? value : 0, 800, staggerMs)

  const classes = ['un-stat-card', className ?? ''].filter(Boolean).join(' ')
  return (
    <Card
      variant="elevated"
      className={classes}
      style={{ '--un-stagger': `${staggerMs}ms` } as React.CSSProperties}
      {...rest}
    >
      {icon && <div className="un-stat-card__icon">{icon}</div>}
      <span className="un-stat-card__value">{isNumeric ? animated : value}</span>
      <span className="un-stat-card__label">{label}</span>
    </Card>
  )
}

