import { useNavigate } from 'react-router-dom'
import { apiSend } from '@/lib/api'
import { SidebarLayout, type CtaItem, type NavItem } from './SidebarLayout'
import {
  Bell,
  Clipboard,
  HelpCircle,
  Home,
  LogOut,
  Person,
  Plus,
  Users,
} from '../icons'

const NAV_ITEMS: NavItem[] = [
  { to: '/home', label: 'Home', icon: <Home /> },
  { to: '/reports', label: 'My Reports', icon: <Clipboard /> },
  { to: '/community', label: 'Community Board', icon: <Users /> },
  { to: '/notifications', label: 'Notifications', icon: <Bell /> },
]

const CTA: CtaItem = {
  to: '/reports/new',
  label: 'Report Issue',
  icon: <Plus size={18} />,
}

export function ResidentLayout() {
  const navigate = useNavigate()

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
    { to: '/profile', label: 'My Profile', icon: <Person /> },
    { to: '/help', label: 'Help & FAQ', icon: <HelpCircle /> },
    { to: '/signin', label: 'Sign Out', icon: <LogOut />, onClick: handleSignOut },
  ]

  return (
    <SidebarLayout
      navItems={NAV_ITEMS}
      footerItems={footerItems}
      cta={CTA}
      topBar={
        <button className="profile-btn" aria-label="Profile" onClick={() => navigate('/profile')}>
          <Person size={20} />
        </button>
      }
      variantClass="un-shell--resident"
    />
  )
}

