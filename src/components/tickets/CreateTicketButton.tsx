'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { CreateTicketDialog } from './CreateTicketDialog'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
export function CreateTicketButton() {
  const { getStrings } = useLocalizedStrings()
  const dashboardStrings = getStrings().dashboard
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        {dashboardStrings.createTicket}
      </Button>
      
      <CreateTicketDialog 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  )
}
