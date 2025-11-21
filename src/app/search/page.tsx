'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { unifiedSearch } from '@/lib/actions/search'
import { Ticket, Asset, User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ticket as TicketIcon, Computer, User as UserIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { getPriorities, getTicketStatuses, getAssetStatuses } from '@/lib/constants'

export default function SearchPage() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [results, setResults] = useState<{
    tickets: Ticket[]
    assets: Asset[]
    users: User[]
    total: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (query && user) {
      performSearch()
    } else {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, user])

  const performSearch = async () => {
    if (!query.trim() || !user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const searchResults = await unifiedSearch(query, user.id, user.role)
      setResults(searchResults)
    } catch (error) {
      console.error('Search failed:', error)
      setResults({ tickets: [], assets: [], users: [], total: 0 })
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    const priorityData = getPriorities(strings).find(p => p.value === priority)
    return priorityData?.color || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const statusData = getTicketStatuses(strings).find(s => s.value === status)
    return statusData?.color || 'bg-gray-100 text-gray-800'
  }

  const getAssetStatusColor = (status: string) => {
    const statusData = getAssetStatuses(strings).find(s => s.value === status)
    return statusData?.color || 'bg-gray-100 text-gray-800'
  }

  const getRoleColor = (role: string) => {
    return role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{strings.search.title}</h1>
              <p className="text-gray-600 mt-2">{strings.common.loading}</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  if (!query.trim()) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{strings.search.title}</h1>
              <p className="text-gray-600 mt-2">{strings.search.noQuery}</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  const totalResults = results?.total || 0
  const resultText = totalResults === 1 
    ? strings.search.totalResults.replace('{count}', '1').replace('{plural}', '')
    : strings.search.totalResults.replace('{count}', totalResults.toString()).replace('{plural}', 's')

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{strings.search.title}</h1>
            <p className="text-gray-600 mt-2">
              {strings.search.resultsFor} &quot;{query}&quot; • {resultText}
            </p>
          </div>

          {results && results.total === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  {strings.search.noResults}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {results && results.tickets.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TicketIcon className="h-5 w-5" />
                    {strings.search.tickets} ({results.tickets.length})
                  </h2>
                  <div className="space-y-4">
                    {results.tickets.map((ticket) => (
                      <Card key={ticket.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{ticket.title}</CardTitle>
                              <CardDescription className="text-sm">
                                {ticket.description.length > 100 
                                  ? `${ticket.description.substring(0, 100)}...` 
                                  : ticket.description
                                }
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {getPriorities(strings).find(p => p.value === ticket.priority)?.label || ticket.priority}
                              </Badge>
                              <Badge className={getStatusColor(ticket.status)}>
                                {getTicketStatuses(strings).find(s => s.value === ticket.status)?.label || ticket.status}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Category:</span> {ticket.category}
                            </div>
                            <div>
                              <span className="font-medium">Created:</span> {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                            </div>
                            <div>
                              <span className="font-medium">By:</span> {ticket.user.name}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {results && results.assets.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Computer className="h-5 w-5" />
                    {strings.search.assets} ({results.assets.length})
                  </h2>
                  <div className="space-y-4">
                    {results.assets.map((asset) => (
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
                            <Badge className={getAssetStatusColor(asset.status)}>
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {results && results.users.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    {strings.search.users} ({results.users.length})
                  </h2>
                  <div className="space-y-4">
                    {results.users.map((user) => (
                      <Card key={user.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{user.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {user.email}
                              </CardDescription>
                            </div>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role === 'ADMIN' ? strings.common.admin : strings.common.endUser}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Created:</span> {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </div>
                            {'_count' in user && user._count && (
                              <>
                                <div>
                                  <span className="font-medium">Tickets:</span> {user._count.tickets}
                                </div>
                                <div>
                                  <span className="font-medium">Assets:</span> {user._count.assets}
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
