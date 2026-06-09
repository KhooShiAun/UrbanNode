import type { HTMLAttributes, ReactNode } from 'react'
import './ProgressBar.css'

export type ProgressBarProps = HTMLAttributes<HTMLDivElement> & {
  /** Current progress value */
  value: number
  /** Maximum progress value */
  max: number
  /** Optional caption rendered below the bar, e.g. "3 more resolved to unlock Silver" */
  caption?: ReactNode
  /** Optional indicator node (e.g. emoji) rendered at the fill edge */
  indicator?: ReactNode
}

export function ProgressBar({ value, max, caption, indicator, className, ...rest }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, max))
  const percent = max > 0 ? (clamped / max) * 100 : 0

  const classes = [
    'un-progress',
    indicator ? 'un-progress--has-indicator' : '',
    className ?? '',
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} {...rest}>
      <div
        className="un-progress__track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div className="un-progress__fill" style={{ width: `${percent}%` }} />
        {indicator && (
          <span
            className="un-progress__indicator"
            style={{ '--un-progress-pct': `${percent}%` } as React.CSSProperties}
          >
            {indicator}
          </span>
        )}
      </div>
      {caption && <p className="un-progress__caption">{caption}</p>}
    </div>
  )
}

