'use server'

import { prisma } from '@/lib/db'
import { Ticket, Asset, User, UserWithCounts } from '@/lib/types'

export interface SearchResult {
  type: 'ticket' | 'asset' | 'user'
  id: string
  title: string
  subtitle: string
  metadata?: Record<string, string>
  url: string
}

export interface UnifiedSearchResults {
  tickets: Ticket[]
  assets: Asset[]
  users: (User | UserWithCounts)[]
  total: number
}

export async function unifiedSearch(query: string, userId?: string, userRole?: string): Promise<UnifiedSearchResults> {
  if (!query || query.trim().length === 0) {
    return {
      tickets: [],
      assets: [],
      users: [],
      total: 0
    }
  }

  const searchTerm = query.trim().toLowerCase()

  const [tickets, assets, users] = await Promise.all([
    searchTickets(searchTerm, userId, userRole),
    searchAssets(searchTerm),
    searchUsers(searchTerm)
  ])

  return {
    tickets,
    assets,
    users,
    total: tickets.length + assets.length + users.length
  }
}

async function searchTickets(searchTerm: string, userId?: string, userRole?: string): Promise<Ticket[]> {
  const whereClause: any = {
    OR: [
      { title: { contains: searchTerm } },
      { description: { contains: searchTerm } },
      { category: { contains: searchTerm } },
      {
        user: {
          OR: [
            { name: { contains: searchTerm } },
            { email: { contains: searchTerm } }
          ]
        }
      }
    ]
  }

  if (userRole !== 'ADMIN' && userId) {
    whereClause.userId = userId
  }

  const results = await prisma.ticket.findMany({
    where: whereClause,
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      assignedUser: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  return results.filter(ticket => 
    ticket.title.toLowerCase().includes(searchTerm) ||
    ticket.description.toLowerCase().includes(searchTerm) ||
    ticket.category.toLowerCase().includes(searchTerm) ||
    ticket.user.name.toLowerCase().includes(searchTerm) ||
    ticket.user.email.toLowerCase().includes(searchTerm)
  ) as Ticket[]
}

async function searchAssets(searchTerm: string): Promise<Asset[]> {
  const results = await prisma.asset.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm } },
        { type: { contains: searchTerm } },
        { serialNumber: { contains: searchTerm } },
        {
          assignedUser: {
            OR: [
              { name: { contains: searchTerm } },
              { email: { contains: searchTerm } }
            ]
          }
        }
      ]
    },
    include: {
      assignedUser: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return results.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm) ||
    asset.type.toLowerCase().includes(searchTerm) ||
    (asset.serialNumber && asset.serialNumber.toLowerCase().includes(searchTerm)) ||
    (asset.assignedUser && asset.assignedUser.name.toLowerCase().includes(searchTerm)) ||
    (asset.assignedUser && asset.assignedUser.email.toLowerCase().includes(searchTerm))
  ).slice(0, 10) as Asset[]
}

async function searchUsers(searchTerm: string): Promise<(User | UserWithCounts)[]> {
  const results = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm } },
        { email: { contains: searchTerm } }
      ]
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          tickets: true,
          assets: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return results.filter(user =>
    user.name.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm)
  ).slice(0, 10) as (User | UserWithCounts)[]
}
