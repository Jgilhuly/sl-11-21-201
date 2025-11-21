'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTickets } from '@/lib/actions/tickets'
import { getPriorities, getTicketStatuses } from '@/lib/constants'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Ticket {
  id: string
  title: string
  priority: string
  status: string
  category: string
  createdAt: Date
  user: { id: string; name: string; email: string }
}

export function RecentTickets() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadRecentTickets = useCallback(async () => {
    if (!user) return
    
    try {
      const tickets = await getTickets(user.id, user.role)
      const recent = tickets.slice(0, 5)
      setRecentTickets(recent)
    } catch (error) {
      console.error('Failed to load recent tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadRecentTickets()
    }
  }, [user, loadRecentTickets])

  const getPriorityColor = (priority: string) => {
    const priorityData = getPriorities(strings).find(p => p.value === priority)
    return priorityData?.color || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const statusData = getTicketStatuses(strings).find(s => s.value === status)
    return statusData?.color || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">Loading recent tickets...</div>
        </CardContent>
      </Card>
    )
  }

  if (recentTickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            No tickets yet. Create your first ticket to get started.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Tickets</CardTitle>
        <Link href="/tickets">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTickets.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{ticket.title}</h4>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {getPriorities(strings).find(p => p.value === ticket.priority)?.label || ticket.priority}
                  </Badge>
                  <Badge className={getStatusColor(ticket.status)}>
                    {getTicketStatuses(strings).find(s => s.value === ticket.status)?.label || ticket.status}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  {ticket.category} • {ticket.user.name} • {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
