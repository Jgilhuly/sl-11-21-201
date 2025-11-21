'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { validateInput, createAssetSchema, updateAssetStatusSchema, assignAssetSchema, checkRateLimit } from '@/lib/validation'

export interface CreateAssetData {
  name: string
  type: string
  serialNumber?: string
  status: 'AVAILABLE' | 'ASSIGNED' | 'UNDER_MAINTENANCE' | 'RETIRED'
  purchaseDate?: Date
}

export async function createAsset(data: CreateAssetData) {
  // Rate limiting check
  if (!checkRateLimit(`create-asset`, 10, 60000)) {
    throw new Error('Too many requests. Please try again in a minute.')
  }

  // Validate input data
  const validatedData = validateInput(createAssetSchema, data)
  
  try {
    // Check if serial number is unique (if provided)
    if (validatedData.serialNumber) {
      const existingAsset = await prisma.asset.findUnique({
        where: { serialNumber: validatedData.serialNumber },
        select: { id: true }
      })
      
      if (existingAsset) {
        throw new Error('An asset with this serial number already exists')
      }
    }

    const asset = await prisma.asset.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        serialNumber: validatedData.serialNumber,
        status: validatedData.status,
        purchaseDate: validatedData.purchaseDate,
      },
    })
    
    revalidatePath('/assets')
    revalidatePath('/dashboard')
    return asset
  } catch (error) {
    console.error('Failed to create asset:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to create asset. Please try again.')
  }
}

export async function getAssets() {
  return await prisma.asset.findMany({
    include: {
      assignedUser: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateAssetStatus(assetId: string, status: string) {
  // Validate input data
  const validatedData = validateInput(updateAssetStatusSchema, { assetId, status })
  
  try {
    // Check if asset exists
    const assetExists = await prisma.asset.findUnique({
      where: { id: validatedData.assetId },
      select: { id: true }
    })
    
    if (!assetExists) {
      throw new Error('Asset not found')
    }

    const asset = await prisma.asset.update({
      where: { id: validatedData.assetId },
      data: { status: validatedData.status },
    })
    
    revalidatePath('/assets')
    revalidatePath('/dashboard')
    return asset
  } catch (error) {
    console.error('Failed to update asset status:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to update asset status. Please try again.')
  }
}

export async function assignAsset(assetId: string, assignedUserId: string | null) {
  // Validate input data
  const validatedData = validateInput(assignAssetSchema, { assetId, assignedUserId })
  
  try {
    // Check if asset exists
    const assetExists = await prisma.asset.findUnique({
      where: { id: validatedData.assetId },
      select: { id: true }
    })
    
    if (!assetExists) {
      throw new Error('Asset not found')
    }
    
    // Check if user exists (when assigning)
    if (validatedData.assignedUserId) {
      const userExists = await prisma.user.findUnique({
        where: { id: validatedData.assignedUserId },
        select: { id: true }
      })
      
      if (!userExists) {
        throw new Error('User not found')
      }
    }

    const asset = await prisma.asset.update({
      where: { id: validatedData.assetId },
      data: { 
        assignedUserId: validatedData.assignedUserId,
        status: validatedData.assignedUserId ? 'ASSIGNED' : 'AVAILABLE'
      },
    })
    
    revalidatePath('/assets')
    revalidatePath('/dashboard')
    return asset
  } catch (error) {
    console.error('Failed to assign asset:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to assign asset. Please try again.')
  }
}

export async function getAssetById(assetId: string) {
  return await prisma.asset.findUnique({
    where: { id: assetId },
    include: {
      assignedUser: {
        select: { id: true, name: true, email: true }
      }
    }
  })
}
