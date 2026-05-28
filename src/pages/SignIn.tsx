import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import './auth.css'

export function SignIn() {
  return (
    <AuthLayout
      tagline="Welcome back."
      description="Sign in to continue tracking maintenance in your community."
    >
      <div>
        <h1 className="auth-heading">Sign In</h1>
        <p className="auth-subhead">This page is a placeholder. Sign-in is coming soon.</p>
      </div>
      <p className="auth-footer">
        Need an account?
        <Link to="/signup">Sign Up</Link>
      </p>
    </AuthLayout>
  )
}
