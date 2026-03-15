import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, X } from 'lucide-react'

/**
 * Chat Interface Component for AI Docs page
 * Matches the app's green-dark theme
 */
const ChatInterface = ({ 
    messages, 
    onSendMessage, 
    isLoading, 
    onClearChat,
    placeholder = "Ce document cauți? (ex: buletin, pașaport, permis)"
}) => {
    const [input, setInput] = useState('')
    const messagesEndRef = useRef(null)

    // Auto-scroll to bottom when new messages appear
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim())
            setInput('')
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-brand-subtle">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">AI Assistant</h3>
                        <p className="text-xs text-gray-400">Te ajută să găsești documentele</p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button 
                        onClick={onClearChat}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        title="Șterge conversația"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-4">
                            <Bot className="w-8 h-8 text-brand" />
                        </div>
                        <h4 className="text-lg font-medium text-white mb-2">
                            Bun venit la AI Docs! 👋
                        </h4>
                        <p className="text-gray-400 text-sm max-w-xs">
                            Spune-mi ce document ai nevoie și te voi ajuta să găsești 
                            denumirea oficială și instituția potrivită.
                        </p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div 
                            key={index}
                            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-brand" />
                                </div>
                            )}
                            <div 
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                    msg.role === 'user'
                                        ? 'bg-brand text-white rounded-br-md'
                                        : 'bg-bg-dark border border-brand-subtle text-gray-200 rounded-bl-md'
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-brand-bright/20 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-brand-bright" />
                                </div>
                            )}
                        </div>
                    ))
                )}
                
                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-brand" />
                        </div>
                        <div className="bg-bg-dark border border-brand-subtle rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-brand-subtle">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={placeholder}
                        disabled={isLoading}
                        className="w-full bg-bg-dark border-2 rounded-2xl px-5 py-3 pr-12 text-white outline-none transition-all disabled:opacity-50"
                        style={{
                            borderColor: input ? 'rgba(26, 170, 100, 0.5)' : 'rgba(26, 170, 100, 0.2)'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-brand text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-bright transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChatInterface
