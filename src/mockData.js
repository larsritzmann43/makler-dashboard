// Mock data for the insurance broker dashboard

// Channel definitions
export const channels = {
  email: { icon: '📧', name: 'E-Mail', color: '#1976d2' },
  phone: { icon: '📞', name: 'Telefon', color: '#43a047' },
  whatsapp: { icon: '💬', name: 'WhatsApp', color: '#25d366' },
  instagram: { icon: '📸', name: 'Instagram', color: '#e1306c' }
};

// Priority definitions
export const priorities = {
  high: { label: 'Dringend', color: '#e53935', order: 1 },
  medium: { label: 'Mittel', color: '#ff9800', order: 2 },
  low: { label: 'Normal', color: '#4caf50', order: 3 },
  minimal: { label: 'Niedrig', color: '#9e9e9e', order: 4 }
};

// Category definitions
export const categories = {
  damage: { 
    name: 'Schadensmeldung', 
    priority: 'high',
    icon: '🚨'
  },
  appointment: { 
    name: 'Terminanfrage', 
    priority: 'medium',
    icon: '📅'
  },
  contractChange: { 
    name: 'Vertragsänderung', 
    priority: 'medium',
    icon: '📝'
  },
  cancellation: { 
    name: 'Kündigung', 
    priority: 'minimal',
    icon: '❌'
  },
  question: { 
    name: 'Allgemeine Frage', 
    priority: 'low',
    icon: '❓'
  },
  documents: { 
    name: 'Dokumentenanforderung', 
    priority: 'low',
    icon: '📄'
  }
};

// Mock calendar with available slots
export const mockCalendar = {
  availableSlots: [
    { date: '2026-02-10', day: 'Montag', times: ['09:00', '10:30', '14:00', '16:00'] },
    { date: '2026-02-11', day: 'Dienstag', times: ['09:30', '11:00', '15:00'] },
    { date: '2026-02-12', day: 'Mittwoch', times: ['10:00', '13:00', '14:30', '16:30'] },
    { date: '2026-02-13', day: 'Donnerstag', times: ['09:00', '11:30', '14:00'] },
    { date: '2026-02-14', day: 'Freitag', times: ['09:00', '10:00', '11:00'] }
  ],
  getNextAvailable() {
    const slot = this.availableSlots[0];
    return {
      date: slot.date,
      day: slot.day,
      time: slot.times[0],
      formatted: `${slot.day}, ${slot.date.split('-').reverse().join('.')} um ${slot.times[0]} Uhr`
    };
  }
};

// Mock incoming requests
export const mockRequests = [
  {
    id: 1,
    channel: 'phone',
    category: 'damage',
    sender: {
      name: 'Michael Schneider',
      details: 'Vertrag: KFZ-2847291',
      phone: '+49 171 2345678'
    },
    timestamp: new Date('2026-02-07T17:45:00'),
    preview: 'Dringend - Autounfall auf der A7, brauche sofortige Hilfe',
    originalMessage: `Guten Tag,

ich hatte gerade einen Autounfall auf der A7 bei Ausfahrt Hannover-Süd. Ein anderer Fahrer ist mir hinten aufgefahren. 
Zum Glück ist niemand verletzt, aber mein Fahrzeug hat erhebliche Schäden am Heck.

Die Polizei ist informiert und nimmt den Unfall auf. Der andere Fahrer gibt seine Schuld zu.

Was muss ich jetzt tun? Kann ich den Wagen noch fahren? Brauche ich einen Gutachter?

Bitte rufen Sie mich dringend zurück!

Michael Schneider
Handynummer: 0171-2345678`,
    summary: 'Mandant meldet Auffahrunfall auf A7. Keine Verletzten, Heckschaden am Fahrzeug. Polizei vor Ort, Unfallgegner gibt Schuld zu. Bittet um dringenden Rückruf.',
    answered: false
  },
  {
    id: 2,
    channel: 'email',
    category: 'appointment',
    sender: {
      name: 'Familie Weber',
      details: 'Mandant seit 2018',
      email: 'weber.familie@gmx.de'
    },
    timestamp: new Date('2026-02-07T16:30:00'),
    preview: 'Beratungstermin wegen Altersvorsorge für unsere Kinder gewünscht',
    originalMessage: `Lieber Herr Makler,

wir möchten gerne einen Beratungstermin vereinbaren. Es geht um die Altersvorsorge für unsere beiden Kinder (8 und 11 Jahre).

Wir haben gehört, dass man schon früh mit dem Sparen anfangen sollte und würden gerne die verschiedenen Möglichkeiten besprechen.

Am besten würde uns ein Termin am späten Nachmittag passen, da wir beide berufstätig sind.

Mit freundlichen Grüßen
Thomas und Maria Weber`,
    summary: 'Familie Weber (2 Kinder, 8 und 11 Jahre) möchte Beratungstermin zur Altersvorsorge. Bevorzugt späten Nachmittag wegen Berufstätigkeit.',
    answered: false
  },
  {
    id: 3,
    channel: 'whatsapp',
    category: 'question',
    sender: {
      name: 'Lisa Hartmann',
      details: 'Vertrag: PHV-9912834',
      phone: '+49 160 9876543'
    },
    timestamp: new Date('2026-02-07T15:15:00'),
    preview: 'Schnelle Frage: Bin ich im Ausland noch versichert?',
    originalMessage: `Hi! 👋

Ich fliege nächste Woche nach Spanien (Barcelona) für 2 Wochen Urlaub.

Kurze Frage: Bin ich mit meiner Privathaftpflicht auch dort versichert? Falls ja, muss ich irgendwas beachten?

Danke! 🙏`,
    summary: 'Mandantin fragt nach Auslandsdeckung der Privathaftpflicht für 2-wöchigen Spanien-Urlaub.',
    answered: false
  },
  {
    id: 4,
    channel: 'email',
    category: 'contractChange',
    sender: {
      name: 'Dr. Andreas Müller',
      details: 'Vertrag: BU-4472918',
      email: 'a.mueller@kanzlei-mueller.de'
    },
    timestamp: new Date('2026-02-07T14:00:00'),
    preview: 'Erhöhung der Berufsunfähigkeitsrente beantragen',
    originalMessage: `Sehr geehrter Herr Makler,

aufgrund meiner kürzlichen Beförderung zum Partner in unserer Kanzlei ist mein Einkommen gestiegen. 

Ich möchte daher meine Berufsunfähigkeitsversicherung anpassen und die versicherte Rente von derzeit 2.500€ auf 4.000€ monatlich erhöhen.

Welche Unterlagen benötigen Sie von mir? Ist eine erneute Gesundheitsprüfung erforderlich?

Mit freundlichen Grüßen
Dr. Andreas Müller
Rechtsanwalt und Partner`,
    summary: 'Mandant wünscht BU-Rentenerhöhung von 2.500€ auf 4.000€ nach Beförderung. Fragt nach erforderlichen Unterlagen und Gesundheitsprüfung.',
    answered: false
  },
  {
    id: 5,
    channel: 'instagram',
    category: 'question',
    sender: {
      name: 'Julia_Fitness23',
      details: 'Neukontakt via Instagram',
      instagram: '@Julia_Fitness23'
    },
    timestamp: new Date('2026-02-07T12:45:00'),
    preview: 'DM: Suche eine gute Krankenversicherung als Selbstständige',
    originalMessage: `Hey! 

Ich bin selbstständige Fitness-Trainerin und suche eine vernünftige Krankenversicherung. 

Gerade bin ich noch gesetzlich versichert, aber die Beiträge sind echt hoch. Lohnt sich ein Wechsel in die PKV für mich?

Ich bin 28, gesund und verdiene ca. 45.000€ im Jahr.

Könnt ihr mich beraten?`,
    summary: 'Neukontakt: Selbstständige Fitness-Trainerin (28 J., 45.000€/Jahr) interessiert sich für Wechsel von GKV zu PKV.',
    answered: false
  },
  {
    id: 6,
    channel: 'email',
    category: 'documents',
    sender: {
      name: 'Petra Schulze',
      details: 'Vertrag: WG-1129384',
      email: 'petra.schulze@web.de'
    },
    timestamp: new Date('2026-02-07T11:30:00'),
    preview: 'Versicherungsbestätigung für Vermieter benötigt',
    originalMessage: `Guten Tag,

mein neuer Vermieter benötigt eine Bestätigung über meine Hausratversicherung für die neue Wohnung.

Können Sie mir bitte eine entsprechende Bescheinigung ausstellen und per E-Mail zusenden?

Die neue Adresse lautet:
Musterstraße 15
30159 Hannover

Vielen Dank im Voraus!

Mit freundlichen Grüßen
Petra Schulze`,
    summary: 'Mandantin benötigt Hausrat-Versicherungsbestätigung für neuen Vermieter. Neue Adresse: Musterstraße 15, 30159 Hannover.',
    answered: false
  },
  {
    id: 7,
    channel: 'whatsapp',
    category: 'damage',
    sender: {
      name: 'Stefan Klein',
      details: 'Vertrag: HR-3384756',
      phone: '+49 152 1234567'
    },
    timestamp: new Date('2026-02-07T10:20:00'),
    preview: 'Wasserschaden in der Küche - Rohr geplatzt!',
    originalMessage: `HILFE! 😱

Bei mir ist gerade ein Rohr unter der Spüle geplatzt! Die ganze Küche steht unter Wasser!

Ich habe den Haupthahn abgedreht, aber der Schaden ist groß. Boden, Schränke - alles durchnässt.

Was muss ich jetzt machen? Kann ich einen Handwerker rufen oder muss erst jemand von der Versicherung kommen?

Bitte schnell antworten!`,
    summary: 'Akuter Wasserschaden: Rohrbruch in Küche, Boden und Schränke betroffen. Haupthahn abgedreht. Mandant fragt nach nächsten Schritten.',
    answered: false
  },
  {
    id: 8,
    channel: 'email',
    category: 'cancellation',
    sender: {
      name: 'Markus Braun',
      details: 'Vertrag: RS-7761234',
      email: 'm.braun@outlook.de'
    },
    timestamp: new Date('2026-02-07T09:00:00'),
    preview: 'Kündigung meiner Rechtsschutzversicherung',
    originalMessage: `Sehr geehrte Damen und Herren,

hiermit kündige ich meine Rechtsschutzversicherung (Vertragsnummer RS-7761234) fristgerecht zum nächstmöglichen Termin.

Grund: Ich werde zum 01.04.2026 in die Schweiz umziehen und benötige die Versicherung nicht mehr.

Bitte bestätigen Sie mir den Kündigungstermin schriftlich.

Mit freundlichen Grüßen
Markus Braun`,
    summary: 'Mandant kündigt Rechtsschutzversicherung wegen Umzug in die Schweiz zum 01.04.2026. Bittet um schriftliche Bestätigung.',
    answered: false
  }
];

// Function to get requests sorted by priority and time
export function getSortedRequests(requests = mockRequests) {
  return [...requests].sort((a, b) => {
    const categoryA = categories[a.category];
    const categoryB = categories[b.category];
    const priorityA = priorities[categoryA.priority].order;
    const priorityB = priorities[categoryB.priority].order;
    
    // First sort by priority
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // Then by timestamp (oldest first within same priority)
    return a.timestamp - b.timestamp;
  });
}

// Function to format time ago
export function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 1) return 'Gerade eben';
  if (diffMins < 60) return `vor ${diffMins} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

// Function to format full date/time
export function formatDateTime(date) {
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
