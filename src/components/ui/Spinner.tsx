import './Spinner.css'

type SpinnerSize = 'sm' | 'md' | 'lg'

export type SpinnerProps = {
  size?: SpinnerSize
  fullPage?: boolean
  className?: string
}

export function Spinner({ size = 'md', fullPage = false, className }: SpinnerProps) {
  const classes = [
    'un-spinner',
    `un-spinner--${size}`,
    fullPage ? 'un-spinner--full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role="status" aria-live="polite">
      <span className="un-spinner__circle" aria-hidden="true" />
      <span className="un-spinner__label">Loading…</span>
    </div>
  )
}
