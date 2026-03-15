import { useState, useEffect, useCallback } from 'react'

/**
 * Generate a unique ID for messages
 */
const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Custom hook for persistent chat state
 * Saves messages to localStorage so they persist across page navigation
 */
export const usePersistentChat = (storageKey = 'ai-docs-chat') => {
    // Load initial state from localStorage and regenerate IDs to avoid duplicates
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                const parsed = JSON.parse(saved)
                // Regenerate all IDs to ensure uniqueness
                return parsed.map(m => ({ ...m, id: generateId() }))
            }
        } catch (e) {
            console.error('Failed to load chat from storage:', e)
        }
        return []
    })

    const [currentWorkflow, setCurrentWorkflow] = useState(() => {
        try {
            const saved = localStorage.getItem(`${storageKey}-workflow`)
            if (saved) {
                return JSON.parse(saved)
            }
        } catch (e) {
            console.error('Failed to load workflow from storage:', e)
        }
        return null
    })

    const [completedSteps, setCompletedSteps] = useState(() => {
        try {
            const saved = localStorage.getItem(`${storageKey}-completed-steps`)
            if (saved) {
                return JSON.parse(saved)
            }
        } catch (e) {
            console.error('Failed to load completed steps from storage:', e)
        }
        return []
    })

    // Save to localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(messages))
        } catch (e) {
            console.error('Failed to save chat to storage:', e)
        }
    }, [messages, storageKey])

    useEffect(() => {
        try {
            localStorage.setItem(`${storageKey}-workflow`, JSON.stringify(currentWorkflow))
        } catch (e) {
            console.error('Failed to save workflow to storage:', e)
        }
    }, [currentWorkflow, storageKey])

    useEffect(() => {
        try {
            localStorage.setItem(`${storageKey}-completed-steps`, JSON.stringify(completedSteps))
        } catch (e) {
            console.error('Failed to save completed steps to storage:', e)
        }
    }, [completedSteps, storageKey])

    /**
     * Add a message to the chat
     */
    const addMessage = useCallback((message) => {
        // Generate unique ID if not provided
        const messageWithId = {
            ...message,
            id: message.id || generateId()
        }
        setMessages(prev => {
            // Prevent duplicates based on ID
            const exists = prev.some(m => m.id === messageWithId.id)
            if (exists) return prev
            return [...prev, messageWithId]
        })
    }, [])

    /**
     * Clear all chat history
     */
    const clearChat = useCallback(() => {
        setMessages([])
        setCurrentWorkflow(null)
        setCompletedSteps([])
        try {
            localStorage.removeItem(storageKey)
            localStorage.removeItem(`${storageKey}-workflow`)
            localStorage.removeItem(`${storageKey}-completed-steps`)
        } catch (e) {
            console.error('Failed to clear chat from storage:', e)
        }
    }, [storageKey])

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
        try {
            localStorage.removeItem(`${storageKey}-workflow`)
            localStorage.removeItem(`${storageKey}-completed-steps`)
        } catch (e) {
            console.error('Failed to reset workflow in storage:', e)
        }
    }, [storageKey])

    return {
        messages,
        currentWorkflow,
        completedSteps,
        addMessage,
        setMessages,
        setCurrentWorkflow,
        completeStep,
        clearChat,
        resetWorkflow
    }
}

export default usePersistentChat
