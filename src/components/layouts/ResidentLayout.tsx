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
  { to: '/community', label: 'Community Bear', icon: <Users /> },
  { to: '/notifications', label: 'Notifications', icon: <Bell /> },
]

const FOOTER_ITEMS: NavItem[] = [
  { to: '/profile', label: 'My Profile', icon: <Person /> },
  { to: '/help', label: 'Help & FAQ', icon: <HelpCircle /> },
  { to: '/signin', label: 'Sign Out', icon: <LogOut /> },
]

const CTA: CtaItem = {
  to: '/reports/new',
  label: 'Report Issue',
  icon: <Plus size={18} />,
}

export function ResidentLayout() {
  return (
    <SidebarLayout
      navItems={NAV_ITEMS}
      footerItems={FOOTER_ITEMS}
      cta={CTA}
      variantClass="un-shell--resident"
    />
  )
}
