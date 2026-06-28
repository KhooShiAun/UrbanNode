import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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

  return (
    <SidebarLayout
      navItems={NAV_ITEMS}
      footerItems={footerItems}
      topBar={<WorkerTopBar userName={userName} />}
      variantClass="un-shell--worker"
    />
  )
}

