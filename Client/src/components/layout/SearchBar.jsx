import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Caută ce ai nevoie...",
  className = "",
  showResults = false,
  redirectToDocs = true,
  onEnter = null
}) => {
  const navigate = useNavigate()
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (onEnter) {
        // Custom Enter handler for map search
        onEnter(value)
      } else if (value.trim() && redirectToDocs) {
        navigate(`/docs?query=${encodeURIComponent(value.trim())}`)
      }
    }
  }
  
  const handleChange = (e) => {
    onChange(e.target.value)
  }
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="#1AAA64" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={3}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-bg-dark border-2 rounded-2xl px-12 py-3.5 text-lg outline-none transition-all cursor-pointer"
        style={{
          borderColor: 'rgba(26,170,100,0.1)',
          color: 'white',
          boxShadow: value ? '0 0 20px rgba(5, 216, 114, 0.2)' : 'none'
        }}
      />
    </div>
  )
}

export default SearchBar
