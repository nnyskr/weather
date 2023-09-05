export function joinCoordinates(lat: number, lon: number) {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Invalid input. Both lat and lon must be numbers.')
  }

  return `${lat},${lon}`
}

export function splitCoordinates(coordinates: string) {
  if (
    typeof coordinates !== 'string' ||
    !/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(coordinates)
  ) {
    throw new Error(
      'Invalid input. The input must be a valid coordinate string in the format "lat,lon".'
    )
  }

  const [lat, lon] = coordinates.split(',')
  return [lat, lon]
}

export function removeDuplicateCoordinates<
  T extends { lat: number; lon: number }
>(data: T[]) {
  const uniqueCoordinates = new Set()
  const result = data.filter((item) => {
    const coordinateKey = joinCoordinates(item.lat, item.lon)
    if (!uniqueCoordinates.has(coordinateKey)) {
      uniqueCoordinates.add(coordinateKey)
      return true
    }
    return false
  })
  return result
}
