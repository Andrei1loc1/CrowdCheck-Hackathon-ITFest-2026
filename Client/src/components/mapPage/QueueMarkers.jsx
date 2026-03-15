import { Marker, Popup } from 'react-leaflet'
import { statusMarkers } from '../../utils/mapMarkers.js'
import { statusConfig } from '../../config/mapConfig.js'

/**
 * QueueMarkers - Renders queue location markers on the map
 * Color-coded by status (liber/mediu/plin)
 */
const QueueMarkers = ({ locations }) => {
  if (!locations || locations.length === 0) return null

  return (
    <>
      {locations.map((location) => (
        <Marker 
          key={location.id} 
          position={location.position}
          icon={statusMarkers[location.status]}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-gray-900">{location.name}</h3>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span 
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: statusConfig[location.status].color }}
                />
                <span 
                  className="font-medium"
                  style={{ color: statusConfig[location.status].color }}
                >
                  {statusConfig[location.status].label}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Timp de așteptare: {location.waitTime}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export default QueueMarkers
