'use client'

import { useState, useCallback } from 'react'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface TicketSearchBarProps {
  onSearch: (query: string) => void
  onClear: () => void
  searchQuery: string
}

export function TicketSearchBar({ onSearch, onClear, searchQuery }: TicketSearchBarProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const handleSearch = useCallback(() => {
    onSearch(localQuery)
  }, [localQuery, onSearch])

  const handleClear = useCallback(() => {
    setLocalQuery('')
    onClear()
  }, [onClear])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={strings.tickets.searchPlaceholder}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
        />
      </div>
      <Button 
        onClick={handleSearch}
        variant="outline"
        size="sm"
      >
        {strings.common.search}
      </Button>
      {searchQuery && (
        <Button 
          onClick={handleClear}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}