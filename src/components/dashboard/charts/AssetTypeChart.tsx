'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Asset } from '@/lib/types'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

interface AssetTypeChartProps {
  assets: Asset[]
}

export function AssetTypeChart({ assets }: AssetTypeChartProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const dashboardStrings = strings.dashboard
  const assetStrings = strings.assets

  const typeCounts = assets.reduce((acc, asset) => {
    const type = asset.type
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const typeLabels: Record<string, string> = {
    'Computer': assetStrings.typeComputer,
    'Monitor': assetStrings.typeMonitor,
    'Keyboard': assetStrings.typeKeyboard,
    'Mouse': assetStrings.typeMouse,
    'Network Equipment': assetStrings.typeNetworkEquipment,
    'Printer': assetStrings.typePrinter,
    'Other': assetStrings.typeOther,
  }

  const data = Object.entries(typeCounts)
    .map(([type, count]) => ({
      type: typeLabels[type] || type,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{dashboardStrings.charts.assetTypeDistribution}</CardTitle>
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
        <CardTitle>{dashboardStrings.charts.assetTypeDistribution}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#10b981" name={dashboardStrings.charts.count} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

