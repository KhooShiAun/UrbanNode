import type { HTMLAttributes } from 'react'
import './ReportProgress.css'

export type ReportStatus = 'submitted' | 'in-progress' | 'resolved'

export type ReportProgressProps = HTMLAttributes<HTMLDivElement> & {
  /** The current status of the report */
  status: ReportStatus
}

const STEPS = [
  { id: 'submitted', label: 'Submitted' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' },
]

export function ReportProgress({ status, className, ...rest }: ReportProgressProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === status)
  
  // Calculate the width of the connecting line fill
  // 0% if step 1 (index 0)
  // 50% if step 2 (index 1)
  // 100% if step 3 (index 2)
  const fillWidth = currentIndex > 0 ? `${(currentIndex / (STEPS.length - 1)) * 100}%` : '0%'

  const classes = ['un-report-progress', className ?? ''].filter(Boolean).join(' ')

  return (
    <div className={classes} {...rest}>
      <div className="un-report-progress__track">
        <div className="un-report-progress__line-bg" />
        <div className="un-report-progress__line-fill" style={{ width: fillWidth }} />

        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex || (status === 'resolved' && index === currentIndex)
          const isActive = index === currentIndex && status !== 'resolved'
          
          let stepClass = 'un-report-progress__step'
          if (isCompleted) stepClass += ' un-report-progress__step--completed'
          else if (isActive) stepClass += ' un-report-progress__step--active'

          return (
            <div key={step.id} className={stepClass}>
              <div className="un-report-progress__node">
                {isCompleted ? '✓' : (index + 1)}
              </div>
              <span className="un-report-progress__label">{step.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
