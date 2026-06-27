import { useEffect, useState } from 'react'
import { Avatar, Card, Input, Button, useToast } from '@/components/ui'
import './Profile.css'

export function Profile() {

  const [user, setUser] = useState<{ id: number; full_name: string; email: string; role: string; created_at: string } | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [neighbourhood, setNeighbourhood] = useState('')

  const toast = useToast()

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load profile')
        return res.json()
      })
      .then((data: { id: number; full_name: string; email: string; role: string; created_at: string }) => {
        setUser(data)
        setFullName(data.full_name)
        setEmail(data.email)
      })
      .catch(err => console.error(err))
  }, [])

  async function handleSave() {
    const res = await fetch('/api/me', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email: email })
    })

    if (!res.ok) {
      toast.showToast('Failed to save profile. Please try again.', 'error')
      return
    }

    setUser(prev => prev ? { ...prev, full_name: fullName, email: email } : prev)
    toast.showToast('Profile saved successfully!', 'success')
  }

  return (
    <div className="profile">
      <h1 className="profile__title">My Profile</h1>

      <Card variant="bordered" className="profile-header">
        <Avatar name={user?.full_name ?? '...'} size="lg" />
        <div className="profile-header__info">
          <h2 className="profile-header__name">{user?.full_name ?? '...'}</h2>
          <p className="profile-header__email">{user?.email ?? '...'}</p>
          <p className="profile-header__since">
            Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '...'}
          </p>
        </div>
      </Card>

      <Card variant="bordered" className="profile-form">
        <h2 className="profile-form__title">Profile Information</h2>
        <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
        <Input label="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
        <Input label="Phone Number (Optional)" value={phone} onChange={e => setPhone(e.target.value)} />
        <Input label="Neighbourhood / Area" value={neighbourhood} onChange={e => setNeighbourhood(e.target.value)} />
        <Button fullWidth onClick={handleSave}>Save Changes</Button>
      </Card>

    </div>
  )
}