import { useEffect } from 'react'
import { useSearch } from '../store/search'
import { useFavourites } from '../store/favourites'
import Results from './results'
import CityItem from './city-item'
import Loader from './loader'

export default function CitiesList() {
  const { searchQuery } = useSearch()
  const { getCities, cities, isLoadingCities } = useFavourites()

  useEffect(() => {
    getCities()
  }, [getCities])

  return (
    <div
      className={`relative ${
        !!searchQuery ? 'overflow-hidden' : 'overflow-auto'
      } flex-1 w-full`}
    >
      {!!searchQuery && <Results />}
      {isLoadingCities && (
        <div className="flex justify-center">
          <Loader className="w-6 animate-spin" />
        </div>
      )}
      {!isLoadingCities &&
        cities?.map((city) => <CityItem key={city.id} {...city} />)}
    </div>
  )
}
