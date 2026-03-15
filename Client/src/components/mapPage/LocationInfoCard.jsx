/**
 * LocationInfoCard - Shows queue status info for searched location
 * Displayed below the map after a location is selected
 */
const LocationInfoCard = ({ location, waitTime = '10 min' }) => {
  if (!location) return null

  const locationName = location.display_name?.split(',')[0] || 'Locație'
  const locationAddress = location.display_name?.split(',').slice(1, 3).join(',') || ''

  return (
    <div className="px-4 pt-2">
      <div 
        className="w-full rounded-xl p-3 border-2"
        style={{ 
          borderColor: 'rgba(26, 170, 100, 0.3)',
          backgroundColor: 'rgba(26, 170, 100, 0.1)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-base truncate">
              {locationName}
            </h3>
          </div>
          <div className="text-right ml-3 flex-shrink-0">
            <div className="flex items-center gap-1.5 justify-end">
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#22c55e' }}
              />
              <span className="text-white text-sm font-medium">Liber</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationInfoCard
