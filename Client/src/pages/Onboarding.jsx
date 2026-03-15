import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Onboarding = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')

    const handleNameSubmit = () => {
        if (name.trim()) {
            navigate('/')
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                    <>
                        <h1 className="text-3xl font-bold mb-2" style={{ color: '#05D872' }}>
                            CrowdCheck
                        </h1>
                        <p className="text-gray-400 mb-10">
                            Cum te numești?
                        </p>
                        
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Numele tău"
                            className="w-full bg-transparent border-2 rounded-2xl px-5 py-3 text-xl outline-none transition-all text-center"
                            style={{ 
                                borderColor: '#1AAA64',
                                color: 'white'
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                        />
                        
                        <button
                            onClick={handleNameSubmit}
                            disabled={!name.trim()}
                            className="w-full py-3 rounded-2xl font-semibold text-lg mt-8 transition-all"
                            style={{ 
                                backgroundColor: name.trim() ? '#05D872' : 'rgba(12, 36, 25, 0.3)',
                                color: name.trim() ? 'black' : '#1AAA64',
                                border: '1px solid #1AAA64'
                            }}
                        >
                            Continuă
                        </button>
                    </>
            </div>
        </div>
    )
}

export default Onboarding
