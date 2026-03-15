import React from 'react'
import VerticalProgressBar from "./VerticalProgressBar.jsx";
import { weeklyDays } from '../../config/weeklyStatusConfig';

// Default data in case nothing is passed
const DEFAULT_DATA = [
    { day: "LUNI", status: "liber" },
    { day: "MARȚI", status: "mediu" },
    { day: "MIERCURI", status: "plin" },
    { day: "JOI", status: "mediu" },
    { day: "VINERI", status: "liber" },
    { day: "SAMBATA", status: "liber" },
    { day: "DUMINICA", status: "liber" },
];

const WeeklyStatus = ({ data = DEFAULT_DATA, loading = false }) => {
    // Use data from props if available, otherwise use default
    const weeklyData = data && Array.isArray(data) && data.length > 0 ? data : DEFAULT_DATA;
    
    return (
        <div className="space-y-2 px-4 py-6">
            <h2 className="text-center text-gray-400 text-base font-semibold tracking-wide uppercase text-foreground/90">
                Analiză aglomerație săptămânală
                {loading && <span className="text-xs ml-2 text-brand animate-pulse">(se încarcă...)</span>}
            </h2>

            {/* Horizontal carousel wrapper */}
            <div
                className="flex overflow-x-auto snap-x snap-mandatory gap-5 sm:gap-7 md:gap-9 px-6 py-2 touch-pan-x scrollbar-hide"
                role="list"
                aria-label="Aglomerație pe zile - derulare orizontală"
            >
                {weeklyData.map((item) => (
                    <div role="listitem" key={item.day} className="snap-center">
                        <VerticalProgressBar day={item.day} status={item.status} />
                    </div>
                ))}
            </div>
        </div>
    )
}
export default WeeklyStatus
