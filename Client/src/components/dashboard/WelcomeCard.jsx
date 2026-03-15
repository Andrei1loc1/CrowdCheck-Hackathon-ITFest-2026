import React from 'react'
import SearchBar from '../layout/SearchBar.jsx'

const WelcomeCard = ({ name }) => {
    const [search, setSearch] = React.useState('')

    return (
        <div className="flex flex-col items-center p-6 gap-6 w-full max-w-xl mx-auto">
            {/* Welcome text with glow effect */}
            <div className="text-center w-full">
                <h1 className="text-3xl mt-5 font-bold text-white">
                    Buna, {name || 'prietene'}!
                </h1>
                <p className="text-gray-400 mt-2 text-lg">
                    Ce document ai nevoie azi?
                </p>
            </div>

            {/* Search bar */}
            <SearchBar 
                value={search}
                onChange={setSearch}
                placeholder="Caută ce ai nevoie..."
            />
        </div>
    )
}

export default WelcomeCard
