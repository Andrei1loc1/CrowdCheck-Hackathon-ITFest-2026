/**
 * Configuration for HourlyStatus component
 * Shows congestion levels by hour of the day
 */

export const hourlyData = [
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
]

// Status configuration with colors
export const statusConfig = {
    liber: { 
        bgClass: 'bg-status-liber', 
        glowClass: 'shadow-[0_0_8px_rgba(34,197,94,0.5)]',
        label: 'Liber' 
    },
    mediu: { 
        bgClass: 'bg-status-mediu', 
        glowClass: 'shadow-[0_0_8px_rgba(234,179,8,0.5)]',
        label: 'Mediu' 
    },
    plin: { 
        bgClass: 'bg-status-plin', 
        glowClass: 'shadow-[0_0_8px_rgba(220,38,38,0.5)]',
        label: 'Plin' 
    },
}
