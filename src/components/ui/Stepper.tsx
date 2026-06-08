import { Fragment } from 'react'
import { Check } from '../icons'
import './Stepper.css'

export type StepperStep = {
  title: string
  caption?: string
}

export type StepperProps = {
  steps: StepperStep[]
  current: number
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="un-stepper" aria-label="Progress">
      {steps.map((step, index) => {
        const isCompleted = index < current
        const isActive = index === current
        const state = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming'

        return (
          <Fragment key={step.title}>
            {index > 0 && (
              <li
                aria-hidden="true"
                className={[
                  'un-stepper__line',
                  index <= current ? 'un-stepper__line--filled' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            )}
            <li
              className={`un-stepper__step un-stepper__step--${state}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="un-stepper__marker">
                {isCompleted ? <Check size={18} /> : index + 1}
              </span>
              <span className="un-stepper__text">
                <span className="un-stepper__title">{step.title}</span>
                {step.caption && (
                  <span className="un-stepper__caption">{step.caption}</span>
                )}
              </span>
            </li>
          </Fragment>
        )
      })}
    </ol>
  )
}
