import React from 'react'
import { statusConfig } from '../../config/hourlyStatusConfig'

// Default data in case nothing is passed
const DEFAULT_DATA = [
    { hour: "08", status: "liber" },
    { hour: "09", status: "mediu" },
    { hour: "10", status: "plin" },
    { hour: "11", status: "plin" },
    { hour: "12", status: "mediu" },
    { hour: "13", status: "liber" },
    { hour: "14", status: "mediu" },
    { hour: "15", status: "plin" },
    { hour: "16", status: "mediu" },
    { hour: "17", status: "liber" },
];

const HourlyStatus = ({ data = DEFAULT_DATA, loading = false }) => {
    // Current hour (from real time)
    const currentHour = new Date().getHours();
    
    // Use data from props if available, otherwise use default
    const hourlyData = data && Array.isArray(data) && data.length > 0 ? data : DEFAULT_DATA;
    
    // Calculate pin position (0-100%)
    const totalHours = 17 - 8 // 8 to 17 = 9 hours range
    const pinPosition = ((currentHour - 8) / totalHours) * 100

    return (
        <div className="px-4 py-4 mt-5">
            <h2 className="text-center text-gray-400 text-base font-semibold tracking-wide uppercase text-foreground/90 mb-4">
                AGLOMERAȚIE ORARĂ
                {loading && <span className="text-xs ml-2 text-brand animate-pulse">(se încarcă...)</span>}
            </h2>

            {/* Timeline with hours */}
            <div className="relative flex items-center">
                {/* Start time */}
                <span className="text-sm text-gray-200 font-medium mr-3">08</span>
                
                {/* Bar container */}
                <div className="relative flex-1 h-4">
                    {/* Background gradient bar */}
                    <div className="absolute inset-0 flex rounded-full overflow-hidden bg-gray-800/50">
                        {hourlyData.map((item, index) => {
                            const config = statusConfig[item.status] || statusConfig.liber
                            return (
                                <div 
                                    key={index}
                                    className={`flex-1 ${config.bgClass} opacity-90`}
                                />
                            )
                        })}
                    </div>

                    {/* Pin indicator - map pin style */}
                    <div 
                        className="absolute z-10"
                        style={{ left: `calc(${pinPosition}% - 8px)`, top: '-16px' }}
                    >
                        {/* Map pin shape */}
                        <svg 
                            width="16" 
                            height="22" 
                            viewBox="0 0 24 32" 
                            fill="none" 
                            className="drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                        >
                            <path 
                                d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" 
                                fill="white" 
                            />
                            <circle 
                                cx="12" 
                                cy="12" 
                                r="5" 
                                fill="#1AAA64" 
                            />
                        </svg>
                        {/* Pointer triangle */}
                        <div 
                            className="absolute left-1/2 -translate-x-1/2 -bottom-1"
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: '6px solid transparent',
                                borderRight: '6px solid transparent',
                                borderTop: '6px solid white'
                            }}
                        />
                    </div>
                </div>

                {/* End time */}
                <span className="text-sm text-gray-200 font-medium ml-3">17</span>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-status-liber" />
                    <span className="text-xs text-gray-500">Liber</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-status-mediu" />
                    <span className="text-xs text-gray-500">Mediu</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-status-plin" />
                    <span className="text-xs text-gray-500">Plin</span>
                </div>
            </div>
        </div>
    )
}
export default HourlyStatus
