import React from 'react'
import { queueStatusDefaults } from '../../config/queueStatusConfig'

const QueueStatusCard = ({ 
    institution = queueStatusDefaults.institution, 
    desk = queueStatusDefaults.desk, 
    waitTime = queueStatusDefaults.waitTime, 
    status = queueStatusDefaults.status,
    loading = false,
    error = null,
    onRefresh = null
}) => {
    return (
        <div className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
            {/* Top section */}
            <div className="text-center w-full">
                <p className="text-gray-500 text-xs uppercase tracking-wider">
                    Instituția Frecventa
                </p>
                <h2 className="text-base font-semibold text-white mt-0.5">
                    {institution} - {desk}
                </h2>
            </div>

            {/* Center circle with gradient/glow - modern dark green */}
            <div className="relative">
                <div className="w-56 h-56 rounded-full bg-brand-gradient flex flex-col items-center justify-center shadow-brand-glow border border-brand/30">
                    {loading ? (
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
                            <span className="text-brand text-xs mt-2">Se încarcă...</span>
                        </div>
                    ) : (
                        <>
                            <span className="text-5xl font-bold text-brand">
                                {waitTime}
                            </span>
                            <span className="text-brand text-sm mt-0.5 font-medium">
                                MINUTE
                            </span>
                            <span className="mt-2 px-3 py-1 bg-brand/20 rounded-full text-brand text-xs font-semibold">
                                {status}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Error message */}
            {error && (
                <p className="text-red-400 text-xs px-4 text-center">
                    Eroare: {error}
                </p>
            )}

            {/* Status button - with bg and border like searchbar */}
            <button
                onClick={onRefresh}
                disabled={loading}
                className="max-w-sm flex items-center justify-center gap-2 bg-bg-dark border-2 rounded-xl px-3 text-xs text-white tracking-wide font-mono transition-all hover:shadow-brand-glow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: 'rgba(26,170,100,0.3)' }}
            >
                <span className={`text-2xl leading-none ${loading ? 'text-gray-500' : 'text-green-500'}`}>
                    •
                </span>
                <span className="font-semibold">
                    {loading ? 'SE ACTUALIZEAZĂ' : 'STATUS ÎN TIMP REAL'}
                </span>
            </button>

        </div>
    )
}

export default QueueStatusCard
