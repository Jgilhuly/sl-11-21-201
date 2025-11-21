'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getUsers, updateUserRole } from '@/lib/actions/users'
import { formatDistanceToNow } from 'date-fns'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  _count: {
    tickets: number
    assets: number
  }
}

export function UserList() {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const usersStrings = strings.users
  const commonStrings = strings.common
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const userData = await getUsers()
      setUsers(userData)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole as 'END_USER' | 'ADMIN')
      await loadUsers()
    } catch (error) {
      console.error('Failed to update user role:', error)
    }
  }

  const getRoleColor = (role: string) => {
    return role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">{usersStrings.loadingUsers}</div>
        </CardContent>
      </Card>
    )
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            {usersStrings.noUsersFoundMessage}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <CardDescription className="text-sm">
                  {user.email}
                </CardDescription>
              </div>
              <Badge className={getRoleColor(user.role)}>
                {user.role === 'ADMIN' ? commonStrings.admin : commonStrings.endUser}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">{usersStrings.createdPrefix}</span> {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </div>
              <div>
                <span className="font-medium">{usersStrings.ticketsPrefix}</span> {user._count.tickets}
              </div>
              <div>
                <span className="font-medium">{usersStrings.assetsPrefix}</span> {user._count.assets}
              </div>
              <div>
                <label className="text-sm font-medium">{usersStrings.roleLabel}</label>
                <Select 
                  value={user.role} 
                  onValueChange={(value) => handleRoleChange(user.id, value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="END_USER">{commonStrings.endUser}</SelectItem>
                    <SelectItem value="ADMIN">{commonStrings.admin}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
