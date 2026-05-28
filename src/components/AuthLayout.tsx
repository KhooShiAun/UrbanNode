import type { ReactNode } from 'react'
import { Logo } from './Logo'

type AuthLayoutProps = {
  tagline: string
  description: string
  children: ReactNode
}

export function AuthLayout({ tagline, description, children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <aside className="auth-brand">
        <Logo variant="light" />
        <div className="auth-brand-copy">
          <h2 className="auth-tagline">{tagline}</h2>
          <p className="auth-description">{description}</p>
        </div>
      </aside>
      <main className="auth-content">
        <div className="auth-content-inner">{children}</div>
      </main>
    </div>
  )
}
