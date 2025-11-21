export const PRIORITIES = [
  { value: 'LOW', labelKey: 'priorityLow' as const, color: 'bg-green-100 text-green-800' },
  { value: 'MEDIUM', labelKey: 'priorityMedium' as const, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'HIGH', labelKey: 'priorityHigh' as const, color: 'bg-orange-100 text-orange-800' },
  { value: 'CRITICAL', labelKey: 'priorityCritical' as const, color: 'bg-red-100 text-red-800' },
] as const

export const getPriorities = (strings: { tickets: { lowPriority: string; mediumPriority: string; highPriority: string; criticalPriority: string } }) => {
  const labelMap: Record<string, string> = {
    LOW: strings.tickets.lowPriority,
    MEDIUM: strings.tickets.mediumPriority,
    HIGH: strings.tickets.highPriority,
    CRITICAL: strings.tickets.criticalPriority
  }
  return PRIORITIES.map(priority => ({
    ...priority,
    label: labelMap[priority.value] || priority.value
  }))
}

export const TICKET_STATUSES = [
  { value: 'OPEN', labelKey: 'statusOpen' as const, color: 'bg-blue-100 text-blue-800' },
  { value: 'IN_PROGRESS', labelKey: 'statusInProgress' as const, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'RESOLVED', labelKey: 'statusResolved' as const, color: 'bg-green-100 text-green-800' },
  { value: 'CLOSED', labelKey: 'statusClosed' as const, color: 'bg-gray-100 text-gray-800' },
] as const

export const getTicketStatuses = (strings: { tickets: { openStatus: string; inProgressStatus: string; resolvedStatus: string; closedStatus: string } }) => {
  const labelMap: Record<string, string> = {
    OPEN: strings.tickets.openStatus,
    IN_PROGRESS: strings.tickets.inProgressStatus,
    RESOLVED: strings.tickets.resolvedStatus,
    CLOSED: strings.tickets.closedStatus
  }
  return TICKET_STATUSES.map(status => ({
    ...status,
    label: labelMap[status.value] || status.value
  }))
}

export const ASSET_STATUSES = [
  { value: 'AVAILABLE', labelKey: 'statusAvailable' as const, color: 'bg-green-100 text-green-800' },
  { value: 'ASSIGNED', labelKey: 'statusAssigned' as const, color: 'bg-blue-100 text-blue-800' },
  { value: 'UNDER_MAINTENANCE', labelKey: 'statusUnderMaintenance' as const, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'RETIRED', labelKey: 'statusRetired' as const, color: 'bg-gray-100 text-gray-800' },
] as const

export const getAssetStatuses = (strings: { assets: { available: string; assigned: string; underMaintenance: string; retired: string } }) => {
  const labelMap: Record<string, string> = {
    AVAILABLE: strings.assets.available,
    ASSIGNED: strings.assets.assigned,
    UNDER_MAINTENANCE: strings.assets.underMaintenance,
    RETIRED: strings.assets.retired
  }
  return ASSET_STATUSES.map(status => ({
    ...status,
    label: labelMap[status.value] || status.value
  }))
}

export const TICKET_CATEGORIES = [
  { value: 'HARDWARE', labelKey: 'categoryHardware' as const },
  { value: 'SOFTWARE', labelKey: 'categorySoftware' as const },
  { value: 'NETWORK', labelKey: 'categoryNetwork' as const },
  { value: 'ACCESS', labelKey: 'categoryAccess' as const },
  { value: 'OTHER', labelKey: 'categoryOther' as const },
] as const

export const getTicketCategories = (strings: { tickets: { categoryHardware: string; categorySoftware: string; categoryNetwork: string; categoryAccess: string; categoryOther: string } }) => {
  const labelMap: Record<string, string> = {
    HARDWARE: strings.tickets.categoryHardware,
    SOFTWARE: strings.tickets.categorySoftware,
    NETWORK: strings.tickets.categoryNetwork,
    ACCESS: strings.tickets.categoryAccess,
    OTHER: strings.tickets.categoryOther
  }
  return TICKET_CATEGORIES.map(category => ({
    ...category,
    label: labelMap[category.value] || category.value
  }))
}

export const ASSET_TYPES = [
  { value: 'COMPUTER', labelKey: 'typeComputer' as const },
  { value: 'MONITOR', labelKey: 'typeMonitor' as const },
  { value: 'KEYBOARD', labelKey: 'typeKeyboard' as const },
  { value: 'MOUSE', labelKey: 'typeMouse' as const },
  { value: 'NETWORK_EQUIPMENT', labelKey: 'typeNetworkEquipment' as const },
  { value: 'PRINTER', labelKey: 'typePrinter' as const },
  { value: 'OTHER', labelKey: 'typeOther' as const },
] as const

export const getAssetTypes = (strings: { assets: { typeComputer: string; typeMonitor: string; typeKeyboard: string; typeMouse: string; typeNetworkEquipment: string; typePrinter: string; typeOther: string } }) => {
  const labelMap: Record<string, string> = {
    COMPUTER: strings.assets.typeComputer,
    MONITOR: strings.assets.typeMonitor,
    KEYBOARD: strings.assets.typeKeyboard,
    MOUSE: strings.assets.typeMouse,
    NETWORK_EQUIPMENT: strings.assets.typeNetworkEquipment,
    PRINTER: strings.assets.typePrinter,
    OTHER: strings.assets.typeOther
  }
  return ASSET_TYPES.map(type => ({
    ...type,
    label: labelMap[type.value] || type.value
  }))
}
