'use client'

import { useCallback, useEffect, useState } from 'react'
import { getTickets } from '@/lib/actions/tickets'
import { getAssets } from '@/lib/actions/assets'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { TicketStatusChart } from './charts/TicketStatusChart'
import { TicketPriorityChart } from './charts/TicketPriorityChart'
import { AssetStatusChart } from './charts/AssetStatusChart'
import { AssetTypeChart } from './charts/AssetTypeChart'
import { TicketsOverTimeChart } from './charts/TicketsOverTimeChart'
import { AssetsOverTimeChart } from './charts/AssetsOverTimeChart'
import { Ticket, Asset } from '@/lib/types'
import { notifications } from '@/lib/notifications'

export function DashboardCharts() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const dashboardStrings = getStrings().dashboard
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!user) return

    try {
      const [ticketsData, assetsData] = await Promise.all([
        getTickets(user.id, user.role),
        getAssets(),
      ])

      setTickets(ticketsData)
      setAssets(assetsData)
    } catch (error) {
      console.error('Failed to load chart data:', error)
      notifications.error(
        dashboardStrings.statsLoadError,
        dashboardStrings.statsLoadErrorDescription
      )
    } finally {
      setIsLoading(false)
    }
  }, [user, dashboardStrings.statsLoadError, dashboardStrings.statsLoadErrorDescription])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, loadData])

  if (isLoading) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{dashboardStrings.charts.title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TicketStatusChart tickets={tickets} />
        <TicketPriorityChart tickets={tickets} />
        <AssetStatusChart assets={assets} />
        <AssetTypeChart assets={assets} />
        <TicketsOverTimeChart tickets={tickets} />
        <AssetsOverTimeChart assets={assets} />
      </div>
    </div>
  )
}

