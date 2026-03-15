import React from 'react'

const VerticalProgressBar = ({ day, status }) => {
    const statusConfig = {
        liber: { color: 'bg-status-liber', value: 25, label: 'LIBER' },
        mediu: { color: 'bg-status-mediu', value: 60, label: 'MEDIU' },
        plin: { color: 'bg-status-plin', value: 92, label: 'PLIN' },
    };

    const { color, value, label } = statusConfig[status] || { color: 'bg-gray-500', value: 0, label: 'NECUNOSCUT' };

    return (
        <div className="flex-shrink-0 w-20 sm:w-24 md:w-28 flex flex-col items-center gap-1.5 bg-brand/20 p-4 rounded-2xl border-1 snap-center" style={{ borderColor: 'rgba(26,170,100,0.2)' }}>
            <span className="text-sm font-medium text-gray-400 truncate">{day}</span>

            <div className="relative h-28 w-5 rounded-full overflow-hidden bg-gray-800/50 border border-gray-700 shadow-sm">
                <div
                    className={`absolute bottom-0 left-0 right-0 ${color} transition-all duration-1000 ease-out rounded-full`}
                    style={{ height: `${value}%` }}
                />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-white">{label}</span>
        </div>
    );
}
export default VerticalProgressBar
