import { useState, useCallback } from 'react'
import { getDocumentInfo, getAllDocumentTypes } from '@/config/documentMapping'

/**
 * Custom hook for document search logic
 * Handles document lookup, selection flow, and chat state
 */
export const useDocumentSearch = (institutions = []) => {
    const [searchResults, setSearchResults] = useState([])
    const [selectedDocument, setSelectedDocument] = useState(null)
    const [selectedInstitution, setSelectedInstitution] = useState(null)
    const [isSearching, setIsSearching] = useState(false)

    /**
     * Search documents by query
     */
    const searchDocuments = useCallback((query) => {
        setIsSearching(true)
        
        if (!query.trim()) {
            // Show popular docs when empty
            const popular = getAllDocumentTypes().slice(0, 6)
            setSearchResults(popular)
            setIsSearching(false)
            return popular
        }

        const normalized = query.toLowerCase().trim()
        
        // Try exact match first
        const exactMatch = getDocumentInfo(normalized)
        
        if (exactMatch) {
            const results = [{ 
                searchTerm: query, 
                ...exactMatch 
            }]
            setSearchResults(results)
            setIsSearching(false)
            return results
        }

        // Search for partial matches
        const allDocs = getAllDocumentTypes()
        const results = allDocs.filter(doc => 
            doc.official.toLowerCase().includes(normalized) ||
            doc.searchTerm.includes(normalized) ||
            doc.type.includes(normalized)
        ).slice(0, 6)

        // If no matches, show default docs
        if (results.length === 0) {
            setSearchResults(allDocs.slice(0, 6))
            setIsSearching(false)
            return allDocs.slice(0, 6)
        }

        setSearchResults(results)
        setIsSearching(false)
        return results
    }, [])

    /**
     * Select a document and get its institutions
     */
    const selectDocument = useCallback((document) => {
        setSelectedDocument(document)
        
        // Get institutions for this document type
        const docInstitutions = document?.institutions?.map(name => {
            // Find matching institution from data or create from sample
            const existing = institutions.find(i => i.name === name)
            if (existing) return existing
            
            // Create sample institution
            return {
                name,
                address: 'Adresa necunoscută',
                position: [44.4268, 26.1025], // Default Bucharest
                waitTime: 'N/A',
                status: 'mediu'
            }
        }) || []

        return docInstitutions
    }, [institutions])

    /**
     * Clear search results
     */
    const clearSearch = useCallback(() => {
        setSearchResults([])
        setSelectedDocument(null)
        setSelectedInstitution(null)
    }, [])

    /**
     * Reset everything
     */
    const reset = useCallback(() => {
        setSearchResults([])
        setSelectedDocument(null)
        setSelectedInstitution(null)
        setIsSearching(false)
    }, [])

    return {
        searchResults,
        selectedDocument,
        selectedInstitution,
        isSearching,
        searchDocuments,
        selectDocument,
        setSelectedInstitution,
        clearSearch,
        reset
    }
}

export default useDocumentSearch
