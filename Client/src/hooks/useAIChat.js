import { useState, useCallback } from 'react'
import { aiConfig, generateRequestBody, getHeaders } from '@/config/aiConfig'
import { getDocumentInfo, getAllDocumentTypes } from '@/config/documentMapping'
import { findWorkflowTemplate, getAllWorkflows } from '@/config/workflowTemplates'

/**
 * Custom hook for AI Chat functionality with OpenRouter API
 * Handles both single document lookups and multi-step workflows
 */
export const useAIChat = () => {
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [currentWorkflow, setCurrentWorkflow] = useState(null)
    const [completedSteps, setCompletedSteps] = useState([])

    /**
     * Parse AI JSON response
     */
    const parseAIResponse = (text) => {
        try {
            // Try to extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                return parsed
            }
            return null
        } catch (e) {
            console.error('Failed to parse AI response:', e)
            return null
        }
    }

    /**
     * Determine if user is asking for a process/workflow or a single document
     */
    const isWorkflowQuery = (message) => {
        const workflowKeywords = [
            'vreau sa', 'cum sa', 'cum pot', 'am nevoie sa', 'trebuie sa',
            'inmatricul', 'pasaport', 'buletin', 'permis', 'casator',
            'nastere', 'deces', 'schimb', 'obtin', 'fac',
            'masina', 'auto', 'car', 'inregistr', 'procedura',
            'pasii', 'proces', 'ghid', 'ajutor'
        ]
        
        const lowerMessage = message.toLowerCase()
        return workflowKeywords.some(keyword => lowerMessage.includes(keyword))
    }

    /**
     * Send a message to the AI and get a response
     */
    const sendMessage = useCallback(async (userMessage) => {
        setIsLoading(true)
        setError(null)
        
        // Add user message to history
        const newMessages = [...messages, { role: 'user', content: userMessage }]
        setMessages(newMessages)

        try {
            // First, check for local workflow template match
            const localWorkflow = findWorkflowTemplate(userMessage)
            
            if (localWorkflow) {
                setCurrentWorkflow(localWorkflow)
                setCompletedSteps([])
                
                const responseMessage = {
                    id: Date.now(),
                    role: 'assistant',
                    type: 'workflow',
                    content: localWorkflow.description,
                    workflow: localWorkflow,
                    completedSteps: []
                }
                
                setMessages(prev => [...prev, responseMessage])
                setIsLoading(false)
                return
            }

            // Check if this is likely a workflow query
            if (isWorkflowQuery(userMessage)) {
                // Call AI for workflow
                const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(generateRequestBody(newMessages))
                })

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`)
                }

                const data = await response.json()
                const aiResponse = data.choices[0].message.content
                
                // Parse the AI response as JSON
                const parsed = parseAIResponse(aiResponse)
                
                if (parsed && parsed.type === 'workflow') {
                    // Valid workflow response
                    setCurrentWorkflow(parsed)
                    setCompletedSteps([])
                    
                    const responseMessage = {
                        id: Date.now(),
                        role: 'assistant',
                        type: 'workflow',
                        content: parsed.description,
                        workflow: parsed,
                        completedSteps: []
                    }
                    
                    setMessages(prev => [...prev, responseMessage])
                } else if (parsed && parsed.type === 'single-document') {
                    // Single document response
                    setCurrentWorkflow(null)
                    setCompletedSteps([])
                    
                    const responseMessage = {
                        id: Date.now(),
                        role: 'assistant',
                        type: 'single-document',
                        content: parsed.description,
                        document: parsed,
                        institutions: parsed.institution
                    }
                    
                    setMessages(prev => [...prev, responseMessage])
                } else {
                    // Fallback - try local document lookup
                    const localMatch = getAllDocumentTypes().find(doc => 
                        userMessage.toLowerCase().includes(doc.official.toLowerCase()) ||
                        userMessage.toLowerCase().includes(doc.searchTerm)
                    )
                    
                    if (localMatch) {
                        setCurrentWorkflow(null)
                        const responseMessage = {
                            id: Date.now(),
                            role: 'assistant',
                            type: 'single-document',
                            content: localMatch.description,
                            document: localMatch,
                            institutions: localMatch.institutions
                        }
                        setMessages(prev => [...prev, responseMessage])
                    } else {
                        // Show available workflows as suggestions
                        const workflows = getAllWorkflows().slice(0, 3)
                        setCurrentWorkflow(null)
                        const responseMessage = {
                            id: Date.now(),
                            role: 'assistant',
                            type: 'suggestions',
                            content: 'Nu am înțeles exact ce dorești. Iată câteva procese comune:',
                            suggestions: workflows
                        }
                        setMessages(prev => [...prev, responseMessage])
                    }
                }
                
                setIsLoading(false)
                return
            }

            // For simple document queries, use local mapping
            const localMatch = getDocumentInfo(userMessage)
            
            if (localMatch) {
                setCurrentWorkflow(null)
                setCompletedSteps([])
                
                const responseMessage = {
                    id: Date.now(),
                    role: 'assistant',
                    type: 'single-document',
                    content: localMatch.description,
                    document: localMatch,
                    institutions: localMatch.institutions
                }
                
                setMessages(prev => [...prev, responseMessage])
                setIsLoading(false)
                return
            }

            // No match - show suggestions
            const allDocs = getAllDocumentTypes().slice(0, 6)
            setCurrentWorkflow(null)
            const responseMessage = {
                id: Date.now(),
                role: 'assistant',
                type: 'document-suggestions',
                content: 'Nu am găsit ce cauți. Iată câteva documente disponibile:',
                documents: allDocs
            }
            
            setMessages(prev => [...prev, responseMessage])

        } catch (err) {
            setError(err.message)
            
            // Fallback to local templates on error
            const localWorkflow = findWorkflowTemplate(userMessage)
            if (localWorkflow) {
                setCurrentWorkflow(localWorkflow)
                const responseMessage = {
                    id: Date.now(),
                    role: 'assistant',
                    type: 'workflow',
                    content: localWorkflow.description,
                    workflow: localWorkflow,
                    completedSteps: []
                }
                setMessages(prev => [...prev, responseMessage])
            } else {
                setMessages(prev => [...prev, { 
                    id: Date.now(),
                    role: 'assistant', 
                    content: 'Scuze, am întâmpinat o eroare. Te rog încearcă din nou sau descrie ce proces dorești (ex: "vreau să îmi înmatriculez mașina").' 
                }])
            }
        } finally {
            setIsLoading(false)
        }
    }, [messages])

    /**
     * Mark a step as completed
     */
    const completeStep = useCallback((stepId) => {
        setCompletedSteps(prev => {
            if (!prev.includes(stepId)) {
                return [...prev, stepId]
            }
            return prev
        })
    }, [])

    /**
     * Reset workflow state
     */
    const resetWorkflow = useCallback(() => {
        setCurrentWorkflow(null)
        setCompletedSteps([])
    }, [])

    /**
     * Clear chat history
     */
    const clearChat = useCallback(() => {
        setMessages([])
        setCurrentWorkflow(null)
        setCompletedSteps([])
        setError(null)
    }, [])

    /**
     * Set initial query from URL params
     */
    const setInitialQuery = useCallback((query) => {
        if (query) {
            sendMessage(query)
        }
    }, [sendMessage])

    return {
        messages,
        isLoading,
        error,
        currentWorkflow,
        completedSteps,
        sendMessage,
        completeStep,
        resetWorkflow,
        clearChat,
        setInitialQuery
    }
}

export default useAIChat
