/**
 * Document to Institution Mapping
 * Maps common Romanian search terms to official document names and institutions
 */

export const documentMapping = {
    // Identity documents
    'buletin': {
        official: 'Card de identitate',
        type: 'identity',
        institutions: ['Evidența Populației', 'Primărie'],
        description: 'Documentul de identificare eliberat de SPCLEP/Primărie',
        requirements: ['Certificat de naștere', 'Fotografie', 'Chitanță taxă']
    },
    'pasaport': {
        official: 'Pașaport biometric',
        type: 'identity',
        institutions: ['SPCLEP', 'Poliția de Frontieră'],
        description: 'Document de călătorie internațională',
        requirements: ['Buletin/CI', 'Fotografie', 'Chitanță taxă']
    },
    'ci': {
        official: 'Card de identitate',
        type: 'identity',
        institutions: ['Evidența Populației', 'Primărie'],
        description: 'Documentul de identificare electronic',
        requirements: ['Certificat de naștere', 'Fotografie', 'Chitanță taxă']
    },
    
    // Vehicle documents
    'masina': {
        official: 'Înmatriculare vehicul',
        type: 'vehicle',
        institutions: ['Serviciul Înmatriculări', 'API'],
        description: 'Înregistrarea și înmatricularea autovehiculelor',
        requirements: ['Cartea de identitate a vehiculului', 'Asigurare RCA', 'Buletin']
    },
    'permis': {
        official: 'Permis de conducere',
        type: 'vehicle',
        institutions: ['Serviciul Permise de Conducere și Înmatriculări'],
        description: 'Document care atestă dreptul de a conduce',
        requirements: ['Examene aprobate', 'Fotografie', 'Chitanță taxă']
    },
    'rca': {
        official: 'Asigurare RCA',
        type: 'vehicle',
        institutions: ['Asigurători RCA autorizați'],
        description: 'Asigurare obligatorie de răspundere civilă auto',
        requirements: ['Certificat înmatriculare', 'Buletin']
    },
    
    // Administrative documents
    'certificat': {
        official: 'Certificate de stare civilă',
        type: 'administrative',
        institutions: ['Primărie', 'Evidența Populației'],
        description: 'Certificate de naștere, căsătorie, deces',
        requirements: ['Cerere tipizată', 'Documente doveditoare']
    },
    'nastere': {
        official: 'Certificat de naștere',
        type: 'administrative',
        institutions: ['Primărie', 'Spital'],
        description: 'Document care atestă nașterea',
        requirements: ['Declarație naștere', 'Buletin părinți']
    },
    'casatorie': {
        official: 'Certificat de căsătorie',
        type: 'administrative',
        institutions: ['Primărie'],
        description: 'Document care atestă căsătoria',
        requirements: ['Buletine', 'Certificat naștere ambii', 'Chitanță taxă']
    },
    'deces': {
        official: 'Certificat de deces',
        type: 'administrative',
        institutions: ['Primărie', 'Spital'],
        description: 'Document eliberat în caz de deces',
        requirements: ['Certificat medical de deces', 'Buletin defunct']
    },
    
    // Social documents
    'pensie': {
        official: 'Dosar pensie',
        type: 'social',
        institutions: ['Casa Județeană de Pensii'],
        description: 'Documentație pentru obținerea pensiei',
        requirements: ['Acte de muncă', 'Buletin', 'Stagiu contributiv']
    },
    'ajutor': {
        official: 'Ajutor social',
        type: 'social',
        institutions: ['Direcția Generală de Asistență Socială'],
        description: 'Ajutor social pentru persoane defavorizate',
        requirements: ['Cerere', 'Documente venituri', 'Buletin']
    },
    
    // Health documents
    'card': {
        official: 'Card de sănătate',
        type: 'health',
        institutions: ['Casa Județeană de Asigurări de Sănătate'],
        description: 'Card pentru servicii medicale',
        requirements: ['Cerere', 'Buletin', 'Chitanță taxă (dacă e cazul)']
    },
    'bilet': {
        official: 'Bilet de trimitere',
        type: 'health',
        institutions: ['Medic de familie', 'Spital'],
        description: 'Document pentru consultații de specialitate',
        requirements: ['Card de sănătate', 'Consult medic familie']
    },
    
    // Other common searches
    'pasaport': {
        official: 'Pașaport',
        type: 'identity',
        institutions: ['SPCLEP', 'Poliția de Frontieră'],
        description: 'Document de călătorie',
        requirements: ['Buletin', 'Fotografie', 'Chitanță']
    },
    'viza': {
        official: 'Viză de ședere',
        type: 'identity',
        institutions: ['Inspectoratul General pentru Imigrări'],
        description: 'Permis de ședere pentru străini',
        requirements: ['Pașaport', 'Documente motivație', 'Chitanță']
    },
    'inmatriculare': {
        official: 'Înmatriculare auto',
        type: 'vehicle',
        institutions: ['Serviciul Înmatriculări'],
        description: 'Înregistrarea vehiculului în circulație',
        requirements: ['CIV', 'RCA', 'Asigurare']
    },
    'inregistrare': {
        official: 'Înregistrare firmă',
        type: 'administrative',
        institutions: ['ONRC', 'Primărie'],
        description: 'Înregistrare persoană juridică',
        requirements: ['Acte constitutive', 'Cerere', 'Chitanță']
    }
}

/**
 * Get document info by search term
 */
export const getDocumentInfo = (searchTerm) => {
    const normalized = searchTerm.toLowerCase().trim()
    return documentMapping[normalized] || null
}

/**
 * Get all available document types
 */
export const getAllDocumentTypes = () => {
    return Object.entries(documentMapping).map(([key, value]) => ({
        searchTerm: key,
        ...value
    }))
}

/**
 * Get institutions for a specific document type
 */
export const getInstitutionsForDocument = (searchTerm) => {
    const info = getDocumentInfo(searchTerm)
    return info ? info.institutions : []
}
