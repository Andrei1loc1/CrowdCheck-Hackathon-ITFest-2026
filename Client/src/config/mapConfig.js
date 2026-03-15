/**
 * Map configuration - Queue locations and status settings
 * Single source of truth for map data
 */

// Queue locations with status
export const queueLocations = [
  { id: 1, name: 'Mega Mall Queue', position: [44.4268, 26.1025], status: 'liber', waitTime: '5 min' },
  { id: 2, name: 'Airport Terminal 1', position: [44.5712, 26.0847], status: 'mediu', waitTime: '20 min' },
  { id: 3, name: 'Central Station', position: [44.4419, 26.0379], status: 'plin', waitTime: '45 min' },
  { id: 4, name: 'IT FEST', position: [45.76648, 21.23082], status: 'liber', waitTime: '10 min' },
  { id: 5, name: 'Shopping District', position: [44.4512, 26.0876], status: 'mediu', waitTime: '25 min' },
]

// Status configuration with colors and labels
export const statusConfig = {
  liber: { color: '#22c55e', label: 'Liber' },
  mediu: { color: '#eab308', label: 'Mediu' },
  plin: { color: '#dc2626', label: 'Plin' }
}

// Default map settings
export const defaultMapConfig = {
  center: [44.4268, 26.1025], // Bucharest, Romania
  zoom: 13,
  zoomOnSearch: 15,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}

export default {
  queueLocations,
  statusConfig,
  defaultMapConfig
}
