import React from 'react'
import { MapPin, FileText, ArrowRight } from 'lucide-react'

/**
 * ChatMessages component - Displays chat message history
 */
const ChatMessages = ({ messages, onSuggestionClick, onInstitutionClick }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
        <div className="text-center">
          <p className="text-lg mb-2">👋 Bun venit!</p>
          <p className="text-sm">Cum te pot ajuta azi?</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {msg.role === 'user' ? (
              <p className="text-sm">{msg.content}</p>
            ) : (
              <MessageContent 
                content={msg.content} 
                suggestions={msg.suggestions}
                institution={msg.institution}
                workflow={msg.workflow}
                onSuggestionClick={onSuggestionClick}
                onInstitutionClick={onInstitutionClick}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * MessageContent - Renders AI response content with suggestions/institutions
 */
const MessageContent = ({ content, suggestions, institution, workflow, onSuggestionClick, onInstitutionClick }) => {
  return (
    <div className="text-sm">
      {/* Main content */}
      <p className="mb-3">{content}</p>
      
      {/* Document suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="font-semibold text-xs opacity-75">Documente necesare:</p>
          {suggestions.map((doc, idx) => (
            <button
              key={idx}
              onClick={() => onSuggestionClick(doc)}
              className="flex items-center gap-2 w-full text-left p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <FileText size={14} />
              <span>{doc}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Institution recommendation */}
      {institution && (
        <button
          onClick={() => onInstitutionClick(institution)}
          className="flex items-center gap-2 w-full text-left p-2 mt-2 bg-green-500/30 rounded-lg hover:bg-green-500/40 transition-colors"
        >
          <MapPin size={14} />
          <div className="flex flex-col items-start">
            <span className="font-semibold">{institution.name}</span>
            <span className="text-xs opacity-75">{institution.address}</span>
          </div>
        </button>
      )}
      
      {/* Workflow steps */}
      {workflow && workflow.steps && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <p className="font-semibold text-xs mb-2 opacity-75">Pași de urmat:</p>
          <div className="space-y-1">
            {workflow.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <span className="font-bold">{idx + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Simple suggestions for quick actions */}
      {suggestions && suggestions.length === 0 && !institution && (
        <div className="flex flex-wrap gap-2 mt-2">
          {['Cum înmatriculez o mașină?', 'Ce acte pentru pașaport?', 'Unde schimb buletinul?'].map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSuggestionClick(suggestion)}
              className="flex items-center gap-1 text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowRight size={12} />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChatMessages
