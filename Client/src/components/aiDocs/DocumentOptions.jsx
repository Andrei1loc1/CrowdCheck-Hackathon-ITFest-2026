import React from 'react'
import { FileText, Check, MapPin } from 'lucide-react'

/**
 * Document Options Component
 * Displays selectable document options returned by AI
 */
const DocumentOptions = ({ 
    suggestions, 
    onSelectDocument,
    onViewOnMap 
}) => {
    if (!suggestions) return null

    const { isLocal, document: localDoc, documents: aiDocs } = suggestions
    
    // Use local doc or AI suggestions
    const options = isLocal 
        ? [{ ...localDoc, searchTerm: '' }]
        : aiDocs || []

    if (options.length === 0) return null

    return (
        <div className="mt-4 p-4 bg-bg-dark rounded-2xl border border-brand-subtle">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand" />
                Documente găsite:
            </h4>
            
            <div className="space-y-3">
                {options.map((doc, index) => (
                    <div 
                        key={index}
                        className="p-4 rounded-xl bg-black/30 border border-brand-light hover:border-brand/50 transition-all cursor-pointer group"
                        onClick={() => onSelectDocument(doc)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h5 className="text-white font-medium group-hover:text-brand-bright transition-colors">
                                    {doc.official}
                                </h5>
                                <p className="text-gray-400 text-sm mt-1">
                                    {doc.description}
                                </p>
                                
                                {/* Institutions */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {doc.institutions?.map((inst, i) => (
                                        <span 
                                            key={i}
                                            className="px-2 py-1 text-xs bg-brand/10 text-brand rounded-full"
                                        >
                                            {inst}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <Check className="w-5 h-5 text-brand opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        {/* Requirements */}
                        {doc.requirements && (
                            <div className="mt-3 pt-3 border-t border-brand-light">
                                <p className="text-xs text-gray-500 mb-1">Documente necesare:</p>
                                <p className="text-sm text-gray-400">
                                    {doc.requirements.join(', ')}
                                </p>
                            </div>
                        )}
                        
                        {/* View on Map Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onViewOnMap(doc)
                            }}
                            className="mt-3 w-full py-2 px-4 bg-brand/20 hover:bg-brand/30 text-brand rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <MapPin className="w-4 h-4" />
                            Vezi pe hartă
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DocumentOptions
