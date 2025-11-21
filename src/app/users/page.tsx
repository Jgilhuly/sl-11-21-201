'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { UserList } from '@/components/users/UserList'
import { CreateUserButton } from '@/components/users/CreateUserButton'
import { useLocalizedStrings } from '@/contexts/LocaleContext'


export default function UsersPage() {
  const { getStrings } = useLocalizedStrings()
  const usersStrings = getStrings().users
  
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{usersStrings.title}</h1>
              <p className="text-gray-600 mt-2">
                {usersStrings.subtitle}
              </p>
            </div>
            <CreateUserButton />
          </div>
          
          <UserList />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
