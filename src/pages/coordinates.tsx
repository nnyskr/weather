import { useEffect } from 'react'
import { Params, useLoaderData, useNavigate } from 'react-router-dom'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { ArrowLongLeftIcon, StarIcon } from '@heroicons/react/24/solid'
import { City, useFavourites } from '../store/favourites'
import { splitCoordinates } from '../utils/coordinates'
import { getWeatherForCoordinates } from '../api/weather'
import { useSearch } from '../store/search'

export const loader = async ({ params }: { params: Params<string> }) => {
  const { coordinates } = params
  if (!coordinates) {
    throw new Error('No :location param found')
  }

  try {
    const [lat, lon] = splitCoordinates(coordinates)
    const response = await getWeatherForCoordinates({ lat, lon })
    const data: City = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

export function Component() {
  const {
    id,
    name,
    main: { temp, temp_max, temp_min },
  } = useLoaderData() as City

  const navigate = useNavigate()

  const { performSearch } = useSearch()

  const { isCityFavourite, toggleFavourite } = useFavourites()

  const isFavourite = isCityFavourite(id)

  function handleFavouriteClick() {
    toggleFavourite(id)
  }

  /** Very hacky, TODO find solution to clear search during the end of route transition */
  useEffect(() => {
    performSearch('')
  }, [])

  /** Did not have time for it */
  // useEffect(() => {
  // getForecast()
  // }, [getForecast()])

  return (
    <main className="py-4">
      <header className="p-4 flex justify-between items-center">
        <ArrowLongLeftIcon
          className="w-8 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        {isFavourite ? (
          <StarIcon
            className="w-8 cursor-pointer"
            onClick={handleFavouriteClick}
          />
        ) : (
          <StarIconOutline
            className="w-8 cursor-pointer"
            onClick={handleFavouriteClick}
          />
        )}
      </header>
      <section className="text-center p-2">
        <h2 className="text-2xl">{name}</h2>
        <h1 className="text-6xl">{Math.round(temp)}°</h1>
        <h3 className="text-xl">
          H:{Math.round(temp_max)}° L:{Math.round(temp_min)}°
        </h3>
      </section>
    </main>
  )
}

Component.displayName = 'LocationPage'
