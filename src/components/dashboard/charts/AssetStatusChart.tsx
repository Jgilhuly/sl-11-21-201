'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Asset } from '@/lib/types'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

interface AssetStatusChartProps {
  assets: Asset[]
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#6b7280']

export function AssetStatusChart({ assets }: AssetStatusChartProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const dashboardStrings = strings.dashboard
  const assetStrings = strings.assets

  const statusCounts = assets.reduce((acc, asset) => {
    const status = asset.status
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const data = [
    { name: assetStrings.available, value: statusCounts.AVAILABLE || 0 },
    { name: assetStrings.assigned, value: statusCounts.ASSIGNED || 0 },
    { name: assetStrings.underMaintenance, value: statusCounts.UNDER_MAINTENANCE || 0 },
    { name: assetStrings.retired, value: statusCounts.RETIRED || 0 },
  ].filter(item => item.value > 0)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{dashboardStrings.charts.assetStatusDistribution}</CardTitle>
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
        <CardTitle>{dashboardStrings.charts.assetStatusDistribution}</CardTitle>
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

