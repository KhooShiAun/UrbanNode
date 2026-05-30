import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { Button, Input, useToast } from '@/components/ui'
import './auth.css'

type Errors = {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreed?: string
}

export function SignUp() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (!fullName.trim()) next.fullName = 'Please enter your name.'
    if (!email.trim()) next.email = 'Please enter your email.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Please enter a password.'
    else if (password.length < 8) next.password = 'Must be at least 8 characters long.'
    if (!confirmPassword) next.confirmPassword = 'Please confirm your password.'
    else if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match.'
    if (!agreed) next.agreed = 'You must agree to the Terms of Service and Privacy Policy.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        // Public sign-up creates resident accounts; workers are provisioned by the city.
        body: JSON.stringify({ full_name: fullName, email, password, role: 'resident' }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (res.status === 409) {
          setErrors({ email: data.error ?? 'That email is already registered.' })
        } else {
          showToast(data.error ?? 'Unable to create account. Please try again.', 'error')
        }
        return
      }

      showToast('Account created! Welcome to UrbanNode.', 'success')
      navigate(data.role === 'worker' ? '/worker/dashboard' : '/home')
    } catch {
      showToast('Network error. Please check your connection and try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      tagline="Report it. Track it. Fix it."
      description="Join your community in making our city greener, safer, and more connected. Your reports drive real change."
    >
      <div>
        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-subhead">Join UrbanNode to start tracking maintenance in your area.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <Input
          id="fullName"
          label="Full Name"
          type="text"
          placeholder="Jane Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          error={errors.fullName}
          iconLeft={
            <svg aria-hidden="true">
              <use href="/icons.svg#user-icon" />
            </svg>
          }
        />

        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          error={errors.email}
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
          autoComplete="new-password"
          error={errors.password}
          helperText="Must be at least 8 characters long."
          iconLeft={
            <svg aria-hidden="true">
              <use href="/icons.svg#lock-icon" />
            </svg>
          }
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          error={errors.confirmPassword}
          iconLeft={
            <svg aria-hidden="true">
              <use href="/icons.svg#lock-icon" />
            </svg>
          }
        />

        <label className="terms">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            {errors.agreed && <span className="terms__error">{errors.agreed}</span>}
          </span>
        </label>

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={submitting}
          iconRight={<span aria-hidden="true">→</span>}
        >
          Sign Up
        </Button>
      </form>

      <p className="auth-footer">
        Already have an account?
        <Link to="/signin">Sign In</Link>
      </p>
    </AuthLayout>
  )
}
