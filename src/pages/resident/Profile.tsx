import { useEffect, useState } from 'react'
import { apiGet, apiSend } from '@/lib/api'
import { Avatar, Badge, Card, Input, Button } from '@/components/ui'
import { Check, Clock, Clipboard } from '@/components/icons'
import './Profile.css'

export function Profile() {

  const [user, setUser] = useState<{ full_name: string; email: string; role: string; created_at: string } | null>(null)
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    apiGet<{ full_name: string; email: string; role: string; created_at: string }>('/api/auth/me')
      .then(data => {
        setUser(data)
        setFullName(data.full_name)
        setRole(data.role)
        setEmail(data.email)
      })
      .catch(() => {})
  }, [])

  async function handleSave() {
    try {
      await apiSend('/api/me', 'PUT', { full_name: fullName, email: email })
      setUser(prev => prev ? { ...prev, full_name: fullName, email: email } : prev)
      alert('Profile saved successfully!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Profile save failed.')
    }
  }
  return (
    <div className="profile">
      <h1 className="profile__title">My Profile</h1>

      <Card variant="bordered" className="profile-header">
        <Avatar name={user?.full_name ?? '...'} size="lg" />
        <div className="profile-header__info">
          <h2 className="profile-header__name">{user?.full_name ?? '...'}</h2>
          <p className="profile-header__role">{user?.role ?? '...'}</p>
          <p className="profile-header__email">{user?.email ?? '...'}</p>
          <Badge variant="success">Member since January 2024</Badge>
        </div>
      </Card>

      <div className="profile-stats">
        <Card variant="bordered" className="profile-stats__card">
          <Check size={24} />
          <span className="profile-stats__number">47</span>
          <span className="profile-stats__label">Tickets Resolved</span>
        </Card>
        <Card variant="bordered" className="profile-stats__card">
          <Clock size={24} />
          <span className="profile-stats__number">9.5 hours</span>
          <span className="profile-stats__label">Avg Resolution Time</span>
        </Card>
        <Card variant="bordered" className="profile-stats__card">
          <Clipboard size={24} />
          <span className="profile-stats__number">3</span>
          <span className="profile-stats__label">Currently Assigned</span>
        </Card>
      </div>

      <Card variant="bordered" className="profile-form">
        <h2 className="profile-form__title">Profile Information</h2>
        <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
        <Input label="Role / Position" value={role} onChange={e => setRole(e.target.value)} />
        <Input label="Department" value="Public Works Department" />
        <Input label="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
        <Button fullWidth onClick={handleSave}>Save Changes</Button>
      </Card>

    </div>
  )
}