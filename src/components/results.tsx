import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useSearch } from '../store/search'
import { joinCoordinates } from '../utils/coordinates'
import Result from './result'

export default function Results() {
  const { searchQuery, results } = useSearch()

  const hasResults = !!results?.length

  return (
    <div
      className={`absolute top-0 left-0 h-full w-full bg-white ${
        hasResults ? '' : 'flex'
      }`}
    >
      {!hasResults && (
        <div className="flex flex-col w-full justify-center items-center">
          <MagnifyingGlassIcon className="w-16 text-gray-400" />

          <p className="text-2xl font-bold">No Results</p>
          <p className="text-gray-500">No results found for "{searchQuery}"</p>
        </div>
      )}
      {hasResults &&
        results.map((result) => (
          <Result key={joinCoordinates(result.lat, result.lon)} {...result} />
        ))}
    </div>
  )
}
