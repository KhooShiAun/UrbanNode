import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiSend } from '@/lib/api'
import { AuthLayout } from '../components/AuthLayout'
import { Button, Input, useToast } from '@/components/ui'
import './auth.css'

export function SignIn() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const data = await apiSend<{ role: string }>('/api/auth/signin', 'POST', { email, password })
      navigate(data.role === 'worker' ? '/worker/dashboard' : '/home')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to sign in. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      tagline="Welcome back."
      description="Sign in to continue tracking maintenance in your community."
    >
      <div>
        <h1 className="auth-heading">Sign In</h1>
        <p className="auth-subhead">Enter your credentials to continue.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          iconLeft={
            <svg aria-hidden="true">
              <use href="/icons.svg#mail-icon" />
            </svg>
          }
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          iconLeft={
            <svg aria-hidden="true">
              <use href="/icons.svg#lock-icon" />
            </svg>
          }
        />

        <Button type="submit" size="lg" fullWidth loading={submitting}>
          Sign In
        </Button>
      </form>

      <p className="auth-footer">
        Don't have an account?
        <Link to="/signup">Sign Up</Link>
      </p>
    </AuthLayout>
  )
}
