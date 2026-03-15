/**
 * SearchResultsDropdown - Displays geocoding search results
 * Shows location suggestions as user types
 */
const SearchResultsDropdown = ({ results, isLoading, onSelect }) => {
  if (isLoading) {
    return (
      <div className="absolute z-[9999] w-full max-w-lg top-full mt-2 bg-gray-900 border-2 rounded-xl border-green-500/30 p-4">
        <p className="text-gray-400 text-sm">Se caută...</p>
      </div>
    )
  }

  if (!results || results.length === 0) {
    return null
  }

  return (
    <div className="absolute z-[9999] w-full max-w-lg top-full mt-2 bg-gray-900 border-2 rounded-xl border-green-500/30 shadow-lg max-h-60 overflow-y-auto">
      {results.map((result) => (
        <button
          key={result.place_id}
          onClick={() => onSelect(result)}
          className="w-full text-left px-4 py-3 hover:bg-green-500/20 border-b border-gray-800 last:border-b-0 transition-colors"
        >
          <p className="text-white text-sm font-medium truncate">
            {result.display_name.split(',')[0]}
          </p>
          <p className="text-gray-400 text-xs truncate">
            {result.display_name}
          </p>
        </button>
      ))}
    </div>
  )
}

export default SearchResultsDropdown
