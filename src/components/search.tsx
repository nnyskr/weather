import { ChangeEvent, useRef } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useSearch } from '../store/search'

export default function Search() {
  const { searchQuery, performSearch } = useSearch()
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    performSearch(event.target.value)
  }

  function handleCloseClick() {
    performSearch('')
    searchInputRef.current?.blur()
  }

  return (
    <header className="pb-4">
      <h1
        className={`title-header p-4 pb-2 text-center text-4xl font-bold transition-all duration-300 ease-in-out ${
          !!searchQuery ? 'mt-[-64px]' : ''
        }`}
      >
        Weather
      </h1>
      <div className="w-auto mx-2 mt-4 flex items-center relative">
        <input
          ref={searchInputRef}
          placeholder="Search cities"
          spellCheck={false}
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input border border-gray-400 rounded-lg pl-8 py-1 w-full"
        />
        <button
          className={`${
            !!searchQuery ? '' : 'hidden'
          } px-4 hover:text-gray-400`}
          onClick={handleCloseClick}
        >
          Close
        </button>
        <MagnifyingGlassIcon className="absolute left-2 mr-2 w-5 text-gray-400" />
      </div>
    </header>
  )
}
