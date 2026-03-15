import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

/**
 * MapController - Controls map view (center and zoom)
 * Reusable component for programmatic map control
 */
const MapController = ({ center, zoom = 13 }) => {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom)
    }
  }, [center, zoom, map])
  
  return null
}

export default MapController
