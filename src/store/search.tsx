import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useCallback,
} from 'react'
import debounce from 'lodash/debounce'
import { getCities } from '../api/weather'
import { removeDuplicateCoordinates } from '../utils/coordinates'

export interface CityResult {
  name: string
  lat: number
  lon: number
  local_names?: Record<string, string>
  state?: string
  country: string
}

interface SearchState {
  searchQuery: string
  results: CityResult[] | null
  isLoadingResults: boolean
}

type SearchAction =
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'GET_SEARCH_RESULTS' }
  | { type: 'GET_SEARCH_RESULTS_SUCCESS'; payload: CityResult[] }
  | { type: 'GET_SEARCH_RESULTS_FAILURE' }

const initialState: SearchState = {
  searchQuery: '',
  results: null,
  isLoadingResults: false,
}

const SearchContext = createContext<
  | {
      searchQuery: string
      results: CityResult[] | null
      isLoadingResults: boolean
      performSearch: (query: string) => void
    }
  | undefined
>(undefined)

const searchReducer = (
  state: SearchState,
  action: SearchAction
): SearchState => {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'GET_SEARCH_RESULTS':
      return { ...state, isLoadingResults: true }
    case 'GET_SEARCH_RESULTS_SUCCESS':
      return {
        ...state,
        results: removeDuplicateCoordinates(action.payload),
        isLoadingResults: false,
      }
    case 'GET_SEARCH_RESULTS_FAILURE':
      return { ...state, isLoadingResults: false }
    default:
      return state
  }
}

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(searchReducer, initialState)
  const abortController = new AbortController()

  const performSearchDebounced = useCallback(
    debounce(async (query: string) => {
      dispatch({ type: 'GET_SEARCH_RESULTS' })

      try {
        const response = await getCities(
          { query },
          { signal: abortController.signal }
        )

        if (response.ok) {
          const data = await response.json()
          dispatch({ type: 'GET_SEARCH_RESULTS_SUCCESS', payload: data })
        } else {
          throw new Error('API request failed')
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('API request error:', error)
          dispatch({ type: 'GET_SEARCH_RESULTS_FAILURE' })
        }
      }
    }, 500),
    []
  )

  const performSearch = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
    if (query) {
      performSearchDebounced(query)
    }
  }

  return (
    <SearchContext.Provider
      value={{
        searchQuery: state.searchQuery,
        results: state.results,
        isLoadingResults: state.isLoadingResults,
        performSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
