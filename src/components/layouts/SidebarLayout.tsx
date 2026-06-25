import { useState, type ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { IconButton } from '@/components/ui'
import { Logo } from '../Logo'
import { Menu, X } from '../icons'
import './SidebarLayout.css'

export type NavItem = {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export type CtaItem = {
  to: string
  label: string
  icon: ReactNode
}

type SidebarLayoutProps = {
  navItems: NavItem[]
  footerItems: NavItem[]
  cta?: CtaItem
  topBar?: ReactNode
  variantClass?: string
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return ['un-shell__nav-link', isActive ? 'un-shell__nav-link--active' : '']
    .filter(Boolean)
    .join(' ')
}

export function SidebarLayout({
  navItems,
  footerItems,
  cta,
  topBar,
  variantClass,
}: SidebarLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = () => setDrawerOpen(false)

  const rootClass = ['un-shell', variantClass ?? '', drawerOpen ? 'un-shell--drawer-open' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClass}>
      <aside className="un-shell__sidebar" aria-label="Primary">
        <div className="un-shell__brand">
          <Logo />
        </div>

        {cta && (
          <NavLink to={cta.to} className="un-shell__cta" onClick={closeDrawer}>
            <span className="un-shell__cta-icon">{cta.icon}</span>
            <span>{cta.label}</span>
          </NavLink>
        )}

        <nav className="un-shell__nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
              onClick={(e) => {
                closeDrawer()
                if (item.onClick) {
                  item.onClick(e)
                }
              }}
            >
              <span className="un-shell__nav-icon">{item.icon}</span>
              <span className="un-shell__nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="un-shell__divider" />

        <nav className="un-shell__nav un-shell__nav--footer" aria-label="Account">
          {footerItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
              onClick={(e) => {
                closeDrawer()
                if (item.onClick) {
                  item.onClick(e)
                }
              }}
            >
              <span className="un-shell__nav-icon">{item.icon}</span>
              <span className="un-shell__nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {drawerOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="un-shell__overlay"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div className="un-shell__content">
        <header className="un-shell__topbar">
          <IconButton
            aria-label={drawerOpen ? 'Close navigation' : 'Open navigation'}
            variant="ghost"
            onClick={() => setDrawerOpen((open) => !open)}
            className="un-shell__menu-toggle"
          >
            {drawerOpen ? <X /> : <Menu />}
          </IconButton>
          <div className="un-shell__topbar-content">{topBar}</div>
        </header>

        <main className="un-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
