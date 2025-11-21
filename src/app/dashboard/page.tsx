'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentTickets } from '@/components/dashboard/RecentTickets'
import { useLocalizedStrings } from '@/contexts/LocaleContext'


export default function DashboardPage() {
  const { getStrings } = useLocalizedStrings()
  const dashboardStrings = getStrings().dashboard
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{dashboardStrings.title}</h1>
            <p className="text-gray-600 mt-2">
              {dashboardStrings.subtitle}
            </p>
          </div>

          <DashboardStats />
          <QuickActions />
          <RecentTickets />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
