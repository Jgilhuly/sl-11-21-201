'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  HomeIcon, 
  TicketIcon, 
  ComputerIcon, 
  UsersIcon, 
  SettingsIcon 
} from 'lucide-react'


interface NavigationStrings {
  dashboard: string;
  tickets: string;
  assets: string;
  users: string;
  settings: string;
}

function getNavigationItems(navigationStrings: NavigationStrings, getLocalizedPath: (path: string) => string) {
  return [
    { name: navigationStrings.dashboard, href: getLocalizedPath('/dashboard'), icon: HomeIcon },
    { name: navigationStrings.tickets, href: getLocalizedPath('/tickets'), icon: TicketIcon },
    { name: navigationStrings.assets, href: getLocalizedPath('/assets'), icon: ComputerIcon },
    { name: navigationStrings.users, href: getLocalizedPath('/users'), icon: UsersIcon, adminOnly: true },
    { name: navigationStrings.settings, href: getLocalizedPath('/settings'), icon: SettingsIcon, adminOnly: true },
  ]
}

export function Sidebar() {
  const { user } = useAuth()
  const { getLocalizedPath, getStrings } = useLocalizedStrings()
  const pathname = usePathname()

  if (!user) return null

  const strings = getStrings()
  const navigation = getNavigationItems(strings.navigation, getLocalizedPath)
  const filteredNavigation = navigation.filter(item => 
    !item.adminOnly || user.role === 'ADMIN'
  )

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-gray-200 text-gray-900'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
