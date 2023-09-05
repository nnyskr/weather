import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useCallback,
} from 'react'
import { getCity } from '../api/weather'

export interface City {
  id: number
  name: string
  coord: {
    lon: number
    lat: number
  }
  main: {
    temp: number
    temp_min: number
    temp_max: number
    pressure: number
  }
  wind: { speed: number; deg: number }
}

interface FavouritesState {
  favouriteCitiesIds: Record<string, boolean>
  cities: City[] | null
  isLoadingCities: boolean
}

type FavouritesAction =
  | { type: 'TOGGLE_FAVOURITE'; payload: number }
  | { type: 'GET_CITIES' }
  | {
      type: 'GET_CITIES_SUCCESS'
      payload: City[]
    }
  | { type: 'GET_CITIES_FAILURE' }

const initialState: FavouritesState = {
  favouriteCitiesIds: { 2643743: true },
  cities: null,
  isLoadingCities: false,
}

const FavouritesContext = createContext<
  | {
      favouriteCitiesIds: FavouritesState['favouriteCitiesIds']
      cities: FavouritesState['cities']
      isLoadingCities: FavouritesState['isLoadingCities']
      isCityFavourite: (id: number) => boolean
      toggleFavourite: (id: number) => void
      getCities: () => void
    }
  | undefined
>(undefined)

const favouritesReducer = (
  state: FavouritesState,
  action: FavouritesAction
): FavouritesState => {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE':
      return {
        ...state,
        favouriteCitiesIds: {
          ...state.favouriteCitiesIds,
          [action.payload]: !state.favouriteCitiesIds[action.payload],
        },
      }
    case 'GET_CITIES':
      return { ...state, isLoadingCities: true }
    case 'GET_CITIES_SUCCESS':
      return {
        ...state,
        cities: action.payload,
        isLoadingCities: false,
      }
    case 'GET_CITIES_FAILURE':
      return { ...state, isLoadingCities: false }
    default:
      return state
  }
}

export const FavouritesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(favouritesReducer, initialState)

  const isCityFavourite = useCallback(
    (id: number) => {
      return !!state.favouriteCitiesIds[id]
    },
    [dispatch, state.favouriteCitiesIds]
  )

  const toggleFavourite = useCallback(
    (id: number) => {
      dispatch({ type: 'TOGGLE_FAVOURITE', payload: id })
    },
    [dispatch]
  )

  const getCities = useCallback(async () => {
    dispatch({ type: 'GET_CITIES' })

    try {
      const responses = await Promise.all(
        Object.keys(state.favouriteCitiesIds)
          .filter((id) => state.favouriteCitiesIds[id])
          .map((id) => getCity({ cityId: id }))
      )
      const cities = await Promise.all(
        responses.map(async (res) => {
          return await res.json()
        })
      )
      dispatch({ type: 'GET_CITIES_SUCCESS', payload: cities })
    } catch {
      dispatch({ type: 'GET_CITIES_FAILURE' })
    }
  }, [dispatch, state.favouriteCitiesIds])

  return (
    <FavouritesContext.Provider
      value={{
        favouriteCitiesIds: state.favouriteCitiesIds,
        cities: state.cities,
        isLoadingCities: state.isLoadingCities,
        isCityFavourite,
        toggleFavourite,
        getCities,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  )
}

export const useFavourites = () => {
  const context = useContext(FavouritesContext)
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider')
  }
  return context
}
