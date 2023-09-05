import { Link, useNavigation } from 'react-router-dom'
import { joinCoordinates } from '../utils/coordinates'
import { CityResult } from '../store/search'

export default function Result({ name, lat, lon, state, country }: CityResult) {
  const navigation = useNavigation()
  const coordinates = joinCoordinates(lat, lon)

  const isNavigating =
    navigation.state === 'loading' &&
    navigation.location.pathname.endsWith(coordinates)

  return (
    <Link
      to={coordinates}
      key={coordinates}
      className="px-6 block py-1 hover:bg-gray-300 flex items-center"
    >
      {name}
      {state ? `, ${state}` : ''}, {country}
      {isNavigating && (
        <svg
          className="animate-spin ml-2 w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </Link>
  )
}
