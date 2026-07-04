type LogoProps = {
  variant?: 'light' | 'dark'
}

export function Logo({ variant = 'dark' }: LogoProps) {
  const isLight = variant === 'light'
  const wordmarkColor = isLight ? '#ffffff' : '#145c3d'
  
  const circleBg = isLight ? '#ffffff' : '#145c3d'
  const letterColor = isLight ? '#145c3d' : '#ffffff'

  const size = isLight ? '48px' : '36px'
  const fontSize = isLight ? '24px' : '18px'

  return (
    <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span
        className="logo-mark"
        aria-hidden="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          width: size,
          height: size,
          backgroundColor: circleBg,
          color: letterColor,
          fontWeight: 700,
          fontSize: fontSize,
          lineHeight: 1,
          fontFamily: 'var(--font-sans)',
          transition: 'all 0.15s ease',
          flexShrink: 0,
        }}
      >
        U
      </span>
      <span
        className="logo-word"
        style={{
          color: wordmarkColor,
          fontWeight: 700,
          fontFamily: 'var(--font-sans)',
        }}
      >
        UrbanNode
      </span>
    </div>
  )
}
