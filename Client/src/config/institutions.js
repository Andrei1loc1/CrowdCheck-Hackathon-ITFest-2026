/**
 * Institutions configuration - Single source of truth for institution data
 * Used by AI_Docs and MapPage
 */

// Sample institutions data
export const institutions = [
  { 
    name: 'SPCLEP Sector 1', 
    address: 'Bulevдул Preed-meridian 1, București', 
    position: [44.4268, 26.1025], 
    waitTime: '10 min',
    status: 'liber'
  },
  { 
    name: 'SPCLEP Sector 2', 
    address: 'Bulevдул Carol I, București', 
    position: [44.4468, 26.1525], 
    waitTime: '15 min',
    status: 'mediu'
  },
  { 
    name: 'Primăria București', 
    address: 'Palatul Primăriei, București', 
    position: [44.4368, 26.1025], 
    waitTime: '20 min',
    status: 'liber'
  },
  { 
    name: 'Serviciul Înmatriculări', 
    address: 'Strada Calea Victoriei, București', 
    position: [44.4168, 26.0925], 
    waitTime: '25 min',
    status: 'mediu'
  },
  {
    name: 'Companie Asigurări RCA',
    address: 'Strada Nordului, București',
    position: [44.4568, 26.1125],
    waitTime: '5 min',
    status: 'liber'
  }
]

// Document to institution mapping
const documentInstitutionMapping = [
  { keywords: ['civ', 'cartea de identitate a vehiculului', 'înmatriculare'], institution: institutions[3] },
  { keywords: ['rca', 'asigurare'], institution: institutions[4] },
  { keywords: ['buletin', 'carte de identitate', 'ci'], institution: institutions[0] },
  { keywords: ['pașaport', 'pasaport'], institution: institutions[1] },
  { keywords: ['permis', 'conducere'], institution: institutions[1] },
  { keywords: ['primărie', 'stare civilă', 'certificat', 'căsătorie', 'naștere'], institution: institutions[2] },
]

/**
 * Get institution for a document type
 * @param {string} documentName - The document name to look up
 * @returns {object} The matching institution
 */
export const getInstitutionForDocument = (documentName) => {
  // Handle case where documentName is not a string
  if (!documentName || typeof documentName !== 'string') {
    return institutions[0]
  }
  
  const docLower = documentName.toLowerCase()
  
  for (const map of documentInstitutionMapping) {
    if (map.keywords.some(k => docLower.includes(k))) {
      return map.institution
    }
  }
  
  return institutions[0]
}

/**
 * Find institution by name
 * @param {string} name - Name to search for
 * @returns {object|null} The matching institution or null
 */
export const findInstitutionByName = (name) => {
  if (!name) return null
  return institutions.find(i => i.name.toLowerCase().includes(name.toLowerCase())) || null
}

export default {
  institutions,
  getInstitutionForDocument,
  findInstitutionByName
}
