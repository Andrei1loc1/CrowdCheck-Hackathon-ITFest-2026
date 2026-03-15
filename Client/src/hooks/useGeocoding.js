import { useState, useCallback } from 'react'

/**
 * Custom hook for geocoding locations using Nominatim (OpenStreetMap)
 * Provides efficient location search with rate limiting
 */
const useGeocoding = () => {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Debounce timer reference
  let debounceTimer = null

  /**
   * Search for locations using Nominatim geocoding API
   * @param {string} query - The search query string
   * @param {number} limit - Maximum number of results (default: 5)
   */
  const searchLocation = useCallback(async (query, limit = 5) => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Don't search if query is too short
    if (!query || query.trim().length < 3) {
      setResults([])
      return
    }

    // Debounce the search (300ms delay)
    debounceTimer = setTimeout(async () => {
      setIsLoading(true)
      setError(null)

      try {
        const encodedQuery = encodeURIComponent(query.trim())
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=${limit}&addressdetails=1`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'ProiectITFest/1.0'
            }
          }
        )

        if (!response.ok) {
          throw new Error('Geocoding request failed')
        }

        const data = await response.json()
        
        // Transform results to a cleaner format
        const formattedResults = data.map(item => ({
          place_id: item.place_id,
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          type: item.type,
          address: item.address
        }))

        setResults(formattedResults)
      } catch (err) {
        setError(err.message)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }, [])

  /**
   * Get coordinates for a specific location by place_id
   * @param {string} placeId - The OpenStreetMap place_id
   */
  const getLocationById = useCallback(async (placeId) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/details?format=json&place_id=${placeId}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'ProiectITFest/1.0'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Location details request failed')
      }

      const data = await response.json()
      
      return {
        lat: parseFloat(data.lat),
        lon: parseFloat(data.lon),
        display_name: data.display_name,
        type: data.type
      }
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Clear search results
   */
  const clearResults = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  return {
    results,
    isLoading,
    error,
    searchLocation,
    getLocationById,
    clearResults
  }
}

export default useGeocoding
