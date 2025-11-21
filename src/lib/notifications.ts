import { toast } from "sonner"
import { englishStrings } from '@/lib/locale-strings'

export const notifications = {
  success: (message: string, description?: string) => {
    toast.success(message, { description })
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description })
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description })
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description })
  },
  loading: (message: string) => {
    return toast.loading(message)
  },
  dismiss: (id: string | number) => {
    toast.dismiss(id)
  },
}

// Notification message functions
export const NOTIFICATION_MESSAGES = {
  TICKET_CREATED: englishStrings.notifications.ticketCreated,
  TICKET_UPDATED: englishStrings.notifications.ticketUpdated,
  TICKET_ASSIGNED: 'Ticket assigned successfully',
  TICKET_ERROR: 'Error managing ticket',
  
  ASSET_CREATED: englishStrings.notifications.assetCreated,
  ASSET_UPDATED: englishStrings.notifications.assetUpdated,
  ASSET_ASSIGNED: 'Asset assigned successfully',
  ASSET_ERROR: 'Error managing asset',
  
  USER_CREATED: englishStrings.notifications.userCreated,
  USER_UPDATED: englishStrings.notifications.userUpdated,
  USER_ERROR: 'Error managing user',
  
  LOGIN_ERROR: englishStrings.auth.loginError,
  LOGIN_SUCCESS: englishStrings.notifications.loginSuccess,
  LOGOUT_SUCCESS: englishStrings.notifications.logoutSuccess,
  
  GENERIC_ERROR: 'An error occurred',
  LOADING: 'Loading...',
} as const
