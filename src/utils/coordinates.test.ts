import {
  removeDuplicateCoordinates,
  joinCoordinates,
  splitCoordinates,
} from './coordinates'

describe('Coordinates Functions', () => {
  it('should join and split valid coordinates', () => {
    const lat = 12.345
    const lon = -67.893

    const joinedCoordinates = joinCoordinates(lat, lon)
    expect(joinedCoordinates).toBe('12.345,-67.893')

    const splitResult = splitCoordinates(joinedCoordinates)
    expect(splitResult).toEqual([lat.toString(), lon.toString()])
  })

  it('should throw error for invalid joinCoordinates input', () => {
    expect(() => joinCoordinates(null as any, 67.89)).toThrowError(
      'Invalid input. Both lat and lon must be numbers.'
    )

    expect(() => joinCoordinates(12.345, 'invalid' as any)).toThrowError(
      'Invalid input. Both lat and lon must be numbers.'
    )
  })

  it('should throw error for invalid splitCoordinates input', () => {
    expect(() => splitCoordinates(null as any)).toThrowError(
      'Invalid input. The input must be a valid coordinate string in the format "lat,lon".'
    )

    expect(() => splitCoordinates('12.345,invalid')).toThrowError(
      'Invalid input. The input must be a valid coordinate string in the format "lat,lon".'
    )
  })
})

describe('removeDuplicateCoordinates', () => {
  it('removes duplicates based on lat and lon', () => {
    const inputData = [
      { lat: 123, lon: 456 },
      { lat: 123, lon: 456 },
      { lat: 789, lon: 101 },
      { lat: 123, lon: 456 },
      { lat: 321, lon: 654 },
    ]

    const expectedOutput = [
      { lat: 123, lon: 456 },
      { lat: 789, lon: 101 },
      { lat: 321, lon: 654 },
    ]

    const result = removeDuplicateCoordinates(inputData)

    expect(result).toEqual(expectedOutput)
  })

  it('handles an empty array', () => {
    const inputData: any[] = []

    const result = removeDuplicateCoordinates(inputData)

    expect(result).toEqual([])
  })

  it('handles an array with no duplicates', () => {
    const inputData = [
      { lat: 123, lon: 456 },
      { lat: 789, lon: 101 },
      { lat: 321, lon: 654 },
    ]

    const expectedOutput = [...inputData]

    const result = removeDuplicateCoordinates(inputData)

    expect(result).toEqual(expectedOutput)
  })
})
