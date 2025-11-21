// Core entity types based on Prisma models
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
  tickets?: Ticket[]
  assignedTickets?: Ticket[]
  assets?: Asset[]
  softwareLicenses?: SoftwareLicense[]
}

export interface Ticket {
  id: string
  title: string
  description: string
  priority: TicketPriority
  category: string
  status: TicketStatus
  userId: string
  assignedTo: string | null
  createdAt: Date
  updatedAt: Date
  user?: Pick<User, 'id' | 'name' | 'email'>
  assignedUser?: Pick<User, 'id' | 'name' | 'email'> | null
}

export interface Asset {
  id: string
  name: string
  type: string
  serialNumber: string | null
  status: AssetStatus
  assignedUserId: string | null
  purchaseDate: Date | null
  createdAt: Date
  assignedUser?: Pick<User, 'id' | 'name' | 'email'> | null
}

export interface SoftwareLicense {
  id: string
  name: string
  vendor: string
  licenseKey: string
  expiryDate: Date | null
  assignedUserId: string | null
  createdAt: Date
  assignedUser?: Pick<User, 'id' | 'name' | 'email'> | null
}

// Enum types
export type UserRole = 'END_USER' | 'ADMIN'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
export type AssetStatus = 'AVAILABLE' | 'ASSIGNED' | 'UNDER_MAINTENANCE' | 'RETIRED'

// Extended user type for UI components
export interface UserWithCounts extends Omit<User, 'tickets' | 'assignedTickets' | 'assets' | 'softwareLicenses'> {
  _count: {
    tickets: number
    assets: number
  }
}

export interface UserProfile extends User {
  tickets: Pick<Ticket, 'id' | 'title' | 'status' | 'createdAt'>[]
  assets: Pick<Asset, 'id' | 'name' | 'type' | 'status'>[]
}

// Dashboard statistics type
export interface DashboardStats {
  totalTickets: number
  openTickets: number
  totalAssets: number
  assignedAssets: number
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form data types
export interface CreateTicketFormData {
  title: string
  description: string
  priority: TicketPriority
  category: string
}

export interface CreateAssetFormData {
  name: string
  type: string
  serialNumber?: string
  status: AssetStatus
  purchaseDate?: Date
}

export interface CreateUserFormData {
  name: string
  email: string
  role: UserRole
  password: string
}

// Filter and sort types
export interface TicketFilters {
  status?: TicketStatus
  priority?: TicketPriority
  category?: string
  assignedTo?: string
  userId?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface AssetFilters {
  status?: AssetStatus
  type?: string
  assignedTo?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export type SortDirection = 'asc' | 'desc'

export interface SortOptions {
  field: string
  direction: SortDirection
}

// Component prop types
export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface TableColumn<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface StatusOption extends SelectOption {
  color: string
  icon?: React.ReactNode
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationConfig {
  type: NotificationType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Error types
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApplicationError extends Error {
  code: string
  statusCode?: number
  cause?: unknown
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system'

// Navigation types
export interface NavItem {
  name: string
  href: string
  icon?: React.ReactNode
  badge?: number
  requiredRole?: UserRole
  children?: NavItem[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

// Search and pagination
export interface SearchParams {
  q?: string
  page?: number
  limit?: number
  sort?: string
  order?: SortDirection
  filters?: Record<string, string | string[]>
}

// File upload types
export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
}

// Audit/logging types
export interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  userId: string
  userName: string
  timestamp: Date
  changes?: Record<string, { old: unknown; new: unknown }>
  metadata?: Record<string, unknown>
}

// Feature flags and permissions
export interface Permission {
  resource: string
  action: string
  conditions?: Record<string, unknown>
}

export interface FeatureFlag {
  name: string
  enabled: boolean
  conditions?: Record<string, unknown>
}

// Utility types
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>
export type OptionalBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
