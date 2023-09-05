import { Link, useNavigation } from 'react-router-dom'
import { joinCoordinates } from '../utils/coordinates'
import { City } from '../store/favourites'
import Loader from './loader'

export default function CityItem({
  name,
  coord: { lat, lon },
  main: { temp },
}: City) {
  const navigation = useNavigation()

  const coordinates = joinCoordinates(lat, lon)

  const isNavigating =
    navigation.state === 'loading' &&
    navigation.location.pathname.endsWith(coordinates)

  return (
    <Link
      to={coordinates}
      key={coordinates}
      className="h-[200px] flex justify-between rounded border m-3 px-6 py-8 block py-1 hover:bg-gray-100"
    >
      <h2 className="text-2xl font-bold flex flex-row items-center">
        {name}
        {isNavigating && <Loader className="animate-spin ml-2 w-4 h-4" />}
      </h2>
      <h1 className="text-3xl font-bold flex items-center">
        {Math.round(temp)}°
      </h1>
    </Link>
  )
}
