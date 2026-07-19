import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiGet, apiSend } from '@/lib/api'
import { Avatar, Input } from '@/components/ui'
import { SidebarLayout, type NavItem } from './SidebarLayout'
import {
  Bell,
  Clipboard,
  Columns,
  Folder,
  Grid,
  LogOut,
  Person,
  Search,
} from '../icons'

const NAV_ITEMS: NavItem[] = [
  { to: '/worker/dashboard', label: 'Dashboard', icon: <Grid /> },
  { to: '/worker/kanban', label: 'Kanban Board', icon: <Columns /> },
  { to: '/worker/all-reports', label: 'All Reports', icon: <Clipboard /> },
  { to: '/worker/uncategorised', label: 'Uncategorised', icon: <Folder /> },
  { to: '/worker/notifications', label: 'Notifications', icon: <Bell /> },
]

function WorkerTopBar({ userName, title }: { userName: string; title: string }) {
  return (
    <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0, whiteSpace: 'nowrap' }}>
        {title}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'flex-end' }}>
        <div className="un-worker-search" style={{ flex: 1, maxWidth: '420px' }}>
          <Input
            aria-label="Search"
            placeholder="Search tickets, assets, or locations..."
            iconLeft={<Search />}
          />
        </div>
        <Avatar name={userName} size="sm" />
      </div>
    </div>
  )
}

export function WorkerLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userName, setUserName] = useState<string>('Ahmad bin Ali')

  useEffect(() => {
    let active = true
    apiGet<{ full_name?: string }>('/api/auth/me')
      .then((data) => {
        if (active && data?.full_name) {
          setUserName(data.full_name)
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const handleSignOut = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    try {
      await apiSend('/api/auth/signout', 'POST')
    } catch (err) {
      console.error('Sign out failed:', err)
    }
    navigate('/signin')
  }

  const footerItems: NavItem[] = [
    { to: '/worker/profile', label: 'My Profile', icon: <Person /> },
    { to: '/signin', label: 'Sign Out', icon: <LogOut />, onClick: handleSignOut },
  ]

  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith('/worker/dashboard')) return 'Dashboard'
    if (pathname.startsWith('/worker/kanban')) return 'Kanban Board'
    if (pathname.startsWith('/worker/all-reports')) return 'All Reports'
    if (pathname.startsWith('/worker/uncategorised')) return 'Uncategorised'
    if (pathname.startsWith('/worker/notifications')) return 'Notifications'
    if (pathname.startsWith('/worker/profile')) return 'My Profile'
    if (pathname.startsWith('/worker/tickets/')) return 'Ticket Details'
    return ''
  }

  const title = getPageTitle(location.pathname)

  return (
    <SidebarLayout
      navItems={NAV_ITEMS}
      footerItems={footerItems}
      topBar={<WorkerTopBar userName={userName} title={title} />}
      variantClass="un-shell--worker"
    />
  )
}

