// AI response generation using OpenAI API

import { mockCalendar, categories } from './mockData.js';
import { templates, getTemplatesByCategory } from './templates.js';

// API configuration - in production, this should use environment variables
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
let apiKey = null;

// Set the API key
export function setApiKey(key) {
    apiKey = key;
    localStorage.setItem('openai_api_key', key);
}

// Get stored API key
export function getStoredApiKey() {
    return localStorage.getItem('openai_api_key');
}

// Check if API key is configured
export function isApiKeyConfigured() {
    return !!apiKey || !!getStoredApiKey();
}

// Initialize API key from storage
export function initApiKey() {
    const storedKey = getStoredApiKey();
    if (storedKey) {
        apiKey = storedKey;
        return true;
    }
    return false;
}

// System prompt for the AI
const systemPrompt = `Du bist ein hilfreicher Assistent für einen deutschen Versicherungsmakler. 
Deine Aufgabe ist es, professionelle und freundliche Antworten auf Kundenanfragen zu verfassen.

Wichtige Richtlinien:
- Schreibe immer auf Deutsch
- Sei professionell aber herzlich
- Verwende die formelle Anrede (Sie)
- Halte Antworten prägnant aber vollständig
- Bei Schadensfällen: Zeige Empathie und gib klare nächste Schritte
- Bei Terminanfragen: Schlage konkrete Termine vor wenn verfügbar
- Bei Fragen: Beantworte direkt und biete weitere Hilfe an
- Bei Kündigungen: Sei respektvoll und biete ein Gespräch an

Unterschreibe immer mit:
"Mit freundlichen Grüßen
Ihr Versicherungsmakler"`;

// Generate AI response for a request
export async function generateResponse(request, includeAppointment = false) {
    const effectiveApiKey = apiKey || getStoredApiKey();

    // Build context for the AI
    let contextMessage = `
Kategorie der Anfrage: ${categories[request.category].name}
Kanal: ${request.channel}
Absender: ${request.sender.name}
${request.sender.details}

Original-Nachricht:
${request.originalMessage}

Zusammenfassung der Anfrage:
${request.summary}
`;

    // Add calendar info for appointment requests
    if (request.category === 'appointment' || includeAppointment) {
        const nextSlot = mockCalendar.getNextAvailable();
        contextMessage += `

Verfügbare Termine aus dem Kalender:
- Nächster freier Termin: ${nextSlot.formatted}
- Weitere Optionen: ${mockCalendar.availableSlots.slice(0, 3).map(s =>
            `${s.day} ${s.date.split('-').reverse().join('.')}: ${s.times.join(', ')}`
        ).join('; ')}
`;
    }

    // If no API key, use template-based fallback
    if (!effectiveApiKey) {
        return generateFallbackResponse(request);
    }

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${effectiveApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Bitte verfasse eine passende Antwort auf folgende Anfrage:\n${contextMessage}` }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API error:', error);

            if (response.status === 401) {
                throw new Error('Ungültiger API-Key. Bitte überprüfen Sie Ihren OpenAI API-Key.');
            }

            throw new Error(error.error?.message || 'API-Fehler');
        }

        const data = await response.json();
        return {
            success: true,
            response: data.choices[0].message.content,
            source: 'ai'
        };

    } catch (error) {
        console.error('Error generating AI response:', error);

        // Fallback to template-based response
        const fallback = generateFallbackResponse(request);
        fallback.error = error.message;
        return fallback;
    }
}

// Generate a fallback response using templates
function generateFallbackResponse(request) {
    const categoryTemplates = getTemplatesByCategory(request.category);
    const template = categoryTemplates[0] || templates[0];

    // Fill in basic placeholders
    let response = template.content
        .replace('[NAME]', request.sender.name.split(' ')[0] !== 'Familie'
            ? `Herr/Frau ${request.sender.name.split(' ').pop()}`
            : request.sender.name);

    // Add appointment info if relevant
    if (request.category === 'appointment') {
        const nextSlot = mockCalendar.getNextAvailable();
        response = response
            .replace('[DATUM]', nextSlot.date.split('-').reverse().join('.'))
            .replace('[UHRZEIT]', nextSlot.time + ' Uhr');
    }

    return {
        success: true,
        response: response,
        source: 'template',
        templateId: template.id
    };
}

// Get appointment suggestion for the current request
export function getAppointmentSuggestion() {
    return mockCalendar.getNextAvailable();
}

// Prompt to display API key setup dialog
export function showApiKeyDialog() {
    const currentKey = getStoredApiKey();
    const maskedKey = currentKey ? `${currentKey.slice(0, 8)}...${currentKey.slice(-4)}` : 'Nicht konfiguriert';

    const newKey = prompt(
        `OpenAI API Key konfigurieren\n\nAktueller Key: ${maskedKey}\n\nNeuen Key eingeben (leer lassen zum Behalten):`,
        ''
    );

    if (newKey && newKey.trim()) {
        setApiKey(newKey.trim());
        return true;
    }

    return false;
}
