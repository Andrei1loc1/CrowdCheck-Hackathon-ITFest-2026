/**
 * AI Response Parser - Utility functions for parsing AI responses
 */

/**
 * Parse AI JSON response from text
 * @param {string} text - Raw AI response text
 * @returns {object|null} Parsed JSON or null
 */
export const parseAIResponse = (text) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return null
  } catch (e) {
    console.error('Failed to parse AI response:', e)
    return null
  }
}

// Workflow keywords for detecting workflow queries
const workflowKeywords = [
  'vreau sa', 'cum sa', 'cum pot', 'am nevoie sa', 'trebuie sa',
  'inmatricul', 'pasaport', 'buletin', 'permis', 'casator',
  'nastere', 'deces', 'schimb', 'obtin', 'fac',
  'masina', 'auto', 'car', 'inregistr', 'procedura',
  'pasii', 'proces', 'ghid', 'ajutor'
]

/**
 * Determine if user is asking for a process/workflow
 * @param {string} message - User message
 * @returns {boolean} True if it's a workflow query
 */
export const isWorkflowQuery = (message) => {
  const lowerMessage = message.toLowerCase()
  return workflowKeywords.some(keyword => lowerMessage.includes(keyword))
}

/**
 * Extract and parse JSON from AI response
 * Handles markdown code blocks and partial JSON
 * @param {string} aiResponse - Raw AI response
 * @returns {object|null} Parsed JSON or null
 */
export const extractJsonFromResponse = (aiResponse) => {
  try {
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
    
    return JSON.parse(jsonStr)
  } catch (parseErr) {
    console.error('Failed to extract JSON:', parseErr)
    return null
  }
}

export default {
  parseAIResponse,
  isWorkflowQuery,
  extractJsonFromResponse
}
