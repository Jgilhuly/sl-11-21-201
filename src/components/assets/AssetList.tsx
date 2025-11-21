'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAssetStatuses } from '@/lib/constants'
import { getAssets, updateAssetStatus, assignAsset } from '@/lib/actions/assets'
import { formatDistanceToNow } from 'date-fns'
import { TableSkeleton } from '@/components/ui/loading-skeletons'
import { notifications, NOTIFICATION_MESSAGES } from '@/lib/notifications'

interface Asset {
  id: string
  name: string
  type: string
  serialNumber?: string
  status: string
  purchaseDate?: Date
  createdAt: Date
  assignedUser?: { id: string; name: string; email: string }
}

export function AssetList() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAssets()
  }, [])

  const loadAssets = async () => {
    try {
      const assetData = await getAssets()
      setAssets(assetData)
    } catch (error) {
      console.error('Failed to load assets:', error)
      notifications.error('Failed to load assets', 'Please refresh the page to try again')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (assetId: string, newStatus: string) => {
    const loadingToast = notifications.loading('Updating asset status...')
    try {
      await updateAssetStatus(assetId, newStatus)
      await loadAssets()
      notifications.dismiss(loadingToast)
      notifications.success(NOTIFICATION_MESSAGES.ASSET_UPDATED, 'Asset status updated successfully')
    } catch (error) {
      notifications.dismiss(loadingToast)
      console.error('Failed to update asset status:', error)
      notifications.error(NOTIFICATION_MESSAGES.ASSET_ERROR, 'Failed to update asset status')
    }
  }

  const handleAssignment = async (assetId: string, assignedUserId: string | null) => {
    const loadingToast = notifications.loading('Updating asset assignment...')
    try {
      await assignAsset(assetId, assignedUserId)
      await loadAssets()
      notifications.dismiss(loadingToast)
      notifications.success(NOTIFICATION_MESSAGES.ASSET_ASSIGNED, 'Asset assignment updated successfully')
    } catch (error) {
      notifications.dismiss(loadingToast)
      console.error('Failed to assign asset:', error)
      notifications.error(NOTIFICATION_MESSAGES.ASSET_ERROR, 'Failed to update asset assignment')
    }
  }

  const getStatusColor = (status: string) => {
    const statusData = getAssetStatuses(strings).find(s => s.value === status)
    return statusData?.color || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return <TableSkeleton rows={3} />
  }

  if (assets.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No assets found. Add your first asset to get started.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <Card key={asset.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">{asset.name}</CardTitle>
                <CardDescription className="text-sm">
                  Type: {asset.type}
                  {asset.serialNumber && ` • S/N: ${asset.serialNumber}`}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(asset.status)}>
                {getAssetStatuses(strings).find(s => s.value === asset.status)?.label || asset.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Created:</span> {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}
              </div>
              {asset.purchaseDate && (
                <div>
                  <span className="font-medium">Purchase Date:</span> {new Date(asset.purchaseDate).toLocaleDateString()}
                </div>
              )}
              <div>
                <span className="font-medium">Assigned To:</span> {asset.assignedUser?.name || 'Unassigned'}
              </div>
            </div>
            
            {user?.role === 'ADMIN' && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={asset.status} 
                    onValueChange={(value) => handleStatusChange(asset.id, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAssetStatuses(strings).map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Assign To</label>
                  <Select 
                    value={asset.assignedUser?.id || 'unassigned'} 
                    onValueChange={(value) => handleAssignment(asset.id, value === 'unassigned' ? null : value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
