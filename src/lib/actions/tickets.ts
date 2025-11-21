'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { validateInput, createTicketSchema, updateTicketStatusSchema, assignTicketSchema, checkRateLimit } from '@/lib/validation'

export interface CreateTicketData {
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  category: string
  userId: string
}

export async function createTicket(data: CreateTicketData) {
  // Rate limiting check
  if (!checkRateLimit(`create-ticket-${data.userId}`, 5, 60000)) {
    throw new Error('Too many requests. Please try again in a minute.')
  }

  // Validate input data
  const validatedData = validateInput(createTicketSchema, data)
  
  try {
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: { id: true }
    })
    
    if (!userExists) {
      throw new Error('User not found')
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        category: validatedData.category,
        userId: validatedData.userId,
        status: 'OPEN',
      },
    })
    
    revalidatePath('/tickets')
    revalidatePath('/dashboard')
    return ticket
  } catch (error) {
    console.error('Failed to create ticket:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to create ticket. Please try again.')
  }
}

export async function getTickets(userId: string, userRole: string) {
  if (userRole === 'ADMIN') {
    return await prisma.ticket.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        assignedUser: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
  
  return await prisma.ticket.findMany({
    where: { userId },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      assignedUser: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateTicketStatus(ticketId: string, status: string) {
  // Validate input data
  const validatedData = validateInput(updateTicketStatusSchema, { ticketId, status })
  
  try {
    // Check if ticket exists
    const ticketExists = await prisma.ticket.findUnique({
      where: { id: validatedData.ticketId },
      select: { id: true }
    })
    
    if (!ticketExists) {
      throw new Error('Ticket not found')
    }

    const ticket = await prisma.ticket.update({
      where: { id: validatedData.ticketId },
      data: { status: validatedData.status },
    })
    
    revalidatePath('/tickets')
    revalidatePath('/dashboard')
    return ticket
  } catch (error) {
    console.error('Failed to update ticket status:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to update ticket status. Please try again.')
  }
}

export async function assignTicket(ticketId: string, assignedTo: string) {
  // Validate input data
  const validatedData = validateInput(assignTicketSchema, { ticketId, assignedTo })
  
  try {
    // Check if both ticket and user exist
    const [ticketExists, userExists] = await Promise.all([
      prisma.ticket.findUnique({
        where: { id: validatedData.ticketId },
        select: { id: true }
      }),
      prisma.user.findUnique({
        where: { id: validatedData.assignedTo },
        select: { id: true, role: true }
      })
    ])
    
    if (!ticketExists) {
      throw new Error('Ticket not found')
    }
    
    if (!userExists) {
      throw new Error('User not found')
    }
    
    // Check if user has admin role (only admins can be assigned tickets)
    if (userExists.role !== 'ADMIN') {
      throw new Error('Only admin users can be assigned tickets')
    }

    const ticket = await prisma.ticket.update({
      where: { id: validatedData.ticketId },
      data: { assignedTo: validatedData.assignedTo },
    })
    
    revalidatePath('/tickets')
    return ticket
  } catch (error) {
    console.error('Failed to assign ticket:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to assign ticket. Please try again.')
  }
}

export async function getTicketById(ticketId: string) {
  return await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      assignedUser: {
        select: { id: true, name: true, email: true }
      }
    }
  })
}
