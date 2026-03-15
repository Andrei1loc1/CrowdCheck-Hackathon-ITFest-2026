import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useSearchParams, useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import SearchBar from '../components/layout/SearchBar.jsx'
import useGeocoding from '../hooks/useGeocoding.js'
import { redMarkerIconUrl } from '../utils/mapMarkers.js'
import { queueLocations, defaultMapConfig } from '../config/mapConfig.js'
import MapController from '../components/mapPage/MapController.jsx'
import SearchResultsDropdown from '../components/mapPage/SearchResultsDropdown.jsx'
import LocationInfoCard from '../components/mapPage/LocationInfoCard.jsx'
import QueueMarkers from '../components/mapPage/QueueMarkers.jsx'

// Fix Leaflet default icon issue in Vite/React
const fixLeafletIcons = () => {
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
  L.Marker.prototype.options.icon = defaultIcon
}

/**
 * MapPage - Institution map with location search
 * Displays queue locations and allows searching for new locations
 */
const MapPage = () => {
  const [search, setSearch] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { results, isLoading, searchLocation, clearResults } = useGeocoding()
  const [showResults, setShowResults] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState(null)
  
  // Get institution from URL params
  const institutionName = searchParams.get('institution') || null
  const latParam = searchParams.get('lat')
  const lngParam = searchParams.get('lng')
  
  // Calculate center based on URL params
  const getCenterFromParams = () => {
    if (latParam && lngParam) {
      return [parseFloat(latParam), parseFloat(lngParam)]
    }
    return defaultMapConfig.center
  }
  
  // Handle search input change
  const handleSearchChange = (value) => {
    setSearch(value)
    if (value.trim().length >= 3) {
      searchLocation(value)
      setShowResults(true)
    } else {
      clearResults()
      setShowResults(false)
    }
  }
  
  // Handle location selection from search results
  const handleLocationSelect = (location) => {
    setSelectedLocation({
      lat: location.lat,
      lon: location.lon,
      display_name: location.display_name
    })
    setMapCenter([location.lat, location.lon])
    setSearch(location.display_name.split(',')[0])
    setShowResults(false)
    clearResults()
  }
  
  // Handle search submission (Enter key)
  const handleSearchSubmit = (value) => {
    if (results.length > 0) {
      handleLocationSelect(results[0])
    }
  }
  
  // Initialize Leaflet icons once on mount
  useEffect(() => {
    fixLeafletIcons()
  }, [])

  // Use URL params for center if available, or selected location
  const urlCenter = getCenterFromParams()
  const center = mapCenter || urlCenter
  const zoom = selectedLocation ? defaultMapConfig.zoomOnSearch : defaultMapConfig.zoom

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header with Search Bar */}
      <div className="p-4 pt-6 flex flex-col items-center">
        <h1 className="text-2xl mt-5 font-bold text-white text-center">INSTITUTION MAP</h1>
        <p className="text-gray-400 mt-2 text-lg mb-5">
          {institutionName ? `Instituție: ${institutionName}` : 'Ce document ai nevoie azi?'}
        </p>
        <div className="relative w-full max-w-lg">
          <SearchBar 
            value={search} 
            onChange={handleSearchChange}
            onEnter={handleSearchSubmit}
            placeholder="Caută o zonă sau locație..."
            showResults={showResults}
            redirectToDocs={false}
          />
          
          {/* Search Results Dropdown */}
          {showResults && (
            <SearchResultsDropdown
              results={results}
              isLoading={isLoading}
              onSelect={handleLocationSelect}
            />
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 px-4 pb-0">
        <div 
          className="w-full h-[calc(100vh-450px)] rounded-2xl overflow-hidden border-2"
          style={{ borderColor: 'rgba(26, 170, 100, 0.2)' }}
        >
          <MapContainer
            center={center}
            zoom={zoom}
            className="h-full w-full"
            zoomControl={true}
            scrollWheelZoom={true}
          >
            {/* Default OpenStreetMap tiles */}
            <TileLayer
              attribution={defaultMapConfig.attribution}
              url={defaultMapConfig.tileUrl}
              maxZoom={defaultMapConfig.maxZoom}
            />
            
            <MapController center={center} zoom={zoom} />

            {/* Search Result Red Marker */}
            {selectedLocation && (
              <Marker 
                position={[selectedLocation.lat, selectedLocation.lon]}
                icon={redMarkerIconUrl}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900">Locație căutată</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedLocation.display_name}</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Queue Markers */}
            <QueueMarkers locations={queueLocations} />
          </MapContainer>
        </div>
      </div>

      {/* Mini Info Card for Searched Location */}
      <LocationInfoCard location={selectedLocation} />
      
      {/* Button to navigate to Dashboard with institution */}
      {(institutionName || selectedLocation) && (
        <div className="px-4 -mt-2 pb-20 my-5">
          <button
            onClick={() => {
              const institutionToShow = institutionName || (selectedLocation?.display_name?.split(',')[0] || 'Instituție');
              navigate(`/?institution=${encodeURIComponent(institutionToShow)}`);
            }}
            className="w-full bg-brand hover:bg-brand-bright text-white font-semibold mt-5 py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Vezi timpul de așteptare
          </button>
        </div>
      )}
    </div>
  )
}

export default MapPage
