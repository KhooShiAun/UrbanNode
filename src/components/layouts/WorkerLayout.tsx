import { useEffect, useState } from 'react'
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

const FOOTER_ITEMS: NavItem[] = [
  { to: '/worker/profile', label: 'My Profile', icon: <Person /> },
  { to: '/signin', label: 'Sign Out', icon: <LogOut /> },
]

function WorkerTopBar({ userName }: { userName: string }) {
  return (
    <>
      <div className="un-worker-search">
        <Input
          aria-label="Search"
          placeholder="Search tickets, assets, or locations..."
          iconLeft={<Search />}
        />
      </div>
      <Avatar name={userName} size="sm" />
    </>
  )
}

export function WorkerLayout() {
  const [userName, setUserName] = useState<string>('Ahmad bin Ali')

  useEffect(() => {
    let active = true
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
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

  return (
    <SidebarLayout
      navItems={NAV_ITEMS}
      footerItems={FOOTER_ITEMS}
      topBar={<WorkerTopBar userName={userName} />}
      variantClass="un-shell--worker"
    />
  )
}
