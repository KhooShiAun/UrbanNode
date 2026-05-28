import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { Button, Input } from '@/components/ui'
import './auth.css'

type Role = 'resident' | 'worker'

export function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(role: Role) {
    return (e: FormEvent) => {
      e.preventDefault()
      navigate(role === 'resident' ? '/home' : '/worker/dashboard')
    }
  }

  return (
    <AuthLayout
      tagline="Welcome back."
      description="Sign in to continue tracking maintenance in your community."
    >
      <div>
        <h1 className="auth-heading">Sign In</h1>
        <p className="auth-subhead">
          Authentication isn't wired up yet — pick a role below to preview the layout.
        </p>
      </div>

      <form onSubmit={handleSubmit('resident')} noValidate className="auth-form">
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

        <Button type="submit" size="lg" fullWidth>
          Sign in as City Resident
        </Button>

        <Button
          type="button"
          size="lg"
          variant="secondary"
          fullWidth
          onClick={handleSubmit('worker')}
        >
          Sign in as City Worker
        </Button>
      </form>

      <p className="auth-footer">
        Don't have an account?
        <Link to="/signup">Sign Up</Link>
      </p>
    </AuthLayout>
  )
}
