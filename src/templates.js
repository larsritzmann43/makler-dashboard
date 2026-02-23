// Response templates for common insurance broker scenarios

export const templates = [
    {
        id: 'appointment-confirm',
        title: 'Terminbestätigung',
        category: 'appointment',
        content: `Sehr geehrte(r) [NAME],

vielen Dank für Ihre Terminanfrage.

Ich freue mich, Ihnen folgenden Termin vorschlagen zu können:
📅 [DATUM]
🕐 [UHRZEIT]
📍 In meinem Büro / Per Videocall

Bitte bestätigen Sie mir kurz, ob Ihnen dieser Termin passt. Alternativ nennen Sie mir gerne Ihre Wunschzeiten.

Ich freue mich auf unser Gespräch!

Mit freundlichen Grüßen
Ihr Versicherungsmakler`
    },
    {
        id: 'damage-receipt',
        title: 'Schadensmeldung Eingang',
        category: 'damage',
        content: `Sehr geehrte(r) [NAME],

vielen Dank für Ihre Schadensmeldung.

✅ Ihre Meldung wurde erfasst und an die Versicherung weitergeleitet.
📋 Ihre Schadennummer: [NUMMER]

Nächste Schritte:
1. Die Versicherung wird sich innerhalb von 48 Stunden bei Ihnen melden
2. Bitte sichern Sie alle Belege und dokumentieren Sie den Schaden mit Fotos
3. Bei Fragen erreichen Sie mich jederzeit

Ich begleite Sie durch den gesamten Prozess und halte Sie auf dem Laufenden.

Mit freundlichen Grüßen
Ihr Versicherungsmakler`
    },
    {
        id: 'damage-urgent',
        title: 'Dringender Schaden - Soforthilfe',
        category: 'damage',
        content: `Liebe(r) [NAME],

ich habe Ihre Nachricht erhalten und kümmere mich sofort!

⚠️ Wichtige Sofortmaßnahmen:
• Sichern Sie den Schaden soweit möglich
• Dokumentieren Sie alles mit Fotos
• Bewahren Sie beschädigte Gegenstände auf

Ich rufe Sie in den nächsten 15 Minuten zurück, um die weiteren Schritte zu besprechen.

Bei einem Notfall können Sie auch direkt die Schaden-Hotline erreichen: [HOTLINE]

Ich melde mich gleich!
Ihr Versicherungsmakler`
    },
    {
        id: 'document-request',
        title: 'Dokumentenanforderung',
        category: 'documents',
        content: `Sehr geehrte(r) [NAME],

vielen Dank für Ihre Anfrage.

Das gewünschte Dokument habe ich Ihnen als Anhang beigefügt:
📎 [DOKUMENTNAME]

Sollten Sie weitere Unterlagen benötigen oder Fragen haben, stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Ihr Versicherungsmakler`
    },
    {
        id: 'contract-change',
        title: 'Vertragsänderung Bestätigung',
        category: 'contractChange',
        content: `Sehr geehrte(r) [NAME],

vielen Dank für Ihren Änderungswunsch.

Ich habe Ihre Anfrage geprüft und werde die Änderung für Sie beantragen.

Benötigte Unterlagen von Ihrer Seite:
• [UNTERLAGE 1]
• [UNTERLAGE 2]

Sobald ich alle Unterlagen habe, reiche ich den Antrag ein. Die Bearbeitung dauert in der Regel 5-10 Werktage.

Bei Fragen stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Ihr Versicherungsmakler`
    },
    {
        id: 'general-question',
        title: 'Allgemeine Rückfrage',
        category: 'question',
        content: `Sehr geehrte(r) [NAME],

vielen Dank für Ihre Anfrage.

[ANTWORT AUF DIE FRAGE]

Sollten Sie weitere Fragen haben, erreichen Sie mich jederzeit:
📧 Per E-Mail
📞 Telefonisch unter [TELEFON]
💬 Per WhatsApp

Mit freundlichen Grüßen
Ihr Versicherungsmakler`
    },
    {
        id: 'cancellation-confirm',
        title: 'Kündigungsbestätigung',
        category: 'cancellation',
        content: `Sehr geehrte(r) [NAME],

Ihre Kündigung ist bei mir eingegangen.

Ich werde die Kündigung fristgerecht an den Versicherer weiterleiten.
📅 Voraussichtliches Vertragsende: [DATUM]

Bevor die Kündigung wirksam wird, möchte ich Sie gerne kurz kontaktieren:
• Gibt es einen besonderen Grund für die Kündigung?
• Kann ich Ihnen bei einem Wechsel behilflich sein?
• Besteht möglicherweise eine Versorgungslücke?

Selbstverständlich respektiere ich Ihre Entscheidung. Ein kurzes Gespräch könnte jedoch hilfreich sein.

Mit freundlichen Grüßen
Ihr Versicherungsmakler`
    },
    {
        id: 'insurance-coverage',
        title: 'Versicherungsschutz Info',
        category: 'question',
        content: `Sehr geehrte(r) [NAME],

vielen Dank für Ihre Frage zum Versicherungsschutz.

✅ Ihr aktueller Versicherungsschutz umfasst:
[DECKUNGSUMFANG]

📍 Geltungsbereich: [BEREICH]
📅 Gültig bis: [DATUM]

Bitte beachten Sie:
[BESONDERE HINWEISE]

Für detailliertere Informationen stehe ich Ihnen gerne in einem persönlichen Gespräch zur Verfügung.

Mit freundlichen Grüßen
Ihr Versicherungsmakler`
    }
];

// Function to get template by ID
export function getTemplateById(id) {
    return templates.find(t => t.id === id);
}

// Function to get templates by category
export function getTemplatesByCategory(category) {
    return templates.filter(t => t.category === category);
}

// Function to fill template placeholders
export function fillTemplate(templateContent, data = {}) {
    let filled = templateContent;

    Object.entries(data).forEach(([key, value]) => {
        const placeholder = `[${key.toUpperCase()}]`;
        filled = filled.replace(new RegExp(placeholder.replace(/[[\]]/g, '\\$&'), 'g'), value);
    });

    return filled;
}
