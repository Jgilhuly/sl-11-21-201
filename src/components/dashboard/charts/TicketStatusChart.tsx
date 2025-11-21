'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Ticket } from '@/lib/types'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

interface TicketStatusChartProps {
  tickets: Ticket[]
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#6b7280']

export function TicketStatusChart({ tickets }: TicketStatusChartProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const dashboardStrings = strings.dashboard
  const ticketStrings = strings.tickets

  const statusCounts = tickets.reduce((acc, ticket) => {
    const status = ticket.status
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const data = [
    { name: ticketStrings.openStatus, value: statusCounts.OPEN || 0 },
    { name: ticketStrings.inProgressStatus, value: statusCounts.IN_PROGRESS || 0 },
    { name: ticketStrings.resolvedStatus, value: statusCounts.RESOLVED || 0 },
    { name: ticketStrings.closedStatus, value: statusCounts.CLOSED || 0 },
  ].filter(item => item.value > 0)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{dashboardStrings.charts.ticketStatusDistribution}</CardTitle>
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
        <CardTitle>{dashboardStrings.charts.ticketStatusDistribution}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

