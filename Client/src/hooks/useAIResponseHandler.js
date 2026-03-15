import { useCallback } from 'react'
import { getInstitutionForDocument, institutions } from '../config/institutions'
import { getWorkflowForDocument } from '../config/workflowTemplates'
import { isWorkflowQuery, extractJsonFromResponse } from '../utils/aiResponseParser'

/**
 * Custom hook for handling AI response logic
 * Manages document suggestions, institution mapping, and workflow generation
 */
export const useAIResponseHandler = () => {
  
  /**
   * Process AI response and extract structured data
   * @param {string} aiResponse - Raw AI response
   * @param {string} userMessage - Original user message
   * @returns {object} Processed response with suggestions, institution, workflow
   */
  const processAIResponse = useCallback((aiResponse, userMessage) => {
    const result = {
      content: aiResponse,
      suggestions: [],
      institution: null,
      workflow: null
    }
    
    // Check if it's a workflow query
    if (isWorkflowQuery(userMessage)) {
      // Try to extract JSON from response
      const parsed = extractJsonFromResponse(aiResponse)
      
      if (parsed) {
        // Handle different response types
        if (parsed.type === 'workflow') {
          result.workflow = parsed
          result.suggestions = parsed.steps || []
        } else if (parsed.type === 'documents') {
          result.suggestions = parsed.documents || []
          result.content = parsed.message || aiResponse
        } else if (parsed.documents || parsed.steps) {
          // Generic JSON response
          result.suggestions = parsed.documents || []
          result.workflow = parsed.steps ? { steps: parsed.steps } : null
        }
      }
      
      // Find matching institution based on user message
      const documentName = extractDocumentName(userMessage)
      if (documentName) {
        result.institution = getInstitutionForDocument(documentName)
      } else {
        // Default to first institution
        result.institution = institutions[0]
      }
      
      // Get workflow template if available
      if (documentName) {
        const workflow = getWorkflowForDocument(documentName)
        if (workflow) {
          result.workflow = workflow
        }
      }
    } else {
      // Non-workflow query - just show suggestions
      result.suggestions = []
    }
    
    return result
  }, [])
  
  /**
   * Extract document name from user message
   * @param {string} message - User message
   * @returns {string|null} Extracted document name or null
   */
  const extractDocumentName = useCallback((message) => {
    const lowerMessage = message.toLowerCase()
    
    // Document keywords mapping
    const documentKeywords = {
      'înmatriculare': 'înmatriculare',
      'inmatriculare': 'înmatriculare',
      'mașină': 'înmatriculare',
      'masina': 'înmatriculare',
      'auto': 'înmatriculare',
      'carte de identitate': 'carte de identitate',
      'buletin': 'carte de identitate',
      'ci': 'carte de identitate',
      'pașaport': 'pașaport',
      'pasaport': 'pașaport',
      'permis': 'permis de conducere',
      'permis de conducere': 'permis de conducere',
      'rca': 'asigurare rca',
      'asigurare': 'asigurare rca',
      'căsătorie': 'certificat căsătorie',
      'casatorie': 'certificat căsătorie',
      'naștere': 'certificat naștere',
      'nastere': 'certificat naștere'
    }
    
    for (const [keyword, docName] of Object.entries(documentKeywords)) {
      if (lowerMessage.includes(keyword)) {
        return docName
      }
    }
    
    return null
  }, [])
  
  /**
   * Get initial AI greeting message
   * @returns {object} Initial message object
   */
  const getInitialMessage = useCallback(() => ({
    role: 'assistant',
    content: 'Bună! Sunt asistentul tău pentru proceduri și documente. Îți pot ajuta să afli ce acte sunt necesare pentru diverse proceduri administrative și unde le poți obține. Ce dorești să afli?',
    suggestions: [
      'Cum înmatriculez o mașină?',
      'Ce acte am nevoie pentru pașaport?',
      'Unde pot schimba buletinul?'
    ]
  }), [])
  
  return {
    processAIResponse,
    extractDocumentName,
    getInitialMessage
  }
}

export default useAIResponseHandler
