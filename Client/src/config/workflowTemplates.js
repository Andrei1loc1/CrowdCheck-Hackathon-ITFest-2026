/**
 * Workflow Templates for Common Romanian Administrative Processes
 * These are used as fallback when AI is unavailable or for quick responses
 */

export const workflowTemplates = {
    'inmatriculare': {
        'masina': {
            title: 'Înmatriculare autovehicul',
            description: 'Pașii necesari pentru înmatricularea unei mașini în România',
            steps: [
                {
                    id: 1,
                    document: 'Cartea de identitate a vehiculului (CIV)',
                    institution: 'Concesionar auto / RAR',
                    description: 'Obțineți CIV de la vânzător sau de la RAR',
                    requirements: ['Factura de achiziție', 'Certificat de înmatriculare anterior']
                },
                {
                    id: 2,
                    document: 'Asigurare RCA',
                    institution: 'Companie de asigurări',
                    description: 'Încheiați contractul de asigurare obligatorie auto',
                    requirements: ['Certificat de înmatriculare', 'Buletin']
                },
                {
                    id: 3,
                    document: 'Înmatriculare vehicul',
                    institution: 'SPCLEP / Serviciul Înmatriculări',
                    description: 'Prezentați-vă la ghișeu pentru înmatriculare',
                    requirements: ['CIV', 'RCA', 'Buletin', 'Cerere tipizată']
                }
            ]
        },
        'auto': {
            title: 'Înmatriculare autovehicul',
            description: 'Pașii necesari pentru înmatricularea unei mașini în România',
            steps: [
                {
                    id: 1,
                    document: 'Cartea de identitate a vehiculului (CIV)',
                    institution: 'Concesionar auto / RAR',
                    description: 'Obțineți CIV de la vânzător sau de la RAR',
                    requirements: ['Factura de achiziție', 'Certificat de înmatriculare anterior']
                },
                {
                    id: 2,
                    document: 'Asigurare RCA',
                    institution: 'Companie de asigurări',
                    description: 'Încheiați contractul de asigurare obligatorie auto',
                    requirements: ['Certificat de înmatriculare', 'Buletin']
                },
                {
                    id: 3,
                    document: 'Înmatriculare vehicul',
                    institution: 'SPCLEP / Serviciul Înmatriculări',
                    description: 'Prezentați-vă la ghișeu pentru înmatriculare',
                    requirements: ['CIV', 'RCA', 'Buletin', 'Cerere tipizată']
                }
            ]
        }
    },
    'pasaport': {
        'pasaport': {
            title: 'Obținere pașaport biometric',
            description: 'Pașii pentru obținerea pașaportului românesc',
            steps: [
                {
                    id: 1,
                    document: 'Buletin / Cartea de identitate',
                    institution: 'SPCLEP',
                    description: 'Asigurați-vă că buletinul este valabil',
                    requirements: ['Buletin valabil']
                },
                {
                    id: 2,
                    document: 'Cerere pașaport',
                    institution: 'SPCLEP',
                    description: 'Completați cererea pentru pașaport biometric',
                    requirements: ['Buletin', 'Fotografie']
                },
                {
                    id: 3,
                    document: 'Pașaport biometric',
                    institution: 'SPCLEP / Poliția de Frontieră',
                    description: 'Ridicați pașaportul de la ghișeu',
                    requirements: ['Chitanța de plată', 'Buletin']
                }
            ]
        }
    },
    'buletin': {
        'buletin': {
            title: 'Obținere / Schimbare buletin',
            description: 'Pașii pentru eliberarea cărții de identitate',
            steps: [
                {
                    id: 1,
                    document: 'Certificat de naștere',
                    institution: 'Primărie / Stare civilă',
                    description: 'Obțineți certificatul de naștere (dacă nu aveți)',
                    requirements: ['Declarație naștere (dacă e cazul)']
                },
                {
                    id: 2,
                    document: 'Cerere CI',
                    institution: 'SPCLEP / Primărie',
                    description: 'Completați cererea pentru carte de identitate',
                    requirements: ['Buletin vechi (dacă e cazul)', 'Fotografie', 'Certificat de naștere']
                },
                {
                    id: 3,
                    document: 'Cartea de identitate',
                    institution: 'SPCLEP',
                    description: 'Ridicați cartea de identitate',
                    requirements: ['Chitanța de plată', 'Buletin vechi']
                }
            ]
        }
    },
    'permis': {
        'permis': {
            title: 'Obținere permis de conducere',
            description: 'Pașii pentru obținerea permisului de conducere',
            steps: [
                {
                    id: 1,
                    document: 'Curs de școală auto',
                    institution: 'Școală de șoferi autorizată',
                    description: 'Efectuați cursul teoretic și practic',
                    requirements: ['Buletin', 'Vârsta minimă 18 ani']
                },
                {
                    id: 2,
                    document: 'Examen teoretic și practic',
                    institution: 'SPCLEP / Serviciul Permise',
                    description: 'Promovați examenele de trafic',
                    requirements: ['Adeverință școală', 'Certificat medical']
                },
                {
                    id: 3,
                    document: 'Permis de conducere',
                    institution: 'SPCLEP',
                    description: 'Ridicați permisul de conducere',
                    requirements: ['Chitanța de plată', 'Buletin']
                }
            ]
        }
    },
    'casatorie': {
        'casatorie': {
            title: 'Căsătorie',
            description: 'Pașii pentru oficirea căsătoriei',
            steps: [
                {
                    id: 1,
                    document: 'Certificat de naștere',
                    institution: 'Primărie',
                    description: 'Obțineți certificatele de naștere (ambii soți)',
                    requirements: ['Buletin']
                },
                {
                    id: 2,
                    document: 'Declarație de căsătorie',
                    institution: 'Primărie',
                    description: 'Depuneți declarația de căsătorie',
                    requirements: ['Buletin', 'Certificat de naștere', 'Divorț (dacă e cazul)']
                },
                {
                    id: 3,
                    document: 'Certificat de căsătorie',
                    institution: 'Primărie',
                    description: 'Ridicați certificatul de căsătorie',
                    requirements: ['Chitanța de plată']
                }
            ]
        }
    },
    'nastere': {
        'nastere': {
            title: 'Înregistrare naștere',
            description: 'Pașii pentru înregistrarea nașterii unui copil',
            steps: [
                {
                    id: 1,
                    document: 'Certificat de naștere',
                    institution: 'Spital / Medic',
                    description: 'Obțineți certificatul medical de naștere',
                    requirements: ['Buletin părinți']
                },
                {
                    id: 2,
                    document: 'Înregistrare la starea civilă',
                    institution: 'Primărie',
                    description: 'Înregistrați nașterea la primărie',
                    requirements: ['Certificat medical naștere', 'Buletin părinți', 'Certificat căsătorie']
                }
            ]
        }
    }
}

/**
 * Find workflow template by search term
 */
export const findWorkflowTemplate = (searchTerm) => {
    const normalized = searchTerm.toLowerCase().trim()
    
    // Try exact match first
    if (workflowTemplates[normalized]) {
        // If it's a category with sub-keys, try to find best match
        if (typeof workflowTemplates[normalized] === 'object') {
            // Try to find a sub-key that matches
            for (const subKey in workflowTemplates[normalized]) {
                if (normalized.includes(subKey) || subKey.includes(normalized)) {
                    return {
                        ...workflowTemplates[normalized][subKey],
                        id: `${normalized}-${subKey}`
                    }
                }
            }
            // Return first sub-key as default
            const firstKey = Object.keys(workflowTemplates[normalized])[0]
            return {
                ...workflowTemplates[normalized][firstKey],
                id: `${normalized}-${firstKey}`
            }
        }
        return workflowTemplates[normalized]
    }
    
    // Search in nested keys
    for (const category in workflowTemplates) {
        if (normalized.includes(category) || category.includes(normalized)) {
            // Find best matching sub-key
            for (const subKey in workflowTemplates[category]) {
                if (normalized.includes(subKey) || subKey.includes(normalized)) {
                    return {
                        ...workflowTemplates[category][subKey],
                        id: `${category}-${subKey}`
                    }
                }
            }
            // Return first sub-key as default
            const firstKey = Object.keys(workflowTemplates[category])[0]
            return {
                ...workflowTemplates[category][firstKey],
                id: `${category}-${firstKey}`
            }
        }
        
        // Check nested objects
        for (const subKey in workflowTemplates[category]) {
            if (normalized.includes(subKey) || subKey.includes(normalized)) {
                return {
                    ...workflowTemplates[category][subKey],
                    id: `${category}-${subKey}`
                }
            }
        }
    }
    
    return null
}

/**
 * Get all workflow templates
 */
export const getAllWorkflows = () => {
    const workflows = []
    for (const category in workflowTemplates) {
        if (typeof workflowTemplates[category] === 'object') {
            for (const subKey in workflowTemplates[category]) {
                workflows.push(workflowTemplates[category][subKey])
            }
        } else {
            workflows.push(workflowTemplates[category])
        }
    }
    return workflows
}
