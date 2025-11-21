export interface User {
  id: string
  name: string
  email: string
  role: 'END_USER' | 'ADMIN'
}

export const USERS: User[] = [
  {
    id: '1',
    name: 'End User',
    email: 'user@company.com',
    role: 'END_USER'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'ADMIN'
  }
]

export const CREDENTIALS = {
  'user@company.com': 'password123',
  'admin@company.com': 'admin123'
}

export function authenticateUser(email: string, password: string): User | null {
  const storedPassword = CREDENTIALS[email as keyof typeof CREDENTIALS]
  if (storedPassword && storedPassword === password) {
    return USERS.find(user => user.email === email) || null
  }
  return null
}

export function getUserById(id: string): User | null {
  return USERS.find(user => user.id === id) || null
}

export function getUserByEmail(email: string): User | null {
  return USERS.find(user => user.email === email) || null
}
