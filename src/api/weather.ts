const API_URL = 'https://api.openweathermap.org'
const API_KEY = '413c97d858f65bf4e52deeb8823e05da'

export const endpoints = {
  searchForCity: (query: string) =>
    `${API_URL}/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`,
  weatherForCity: (cityId: string) =>
    `${API_URL}/data/2.5/weather?id=${cityId}&units=metric&appid=${API_KEY}`,
  weatherForCoordinates: (lat: string, lon: string) =>
    `${API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  forecastForCoordinates: (lat: string, lon: string) =>
    `${API_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
}

export const getCities = async (
  { query }: { query: string },
  options?: RequestInit
) => fetch(endpoints.searchForCity(query), options)

export const getCity = async (
  { cityId }: { cityId: string },
  options?: RequestInit
) => fetch(endpoints.weatherForCity(cityId), options)

export const getWeatherForCoordinates = async (
  { lat, lon }: { lat: string; lon: string },
  options?: RequestInit
) => fetch(endpoints.weatherForCoordinates(lat, lon), options)

export const getForecastForCoordinates = async (
  { lat, lon }: { lat: string; lon: string },
  options?: RequestInit
) => fetch(endpoints.forecastForCoordinates(lat, lon), options)
