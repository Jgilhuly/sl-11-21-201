'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { TicketList } from '@/components/tickets/TicketList'
import { CreateTicketButton } from '@/components/tickets/CreateTicketButton'
import { useLocalizedStrings } from '@/contexts/LocaleContext'


export default function TicketsPage() {
  const { getStrings } = useLocalizedStrings()
  const ticketsStrings = getStrings().tickets
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{ticketsStrings.title}</h1>
              <p className="text-gray-600 mt-2">
                {ticketsStrings.subtitle}
              </p>
            </div>
            <CreateTicketButton />
          </div>
          
          <TicketList />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
