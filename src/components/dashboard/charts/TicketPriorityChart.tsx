'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Ticket } from '@/lib/types'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

interface TicketPriorityChartProps {
  tickets: Ticket[]
}

export function TicketPriorityChart({ tickets }: TicketPriorityChartProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const dashboardStrings = strings.dashboard
  const ticketStrings = strings.tickets

  const priorityCounts = tickets.reduce((acc, ticket) => {
    const priority = ticket.priority
    acc[priority] = (acc[priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const data = [
    { priority: ticketStrings.lowPriority, count: priorityCounts.LOW || 0 },
    { priority: ticketStrings.mediumPriority, count: priorityCounts.MEDIUM || 0 },
    { priority: ticketStrings.highPriority, count: priorityCounts.HIGH || 0 },
    { priority: ticketStrings.criticalPriority, count: priorityCounts.CRITICAL || 0 },
  ]

  if (data.every(item => item.count === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{dashboardStrings.charts.ticketPriorityDistribution}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            {dashboardStrings.charts.noData}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dashboardStrings.charts.ticketPriorityDistribution}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="priority" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name={dashboardStrings.charts.count} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

