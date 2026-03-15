import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Send, Bot, User, X, FileText, MapPin, Navigation, ListChecks, RefreshCw } from 'lucide-react'
import { usePersistentChat } from '@/hooks/usePersistentChat'
import { getDocumentInfo, getAllDocumentTypes } from '@/config/documentMapping'
import { findWorkflowTemplate, getAllWorkflows } from '@/config/workflowTemplates'
import { aiConfig } from '@/config/aiConfig'
import { institutions, getInstitutionForDocument } from '@/config/institutions'
import { parseAIResponse, isWorkflowQuery } from '@/utils/aiResponseParser'
import MiniMap from '@/components/aiDocs/MiniMap'
import WorkflowSteps from '@/components/aiDocs/WorkflowSteps'
import ChatMessages from '@/components/aiDocs/ChatMessages'

/**
 * AI Docs Page - Interactive problem-solving chat interface
 */
const AI_Docs = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const initialQuery = searchParams.get('query') || ''
    
    // Use persistent chat state (survives page navigation)
    const {
        messages,
        currentWorkflow,
        completedSteps,
        addMessage,
        setMessages,
        setCurrentWorkflow,
        completeStep,
        clearChat,
        resetWorkflow
    } = usePersistentChat('ai-docs-chat')
    
    // Local state (doesn't need to persist - these are UI state only)
    const [input, setInput] = useState(initialQuery)
    const [selectedStep, setSelectedStep] = useState(null)
    const [showMinimap, setShowMinimap] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const messagesEndRef = useRef(null)
    
    /**
     * Send message to AI and handle response
     */
    const sendMessage = useCallback(async (userMessage) => {
        console.log('AI Docs: Processing message:', userMessage)
        setIsLoading(true)
        setError(null)

        // Add user message to chat
        const userMsg = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: userMessage
        }
        addMessage(userMsg)

        // FIRST: Try to call OpenRouter AI API
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
        
        if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
            try {
                console.log('AI Docs: Calling OpenRouter API...')
                
                const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'Queue Management AI Docs'
                    },
                    body: JSON.stringify({
                        model: aiConfig.model,
                        messages: [
                            { role: 'system', content: aiConfig.systemPrompt },
                            { role: 'user', content: userMessage }
                        ],
                        temperature: 0.3,
                        max_tokens: 1000
                    })
                })

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`)
                }

                const data = await response.json()
                const aiResponse = data.choices[0].message.content
                console.log('AI Docs: Raw AI response:', aiResponse)

                // Parse the JSON response from AI
                try {
                    // Try to extract JSON from response (might have markdown code blocks or text before/after)
                    let jsonStr = aiResponse.trim()
                    
                    // Check if response starts with { (JSON object)
                    if (jsonStr.startsWith('{')) {
                        // Find the matching closing brace
                        let braceCount = 0
                        let endIdx = jsonStr.length
                        for (let i = 0; i < jsonStr.length; i++) {
                            if (jsonStr[i] === '{') braceCount++
                            if (jsonStr[i] === '}') braceCount--
                            if (braceCount === 0) {
                                endIdx = i + 1
                                break
                            }
                        }
                        jsonStr = jsonStr.substring(0, endIdx)
                    }
                    
                    // Remove markdown code blocks if present
                    if (jsonStr.includes('```json')) {
                        jsonStr = jsonStr.replace(/```json\s*/, '').replace(/```$/, '')
                    } else if (jsonStr.includes('```')) {
                        jsonStr = jsonStr.replace(/```\s*/, '').replace(/```$/, '')
                    }
                    
                    const parsed = JSON.parse(jsonStr)
                    
                    if (parsed.type === 'workflow') {
                        setCurrentWorkflow(parsed)
                        const responseMsg = {
                            id: `assistant-${Date.now()}`,
                            role: 'assistant',
                            type: 'workflow',
                            content: parsed.description,
                            workflow: parsed
                        }
                        addMessage(responseMsg)
                        setIsLoading(false)
                        return
                    } else if (parsed.type === 'single-document') {
                        setCurrentWorkflow(null)
                        const responseMsg = {
                            id: `assistant-${Date.now()}`,
                            role: 'assistant',
                            type: 'single-document',
                            content: parsed.description || '',
                            document: parsed,
                            documentName: parsed.document || 'Document',
                            institutions: parsed.institution
                        }
                        addMessage(responseMsg)
                        setIsLoading(false)
                        return
                    }
                } catch (parseErr) {
                    console.error('AI Docs: Failed to parse AI response:', parseErr)
                    // Continue to fallback
                }
            } catch (apiErr) {
                console.error('AI Docs: API call failed:', apiErr)
                // Continue to fallback
            }
        } else {
            console.log('AI Docs: No API key, using local templates')
        }

        // SECOND: Fallback to local templates if API failed or no API key
        console.log('AI Docs: Trying local templates...')
        const localWorkflow = findWorkflowTemplate(userMessage)
        console.log('AI Docs: Found workflow:', localWorkflow)

        if (localWorkflow) {
            setCurrentWorkflow(localWorkflow)
            const responseMsg = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                type: 'workflow',
                content: localWorkflow.description,
                workflow: localWorkflow
            }
            addMessage(responseMsg)
            setIsLoading(false)
            return
        }

        // Check for simple document lookup
        const localDoc = getDocumentInfo(userMessage)
        if (localDoc) {
            setCurrentWorkflow(null)
            const responseMsg = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                type: 'single-document',
                content: localDoc.description || '',
                document: localDoc,
                documentName: localDoc.official || 'Document',
                institutions: localDoc.institutions
            }
            addMessage(responseMsg)
            setIsLoading(false)
            return
        }

        // Show suggestions
        const workflows = getAllWorkflows().slice(0, 3)
        const responseMsg = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            type: 'suggestions',
            content: 'Nu am găsit exact ce cauți. Alege un proces:',
            suggestions: workflows
        }
        addMessage(responseMsg)
        setIsLoading(false)
    }, [addMessage, setCurrentWorkflow])

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, selectedStep, showMinimap])
    
    // Ref to track if initial query was already sent (prevents duplicate in Strict Mode)
    const initialQuerySent = useRef(false)
    
    // Handle initial query from URL
    useEffect(() => {
        if (initialQuery && !initialQuerySent.current) {
            initialQuerySent.current = true
            sendMessage(initialQuery)
        }
    }, [initialQuery, sendMessage])
    
    /**
     * Handle sending a message
     */
    const handleSendMessage = useCallback(() => {
        if (!input.trim() || isLoading) return
        setShowMinimap(false)
        setSelectedStep(null)
        sendMessage(input.trim())
        setInput('')
    }, [input, isLoading, sendMessage])
    
    /**
     * Handle key press
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSendMessage()
    }
    
    /**
     * Handle clicking on a workflow step
     */
    const handleStepClick = (step) => {
        setSelectedStep(step)
        setShowMinimap(true)
    }
    
    /**
     * Handle clicking on a single document
     */
    const handleDocumentClick = (document) => {
        // Handle different document formats
        const docName = document?.document || document?.official || document
        const institution = getInstitutionForDocument(docName)
        setSelectedStep({
            document: docName,
            institution: document?.institutions?.[0] || document?.institution?.name || 'Instituție',
            description: document?.description || ''
        })
        // Create a fake institution object for the minimap
        setShowMinimap(true)
    }
    
    /**
     * Mark current step as completed and show workflow again
     */
    const handleStepComplete = () => {
        if (selectedStep) {
            completeStep(selectedStep.id || selectedStep.document)
        }
        setShowMinimap(false)
    }
    
    /**
     * Navigate to full map
     */
    const handleNavigate = (institution) => {
        navigate(`/map?institution=${encodeURIComponent(institution.name)}&lat=${institution.position[0]}&lng=${institution.position[1]}`)
    }
    
    /**
     * Clear chat
     */
    const handleClearChat = () => {
        clearChat()
        setShowMinimap(false)
        setSelectedStep(null)
    }
    
    /**
     * Get institution for minimap
     */
    const getMinimapInstitution = () => {
        if (selectedStep?.institution) {
            // Check if it's already an institution object
            if (selectedStep.institution.position) {
                return selectedStep.institution
            }
            // Try to find matching institution
            const found = institutions.find(i => 
                i.name.toLowerCase().includes(selectedStep.institution.toLowerCase())
            )
            if (found) return found
            // Create mock institution
            return {
                name: selectedStep.institution,
                address: 'Adresanecunoscută',
                position: [44.4268, 26.1025],
                waitTime: 'N/A',
                status: 'mediu'
            }
        }
        return institutions[0]
    }
    
    /**
     * Render message content based on type
     */
    const renderMessageContent = (msg) => {
        // Workflow message
        if (msg.type === 'workflow') {
            return (
                <div>
                    <p className="text-sm mb-3">{msg.content}</p>
                    <WorkflowSteps 
                        workflow={msg.workflow}
                        completedSteps={completedSteps}
                        onStepClick={handleStepClick}
                        onStepComplete={handleStepComplete}
                    />
                </div>
            )
        }
        
        // Single document message - SIMPLIFIED
        if (msg.type === 'single-document') {
            const docName = msg.documentName || (typeof msg.document === 'string' ? msg.document : 'Document')
            return (
                <div>
                    <button
                        onClick={() => handleDocumentClick(msg.document)}
                        className="w-full p-4 rounded-xl bg-brand/10 border border-brand hover:bg-brand/20 text-brand text-sm flex items-center justify-center gap-2 transition-all"
                    >
                        <MapPin className="w-4 h-4" />
                        📍 {docName}
                    </button>
                </div>
            )
        }
        
        // Document suggestions
        if (msg.type === 'document-suggestions') {
            return (
                <div>
                    <p className="text-sm mb-3">{msg.content}</p>
                    <div className="space-y-2">
                        {msg.documents?.map((doc, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleDocumentClick(doc)}
                                className="w-full p-3 rounded-lg bg-black/30 border border-brand-light hover:border-brand text-left transition-all flex items-center gap-2"
                            >
                                <FileText className="w-4 h-4 text-brand flex-shrink-0" />
                                <span className="text-white text-sm">{doc.official}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )
        }
        
        // Suggestions (workflow suggestions)
        if (msg.type === 'suggestions') {
            return (
                <div>
                    <p className="text-sm mb-3">{msg.content}</p>
                    <div className="space-y-2">
                        {msg.suggestions?.map((workflow, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setInput(workflow.title)
                                    sendMessage(workflow.title)
                                }}
                                className="w-full p-3 rounded-lg bg-black/30 border border-brand-light hover:border-brand text-left transition-all flex items-center gap-2"
                            >
                                <ListChecks className="w-4 h-4 text-brand flex-shrink-0" />
                                <span className="text-white text-sm">{workflow.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )
        }
        
        // Regular text message
        return (
            <p className="text-sm">
                {msg.content}
            </p>
        )
    }
    
    // Get current workflow from last message if not set
    const lastWorkflowMsg = messages.findLast(m => m.type === 'workflow')
    const activeWorkflow = lastWorkflowMsg?.workflow || currentWorkflow
    
    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-black">
            {/* Header */}
            <div className="p-4 border-b border-brand-subtle">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-brand" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">AI DOCS</h3>
                            <p className="text-xs text-gray-400">Te ajut să rezolvi problemele</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeWorkflow && messages.length > 0 && (
                            <button 
                                onClick={resetWorkflow}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                title="Începe un nou proces"
                            >
                                <RefreshCw className="w-5 h-5 text-gray-400" />
                            </button>
                        )}
                        {messages.length > 0 && (
                            <button 
                                onClick={handleClearChat}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-4">
                            <Bot className="w-8 h-8 text-brand" />
                        </div>
                        <h4 className="text-lg font-medium text-white mb-2">
                            Spune-mi ce problemă ai <br/> si te voi ajuta!
                        </h4>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-brand" />
                                    </div>
                                )}
                                <div 
                                    className={`w-[75%] rounded-2xl px-4 py-3 ${
                                        msg.role === 'user'
                                            ? 'bg-brand text-white rounded-br-md'
                                            : 'bg-bg-dark border border-brand-subtle text-gray-200 rounded-bl-md'
                                    }`}
                                >
                                    {renderMessageContent(msg)}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-brand-bright/20 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-brand-bright" />
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {/* Minimap for selected step */}
                        {showMinimap && selectedStep && (
                            <div className="flex gap-3 justify-start">
                                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-brand" />
                                </div>
                                <div className="w-[75%] rounded-2xl px-4 py-3 bg-bg-dark border border-brand-subtle">
                                    <div className="mb-3">
                                        <p className="text-sm text-white font-medium">
                                            📍 {selectedStep.document}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {selectedStep.institution}
                                        </p>
                                    </div>
                                    <MiniMap 
                                        institution={getMinimapInstitution()}
                                        onComplete={handleStepComplete}
                                    />
                                </div>
                            </div>
                        )}
                        
                        {/* Show workflow again after completing a step */}
                        {showMinimap && activeWorkflow && completedSteps.length > 0 && !selectedStep && (
                            <div className="flex gap-3 justify-start">
                                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-brand" />
                                </div>
                                <div className="w-[85%] rounded-2xl px-4 py-3 bg-bg-dark border border-brand-subtle">
                                    <p className="text-sm text-gray-400 mb-2">
                                        ✅ Pasul a fost marcat ca finalizat! Iată lista actualizată:
                                    </p>
                                    <WorkflowSteps 
                                        workflow={activeWorkflow}
                                        completedSteps={completedSteps}
                                        onStepClick={handleStepClick}
                                        onStepComplete={handleStepComplete}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
                
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-brand" />
                        </div>
                        <div className="bg-bg-dark border border-brand-subtle rounded-2xl px-4 py-3 w-[70%]">
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
            <div className="p-4 border-t border-brand-subtle">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Descrie ce problema ai..."
                        className="w-full bg-bg-dark border-2 rounded-2xl px-5 py-3 pr-12 text-white outline-none transition-all"
                        style={{
                            borderColor: input ? 'rgba(26, 170, 100, 0.5)' : 'rgba(26, 170, 100, 0.2)'
                        }}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-brand text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-bright transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AI_Docs
