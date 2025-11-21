'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTickets } from '@/lib/actions/tickets'
import { getAssets } from '@/lib/actions/assets'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { StatsSkeleton } from '@/components/ui/loading-skeletons'
import { notifications } from '@/lib/notifications'

import { Ticket, Asset } from '@/lib/types'

interface DashboardStatsData {
  totalTickets: number
  openTickets: number
  totalAssets: number
  assignedAssets: number
}

export function DashboardStats() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const dashboardStrings = getStrings().dashboard
  const [stats, setStats] = useState<DashboardStatsData>({
    totalTickets: 0,
    openTickets: 0,
    totalAssets: 0,
    assignedAssets: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const loadStats = useCallback(async () => {
    if (!user) return
    
    try {
      const [tickets, assets] = await Promise.all([
        getTickets(user.id, user.role),
        getAssets(),
      ])

      const openTickets = tickets.filter((ticket: Ticket) => ticket.status === 'OPEN').length
      const assignedAssets = assets.filter((asset: Asset) => asset.status === 'ASSIGNED').length

      setStats({
        totalTickets: tickets.length,
        openTickets,
        totalAssets: assets.length,
        assignedAssets,
      })
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
      notifications.error(dashboardStrings.statsLoadError, dashboardStrings.statsLoadErrorDescription)
    } finally {
      setIsLoading(false)
    }
  }, [user, dashboardStrings.statsLoadError, dashboardStrings.statsLoadErrorDescription])

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user, loadStats])

  if (isLoading) {
    return <StatsSkeleton count={4} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dashboardStrings.totalTickets}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTickets}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalTickets === 0 ? dashboardStrings.noTicketsYet : `${stats.openTickets} open tickets`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dashboardStrings.openTickets}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.openTickets}</div>
          <p className="text-xs text-muted-foreground">
            {stats.openTickets === 0 ? dashboardStrings.noOpenTickets : dashboardStrings.requiresAttention}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dashboardStrings.totalAssets}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAssets}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalAssets === 0 ? dashboardStrings.noAssetsYet : dashboardStrings.hardwareAndSoftware}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dashboardStrings.assignedAssets}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.assignedAssets}</div>
          <p className="text-xs text-muted-foreground">
            {stats.assignedAssets === 0 ? dashboardStrings.noAssignedAssets : dashboardStrings.currentlyInUse}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
