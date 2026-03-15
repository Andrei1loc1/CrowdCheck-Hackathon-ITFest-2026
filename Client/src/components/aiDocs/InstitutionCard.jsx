import React from 'react'
import { MapPin, Clock, ArrowRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * Institution Card Component
 * Displays institution details with map navigation
 */
const InstitutionCard = ({ 
    document,
    onClose 
}) => {
    if (!document) return null

    // Sample institutions with coordinates for demo
    const sampleInstitutions = [
        { name: 'SPCLEP Sector 1', address: 'Bulevдул Preed-meridian 1', position: [44.4268, 26.1025], waitTime: '10 min' },
        { name: 'SPCLEP Sector 2', address: 'Bulevдул Carol I', position: [44.4468, 26.1525], waitTime: '15 min' },
        { name: 'Primăria București', address: 'Palatul Primăriei', position: [44.4368, 26.1025], waitTime: '20 min' },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Card */}
            <div className="relative w-full max-w-md bg-bg-dark border-t border-brand-subtle rounded-t-3xl max-h-[80vh] overflow-y-auto">
                {/* Handle bar */}
                <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mt-3" />
                
                {/* Header */}
                <div className="p-4 border-b border-brand-subtle">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-semibold text-lg">
                                {document.official}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Alege instituția unde vrei să mergi
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10"
                        >
                            <span className="text-gray-400">✕</span>
                        </button>
                    </div>
                </div>

                {/* Institution List */}
                <div className="p-4 space-y-3">
                    {sampleInstitutions.map((inst, index) => (
                        <Link
                            key={index}
                            to={`/map?institution=${encodeURIComponent(inst.name)}&lat=${inst.position[0]}&lng=${inst.position[1]}`}
                            className="block p-4 rounded-xl bg-black/40 border border-brand-light hover:border-brand/50 transition-all group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="text-white font-medium group-hover:text-brand-bright transition-colors">
                                        {inst.name}
                                    </h4>
                                    <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {inst.address}
                                    </p>
                                    
                                    {/* Status indicator */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-status-liber/20 text-status-liber rounded-full">
                                            <Clock className="w-3 h-3" />
                                            {inst.waitTime}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-brand/20 text-brand rounded-full">
                                            Liber
                                        </span>
                                    </div>
                                </div>
                                
                                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-brand-bright group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Info text */}
                <div className="px-4 pb-6">
                    <p className="text-xs text-gray-500 text-center">
                        Apasă pe o instituție pentru a o vizualiza pe hartă
                    </p>
                </div>
            </div>
        </div>
    )
}

export default InstitutionCard
