import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Outlet,
} from 'react-router-dom'
import './index.css'
import { SearchProvider } from './store/search'
import { FavouritesProvider } from './store/favourites'
import Home from './pages/home'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <FavouritesProvider>
          <SearchProvider>
            <Outlet />
          </SearchProvider>
        </FavouritesProvider>
      }
    >
      <Route index element={<Home />} />
      <Route path=":coordinates" lazy={() => import('./pages/coordinates')} />
    </Route>
  )
)

root.render(<RouterProvider router={router} />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
