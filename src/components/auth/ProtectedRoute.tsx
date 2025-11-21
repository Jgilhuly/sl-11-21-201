'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'END_USER' | 'ADMIN'
  fallback?: ReactNode
}

export function ProtectedRoute({ children, requiredRole, fallback }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const authStrings = strings.auth
  const commonStrings = strings.common

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{commonStrings.loading}</div>
      </div>
    )
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{authStrings.loginRequired}</div>
      </div>
    )
  }

  if (requiredRole && user.role !== requiredRole) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{authStrings.accessDenied}</div>
      </div>
    )
  }

  return <>{children}</>
}
