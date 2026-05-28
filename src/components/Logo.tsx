type LogoProps = {
  variant?: 'light' | 'dark'
}

export function Logo({ variant = 'dark' }: LogoProps) {
  const wordmarkColor = variant === 'light' ? '#ffffff' : 'var(--color-on-surface)'

  return (
    <div className="logo">
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path
            fill="var(--color-primary)"
            d="M12 2.5c-3.6 0-6.5 2.9-6.5 6.5 0 4.6 5.6 11.4 6 11.9.3.3.7.3 1 0 .4-.5 6-7.3 6-11.9 0-3.6-2.9-6.5-6.5-6.5Z"
          />
          <path
            fill="#ffffff"
            d="M12 6.5c-1 1.4-1.6 2.7-1.6 4 0 1.4.7 2.3 1.6 2.3.9 0 1.6-.9 1.6-2.3 0-1.3-.6-2.6-1.6-4Z"
          />
        </svg>
      </span>
      <span className="logo-word" style={{ color: wordmarkColor }}>
        UrbanNode
      </span>
    </div>
  )
}
