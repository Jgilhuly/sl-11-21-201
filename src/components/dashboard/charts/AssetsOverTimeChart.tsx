'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Asset } from '@/lib/types'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

interface AssetsOverTimeChartProps {
  assets: Asset[]
}

export function AssetsOverTimeChart({ assets }: AssetsOverTimeChartProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const dashboardStrings = strings.dashboard

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const filteredAssets = assets.filter(
    asset => new Date(asset.createdAt) >= thirtyDaysAgo
  )

  const dateCounts = filteredAssets.reduce((acc, asset) => {
    const assetDate = new Date(asset.createdAt)
    const dateKey = assetDate.toISOString().split('T')[0]
    const dateLabel = assetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    if (!acc[dateKey]) {
      acc[dateKey] = { label: dateLabel, count: 0 }
    }
    acc[dateKey].count += 1
    return acc
  }, {} as Record<string, { label: string; count: number }>)

  const data = Object.entries(dateCounts)
    .map(([dateKey, { label, count }]) => ({ date: label, count, dateKey }))
    .sort((a, b) => {
      return a.dateKey.localeCompare(b.dateKey)
    })
    .map(({ date, count }) => ({ date, count }))

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{dashboardStrings.charts.assetsOverTime}</CardTitle>
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
        <CardTitle>{dashboardStrings.charts.assetsOverTime}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#10b981"
              name={dashboardStrings.charts.count}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

