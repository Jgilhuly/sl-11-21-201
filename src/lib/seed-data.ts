import { prisma } from './db'
import type { UserRole, TicketPriority, TicketStatus, AssetStatus } from './types'

export interface SeedUser {
  name: string
  email: string
  role: UserRole
}

export interface SeedTicket {
  title: string
  description: string
  priority: TicketPriority
  category: string
  status: TicketStatus
  userEmail: string
  assignedToEmail?: string
}

export interface SeedAsset {
  name: string
  type: string
  serialNumber?: string
  status: AssetStatus
  purchaseDate?: Date
  assignedToEmail?: string
}

// Demo users
const seedUsers: SeedUser[] = [
  // Existing authentication users
  {
    name: 'End User',
    email: 'user@company.com',
    role: 'END_USER'
  },
  {
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'ADMIN'
  },
  
  // Additional demo users
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'END_USER'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@company.com', 
    role: 'END_USER'
  },
  {
    name: 'Emma Williams',
    email: 'emma.williams@company.com',
    role: 'END_USER'
  },
  {
    name: 'David Rodriguez',
    email: 'david.rodriguez@company.com',
    role: 'ADMIN'
  },
  {
    name: 'Lisa Thompson',
    email: 'lisa.thompson@company.com',
    role: 'END_USER'
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    role: 'ADMIN'
  },
  {
    name: 'Anna Garcia',
    email: 'anna.garcia@company.com',
    role: 'END_USER'
  },
  {
    name: 'Robert Brown',
    email: 'robert.brown@company.com',
    role: 'END_USER'
  }
]

// Demo tickets with realistic IT issues
const seedTickets: SeedTicket[] = [
  {
    title: 'Unable to connect to Wi-Fi',
    description: 'I cannot connect to the office Wi-Fi network from my laptop. It shows the network but fails to authenticate with the password. This started happening after the recent Windows update.',
    priority: 'MEDIUM',
    category: 'Network',
    status: 'OPEN',
    userEmail: 'sarah.johnson@company.com'
  },
  {
    title: 'Printer not responding',
    description: 'The HP printer on the 3rd floor is not responding to print jobs. The queue shows jobs pending but nothing prints. Power cycling the printer did not help.',
    priority: 'HIGH',
    category: 'Hardware', 
    status: 'IN_PROGRESS',
    userEmail: 'michael.chen@company.com',
    assignedToEmail: 'admin@company.com'
  },
  {
    title: 'Password reset for CRM system',
    description: 'I need my password reset for the CRM system. I have been locked out after multiple failed login attempts. My username is e.williams.',
    priority: 'MEDIUM',
    category: 'Access',
    status: 'RESOLVED',
    userEmail: 'emma.williams@company.com',
    assignedToEmail: 'david.rodriguez@company.com'
  },
  {
    title: 'Software installation request',
    description: 'I need Adobe Photoshop installed on my workstation for the marketing campaign project. I have the license key available.',
    priority: 'LOW',
    category: 'Software',
    status: 'OPEN',
    userEmail: 'lisa.thompson@company.com'
  },
  {
    title: 'Computer running very slowly',
    description: 'My computer has become extremely slow over the past week. It takes several minutes to boot up and applications are very sluggish. I have tried restarting multiple times.',
    priority: 'HIGH',
    category: 'Hardware',
    status: 'OPEN', 
    userEmail: 'anna.garcia@company.com'
  },
  {
    title: 'Email not syncing on mobile',
    description: 'My company email is not syncing properly on my iPhone. I can receive emails but cannot send them. The error message says "Cannot send mail. The message was rejected by the server."',
    priority: 'MEDIUM',
    category: 'Software',
    status: 'IN_PROGRESS',
    userEmail: 'robert.brown@company.com',
    assignedToEmail: 'james.wilson@company.com'
  },
  {
    title: 'VPN connection issues',
    description: 'I cannot establish a VPN connection to access company resources from home. The connection times out during the authentication phase.',
    priority: 'HIGH',
    category: 'Network',
    status: 'OPEN',
    userEmail: 'user@company.com'
  },
  {
    title: 'Request for dual monitor setup',
    description: 'I would like to request an additional monitor for my workstation to improve productivity. I do a lot of spreadsheet work and would benefit from the extra screen space.',
    priority: 'LOW',
    category: 'Hardware',
    status: 'CLOSED',
    userEmail: 'sarah.johnson@company.com',
    assignedToEmail: 'admin@company.com'
  },
  {
    title: 'Antivirus blocking legitimate software',
    description: 'The antivirus software is blocking our development tools and flagging them as malicious. This is preventing our team from working effectively.',
    priority: 'CRITICAL',
    category: 'Software',
    status: 'IN_PROGRESS',
    userEmail: 'michael.chen@company.com',
    assignedToEmail: 'david.rodriguez@company.com'
  },
  {
    title: 'Keyboard keys not working',
    description: 'Several keys on my keyboard (Q, W, E, R) are not working properly. Sometimes they dont register presses, other times they repeat multiple times.',
    priority: 'MEDIUM',
    category: 'Hardware',
    status: 'RESOLVED',
    userEmail: 'emma.williams@company.com',
    assignedToEmail: 'james.wilson@company.com'
  }
]

// Demo assets with realistic IT equipment
const seedAssets: SeedAsset[] = [
  {
    name: 'MacBook Pro 16-inch',
    type: 'Computer',
    serialNumber: 'MBP16-2023-001',
    status: 'ASSIGNED',
    purchaseDate: new Date('2023-01-15'),
    assignedToEmail: 'sarah.johnson@company.com'
  },
  {
    name: 'Dell OptiPlex 7090',
    type: 'Computer', 
    serialNumber: 'DOT7090-2022-045',
    status: 'ASSIGNED',
    purchaseDate: new Date('2022-11-20'),
    assignedToEmail: 'michael.chen@company.com'
  },
  {
    name: 'iPad Pro 12.9-inch',
    type: 'Computer',
    serialNumber: 'IPD129-2023-012',
    status: 'AVAILABLE',
    purchaseDate: new Date('2023-03-10')
  },
  {
    name: 'HP LaserJet Pro M404n',
    type: 'Printer',
    serialNumber: 'HPLJ404-2022-003',
    status: 'ASSIGNED',
    purchaseDate: new Date('2022-08-05'),
    assignedToEmail: 'emma.williams@company.com'
  },
  {
    name: 'Dell UltraSharp U2722DE',
    type: 'Monitor',
    serialNumber: 'DUS2722-2023-089',
    status: 'ASSIGNED',
    purchaseDate: new Date('2023-02-18'),
    assignedToEmail: 'lisa.thompson@company.com'
  },
  {
    name: 'Logitech MX Master 3',
    type: 'Mouse',
    serialNumber: 'LMX3-2023-156',
    status: 'AVAILABLE',
    purchaseDate: new Date('2023-04-22')
  },
  {
    name: 'Cisco Meraki MR46',
    type: 'Network Equipment',
    serialNumber: 'CMR46-2022-008',
    status: 'ASSIGNED',
    purchaseDate: new Date('2022-09-12')
  },
  {
    name: 'Surface Pro 9',
    type: 'Computer',
    serialNumber: 'SP9-2023-034',
    status: 'UNDER_MAINTENANCE',
    purchaseDate: new Date('2023-01-30'),
    assignedToEmail: 'anna.garcia@company.com'
  },
  {
    name: 'iPhone 14 Pro',
    type: 'Other',
    serialNumber: 'IP14P-2023-067',
    status: 'ASSIGNED',
    purchaseDate: new Date('2023-05-15'),
    assignedToEmail: 'robert.brown@company.com'
  },
  {
    name: 'ThinkPad X1 Carbon',
    type: 'Computer',
    serialNumber: 'TPX1C-2022-091',
    status: 'RETIRED',
    purchaseDate: new Date('2022-06-10')
  },
  {
    name: 'BenQ PD3200U',
    type: 'Monitor', 
    serialNumber: 'BQPD32-2023-045',
    status: 'AVAILABLE',
    purchaseDate: new Date('2023-03-25')
  },
  {
    name: 'Mechanical Keyboard',
    type: 'Keyboard',
    serialNumber: 'MK-2023-178',
    status: 'ASSIGNED',
    purchaseDate: new Date('2023-06-01'),
    assignedToEmail: 'user@company.com'
  }
]

// Demo software licenses
const seedSoftwareLicenses = [
  {
    name: 'Microsoft Office 365',
    vendor: 'Microsoft',
    licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
    expiryDate: new Date('2024-12-31'),
    assignedToEmail: 'sarah.johnson@company.com'
  },
  {
    name: 'Adobe Creative Suite',
    vendor: 'Adobe',
    licenseKey: 'ACS-XXXXX-XXXXX-XXXXX',
    expiryDate: new Date('2024-06-30'),
    assignedToEmail: 'lisa.thompson@company.com'
  },
  {
    name: 'Slack Pro',
    vendor: 'Slack',
    licenseKey: 'SLACK-PRO-XXXXX-XXXXX',
    expiryDate: new Date('2024-11-15')
  },
  {
    name: 'Zoom Pro',
    vendor: 'Zoom',
    licenseKey: 'ZOOM-PRO-XXXXX-XXXXX',
    expiryDate: new Date('2024-08-20'),
    assignedToEmail: 'michael.chen@company.com'
  },
  {
    name: 'Visual Studio Professional',
    vendor: 'Microsoft',
    licenseKey: 'VS-PRO-XXXXX-XXXXX-XXXXX',
    expiryDate: new Date('2024-10-10'),
    assignedToEmail: 'emma.williams@company.com'
  }
]

export async function seedDatabase() {
  console.log('Starting database seed...')

  try {
    // Clear existing data in correct order (respecting foreign key constraints)
    console.log('Clearing existing data...')
    await prisma.softwareLicense.deleteMany()
    await prisma.asset.deleteMany() 
    await prisma.ticket.deleteMany()
    await prisma.user.deleteMany()

    // Seed users
    console.log('Seeding users...')
    const createdUsers = await Promise.all(
      seedUsers.map(userData => 
        prisma.user.create({
          data: userData
        })
      )
    )
    console.log(`Created ${createdUsers.length} users`)

    // Create user email to ID mapping for relationships
    const userEmailToId = createdUsers.reduce((acc, user) => {
      acc[user.email] = user.id
      return acc
    }, {} as Record<string, string>)

    // Seed tickets
    console.log('Seeding tickets...')
    const createdTickets = await Promise.all(
      seedTickets.map(ticketData => {
        const userId = userEmailToId[ticketData.userEmail]
        const assignedToId = ticketData.assignedToEmail 
          ? userEmailToId[ticketData.assignedToEmail] 
          : null

        return prisma.ticket.create({
          data: {
            title: ticketData.title,
            description: ticketData.description,
            priority: ticketData.priority,
            category: ticketData.category,
            status: ticketData.status,
            userId: userId,
            assignedTo: assignedToId
          }
        })
      })
    )
    console.log(`Created ${createdTickets.length} tickets`)

    // Seed assets 
    console.log('Seeding assets...')
    const createdAssets = await Promise.all(
      seedAssets.map(assetData => {
        const assignedUserId = assetData.assignedToEmail
          ? userEmailToId[assetData.assignedToEmail]
          : null

        return prisma.asset.create({
          data: {
            name: assetData.name,
            type: assetData.type,
            serialNumber: assetData.serialNumber,
            status: assetData.status,
            purchaseDate: assetData.purchaseDate,
            assignedUserId: assignedUserId
          }
        })
      })
    )
    console.log(`Created ${createdAssets.length} assets`)

    // Seed software licenses
    console.log('Seeding software licenses...')
    const createdLicenses = await Promise.all(
      seedSoftwareLicenses.map(licenseData => {
        const assignedUserId = licenseData.assignedToEmail
          ? userEmailToId[licenseData.assignedToEmail]
          : null

        return prisma.softwareLicense.create({
          data: {
            name: licenseData.name,
            vendor: licenseData.vendor,
            licenseKey: licenseData.licenseKey,
            expiryDate: licenseData.expiryDate,
            assignedUserId: assignedUserId
          }
        })
      })
    )
    console.log(`Created ${createdLicenses.length} software licenses`)

    console.log('Database seed completed successfully!')
    
    return {
      users: createdUsers.length,
      tickets: createdTickets.length,
      assets: createdAssets.length,
      licenses: createdLicenses.length
    }
    
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

// Function to reset database to initial state
export async function resetDatabase() {
  console.log('Resetting database...')
  
  try {
    await prisma.softwareLicense.deleteMany()
    await prisma.asset.deleteMany()
    await prisma.ticket.deleteMany()
    await prisma.user.deleteMany()
    
    console.log('Database reset completed')
  } catch (error) {
    console.error('Error resetting database:', error)
    throw error
  }
}

// Function to seed just demo users (for development)
export async function seedMinimalData() {
  console.log('Seeding minimal demo data...')
  
  try {
    // Create just the basic auth users if they don't exist
    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: ['user@company.com', 'admin@company.com']
        }
      }
    })

    if (existingUsers.length === 0) {
      await prisma.user.createMany({
        data: [
          {
            name: 'End User',
            email: 'user@company.com',
            role: 'END_USER'
          },
          {
            name: 'Admin User',
            email: 'admin@company.com', 
            role: 'ADMIN'
          }
        ]
      })
      console.log('Created basic auth users')
    } else {
      console.log('Basic auth users already exist')
    }
    
  } catch (error) {
    console.error('Error seeding minimal data:', error)
    throw error
  }
}
