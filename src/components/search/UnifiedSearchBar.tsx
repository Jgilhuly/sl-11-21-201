'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Loader2, Ticket, Computer, User } from 'lucide-react'
import { unifiedSearch } from '@/lib/actions/search'
import { Ticket as TicketType, Asset, User as UserType } from '@/lib/types'
import Link from 'next/link'

interface SearchResults {
  tickets: TicketType[]
  assets: Asset[]
  users: UserType[]
  total: number
}

export function UnifiedSearchBar() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || !user) {
      setResults(null)
      setIsOpen(false)
      return
    }

    setIsSearching(true)
    setIsOpen(true)

    try {
      const searchResults = await unifiedSearch(searchQuery, user.id, user.role)
      setResults(searchResults)
    } catch (error) {
      console.error('Search failed:', error)
      setResults({ tickets: [], assets: [], users: [], total: 0 })
    } finally {
      setIsSearching(false)
    }
  }, [user])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.trim()) {
      performSearch(value)
    } else {
      setResults(null)
      setIsOpen(false)
    }
  }, [performSearch])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    } else if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }, [query, router])

  const handleClear = useCallback(() => {
    setQuery('')
    setResults(null)
    setIsOpen(false)
    inputRef.current?.focus()
  }, [])

  const handleResultClick = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }, [])

  if (!user) return null

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={strings.common.searchPlaceholder || 'Search tickets, assets, users...'}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() && results) {
              setIsOpen(true)
            }
          }}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">{strings.common.loading}</p>
            </div>
          ) : results && results.total > 0 ? (
            <div className="p-2">
              {results.tickets.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                    {strings.search.tickets || 'Tickets'}
                  </div>
                  {results.tickets.map((ticket) => (
                    <Link
                      key={ticket.id}
                      href={`/tickets`}
                      onClick={handleResultClick}
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <Ticket className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {ticket.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {ticket.category} • {ticket.user.name}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.assets.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                    {strings.search.assets || 'Assets'}
                  </div>
                  {results.assets.map((asset) => (
                    <Link
                      key={asset.id}
                      href={`/assets`}
                      onClick={handleResultClick}
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <Computer className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {asset.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {asset.type} {asset.serialNumber && `• ${asset.serialNumber}`}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.users.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                    {strings.search.users || 'Users'}
                  </div>
                  {results.users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/users`}
                      onClick={handleResultClick}
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {query.trim() && (
                <div className="border-t pt-2 mt-2">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={handleResultClick}
                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors text-center"
                  >
                    {strings.search.viewAllResults || `View all ${results.total} results`}
                  </Link>
                </div>
              )}
            </div>
          ) : results && results.total === 0 && query.trim() ? (
            <div className="p-4 text-center text-sm text-gray-500">
              {strings.search.noResults || 'No results found'}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
