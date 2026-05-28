import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
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
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  function handleSubmit(e: FormEvent) {
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
    if (Object.keys(next).length === 0) {
      navigate('/signin')
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

      <form onSubmit={handleSubmit} noValidate>
        <div className={`field ${errors.fullName ? 'has-error' : ''}`}>
          <label htmlFor="fullName">Full Name</label>
          <div className="control">
            <svg aria-hidden="true">
              <use href="/icons.svg#user-icon" />
            </svg>
            <input
              id="fullName"
              type="text"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        <div className={`field ${errors.email ? 'has-error' : ''}`} style={{ marginTop: 16 }}>
          <label htmlFor="email">Email Address</label>
          <div className="control">
            <svg aria-hidden="true">
              <use href="/icons.svg#mail-icon" />
            </svg>
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className={`field ${errors.password ? 'has-error' : ''}`} style={{ marginTop: 16 }}>
          <label htmlFor="password">Password</label>
          <div className="control">
            <svg aria-hidden="true">
              <use href="/icons.svg#lock-icon" />
            </svg>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {errors.password ? (
            <span className="error">{errors.password}</span>
          ) : (
            <span className="helper">Must be at least 8 characters long.</span>
          )}
        </div>

        <div
          className={`field ${errors.confirmPassword ? 'has-error' : ''}`}
          style={{ marginTop: 16 }}
        >
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="control">
            <svg aria-hidden="true">
              <use href="/icons.svg#lock-icon" />
            </svg>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        <label className="terms" style={{ marginTop: 24 }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            {errors.agreed && <span className="error">{errors.agreed}</span>}
          </span>
        </label>

        <button type="submit" className="submit" style={{ marginTop: 24 }}>
          Sign Up <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="auth-footer">
        Already have an account?
        <Link to="/signin">Sign In</Link>
      </p>
    </AuthLayout>
  )
}
