import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { apiGet } from '@/lib/api'
import { Spinner } from '@/components/ui'

type AuthState = 'loading' | 'authed' | 'denied'

type ProtectedRouteProps = {
  requiredRole?: 'resident' | 'worker'
  children: ReactNode
}

export function ProtectedRoute({ requiredRole, children }: ProtectedRouteProps) {


const [state, setState] = useState<AuthState>('loading')

  useEffect(() => {
    let active = true

    async function check() {
      try {
        const user = await apiGet<{ role?: string }>('/api/auth/me')
        if (!active) return
        if (requiredRole && user.role !== requiredRole) {
          setState('denied')
        } else {
          setState('authed')
        }
      } catch {
        if (active) setState('denied')
      }
    }

    check()
    return () => {
      active = false
    }
  }, [requiredRole])
  


  if (state === 'loading') {
    return <Spinner fullPage />
  }

  if (state === 'denied') {
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}

