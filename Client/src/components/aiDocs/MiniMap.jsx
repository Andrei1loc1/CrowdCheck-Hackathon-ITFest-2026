import React from 'react'
import { MapPin, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * MiniMap Component - IMAGE VERSION
 * Clickable map image -> navigates to Map page
 * Below: location title + complete button
 */
const MiniMap = ({ 
    institution,
    onComplete 
}) => {
    if (!institution) return null

    const { name, address, position } = institution

    // Build Google Maps URL for the image
    const mapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R&q=${position[0]},${position[1]}&zoom=15`
    
    // Build full map URL for navigation
    const fullMapUrl = `/map?institution=${encodeURIComponent(name)}&lat=${position[0]}&lng=${position[1]}`

    return (
        <div className="mt-3 rounded-xl overflow-hidden border border-brand/30">
            {/* Map Image - Clickable */}
            <Link 
                to={fullMapUrl}
                className="block relative h-36 bg-gradient-to-br from-brand/20 to-bg-dark cursor-pointer group"
            >
                {/* Fake map background */}
                <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `
                        linear-gradient(rgba(26,170,100,0.4) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(26,170,100,0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: '15px 15px'
                }} />
                
                {/* Center pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg" fill="#dc2626" />
                </div>

                {/* "Click to open" overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium px-3 py-1 bg-brand rounded-lg">
                        Deschide pe hartă →
                    </span>
                </div>
            </Link>

            {/* Location Info */}
            <div className="p-3 bg-bg-dark">
                <p className="text-sm text-white font-medium">{name}</p>
                <p className="text-xs text-gray-400">{address}</p>
            </div>

            {/* Complete Button */}
            {onComplete && (
                <button
                    onClick={() => onComplete()}
                    className="w-full py-3 bg-brand text-white font-medium flex items-center justify-center gap-2 hover:bg-brand-bright transition-colors"
                >
                    <Check className="w-5 h-5" />
                    Am terminat
                </button>
            )}
        </div>
    )
}

export default MiniMap
