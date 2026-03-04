// Mock data for the insurance broker dashboard

// Channel definitions
export const channels = {
  email: { icon: '📧', name: 'E-Mail', color: '#1976d2' },
  phone: { icon: '📞', name: 'Telefon', color: '#43a047' },
  whatsapp: { icon: '💬', name: 'WhatsApp', color: '#25d366' },
  instagram: { icon: '📸', name: 'Instagram', color: '#e1306c' },
  backoffice: { icon: '🏢', name: 'Backoffice', color: '#6a1b9a' },
  portal: { icon: '🌐', name: 'Mandantenportal', color: '#0277bd' }
};

// Priority definitions
export const priorities = {
  high: { label: 'Dringend', color: '#e53935', order: 1 },
  normal: { label: 'Normal', color: '#4caf50', order: 2 }
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
    priority: 'normal',
    icon: '📅'
  },
  contractChange: {
    name: 'Vertragsänderung',
    priority: 'normal',
    icon: '📝'
  },
  cancellation: {
    name: 'Kündigung',
    priority: 'normal',
    icon: '❌'
  },
  question: {
    name: 'Allgemeine Frage',
    priority: 'normal',
    icon: '❓'
  },
  documents: {
    name: 'Dokumentenanforderung',
    priority: 'normal',
    icon: '📄'
  },
  yearEnd: {
    name: 'Jahresendgeschäft',
    priority: 'high',
    icon: '📊'
  },
  birthday: {
    name: 'Geburtstage',
    priority: 'normal',
    icon: '🎂'
  },
  rework: {
    name: 'Nacharbeit',
    priority: 'high',
    icon: '📋'
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
      contracts: [
        { sparte: 'KFZ', gesellschaft: 'HUK-COBURG', vertragsnummer: 'KFZ-2847291' }
      ],
      phone: '+49 171 2345678'
    },
    timestamp: new Date('2026-03-04T08:45:00'),
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
      contracts: [],
      email: 'weber.familie@gmx.de'
    },
    timestamp: new Date('2026-03-03T16:30:00'),
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
    channel: 'portal',
    category: 'question',
    sender: {
      name: 'Lisa Hartmann',
      contracts: [
        { sparte: 'Haftpflicht', gesellschaft: 'VHV Versicherungen', vertragsnummer: 'PHV-9912834' }
      ],
      phone: '+49 160 9876543'
    },
    timestamp: new Date('2026-03-03T09:15:00'),
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
      contracts: [
        { sparte: 'Berufsunfähigkeit', gesellschaft: 'Alte Leipziger', vertragsnummer: 'BU-4472918' }
      ],
      email: 'a.mueller@kanzlei-mueller.de'
    },
    timestamp: new Date('2026-03-02T14:00:00'),
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
      contracts: [],
      instagram: '@Julia_Fitness23'
    },
    timestamp: new Date('2026-03-01T12:45:00'),
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
      contracts: [
        { sparte: 'Hausrat', gesellschaft: 'DEVK', vertragsnummer: 'HR-1129384' }
      ],
      email: 'petra.schulze@web.de'
    },
    timestamp: new Date('2026-02-28T11:30:00'),
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
      contracts: [
        { sparte: 'Hausrat', gesellschaft: 'Allianz', vertragsnummer: 'HR-3384756' }
      ],
      phone: '+49 152 1234567'
    },
    timestamp: new Date('2026-03-04T10:20:00'),
    preview: 'Fahrrad an der Uni geklaut!',
    originalMessage: `Hey, mir wurde gerade mein Fahrrad an der Uni geklaut! 😡

Ich hatte es vor der Bibliothek abgeschlossen und als ich nach 2 Stunden rauskam, war es weg. Das Schloss war aufgebrochen.

Es ist ein Canyon Roadlite, ca. 1.200 EUR wert. Ich habe es erst letztes Jahr gekauft.

Ich habe schon eine Anzeige bei der Polizei gemacht und das Aktenzeichen bekommen.

Was muss ich jetzt tun, damit die Versicherung zahlt? Welche Unterlagen braucht ihr?`,
    summary: 'Fahrraddiebstahl an der Uni: Canyon Roadlite (ca. 1.200 EUR), Schloss aufgebrochen. Polizeiliche Anzeige bereits erstattet. Mandant fragt nach Ablauf der Schadenmeldung.',
    answered: false
  },
  {
    id: 8,
    channel: 'email',
    category: 'cancellation',
    sender: {
      name: 'Markus Braun',
      contracts: [
        { sparte: 'Rechtsschutz', gesellschaft: 'ARAG', vertragsnummer: 'RS-7761234' }
      ],
      email: 'm.braun@outlook.de'
    },
    timestamp: new Date('2026-02-27T09:00:00'),
    preview: 'Kündigung meiner Rechtsschutzversicherung',
    originalMessage: `Sehr geehrte Damen und Herren,

hiermit kündige ich meine Rechtsschutzversicherung (Vertragsnummer RS-7761234) fristgerecht zum nächstmöglichen Termin.

Grund: Ich werde zum 01.04.2026 in die Schweiz umziehen und benötige die Versicherung nicht mehr.

Bitte bestätigen Sie mir den Kündigungstermin schriftlich.

Mit freundlichen Grüßen
Markus Braun`,
    summary: 'Mandant kündigt Rechtsschutzversicherung wegen Umzug in die Schweiz zum 01.04.2026. Bittet um schriftliche Bestätigung.',
    answered: false
  },
  {
    id: 9,
    channel: 'backoffice',
    category: 'yearEnd',
    type: 'yearEnd',
    sender: {
      name: 'Backoffice TELIS',
      details: 'Interne Benachrichtigung'
    },
    timestamp: new Date('2026-03-04T08:00:00'),
    preview: 'Potenziale Jahresendgeschäft – 12 Mandanten zu beraten',
    originalMessage: `Sehr geehrter Berater,

anbei erhalten Sie Ihre aktuelle Liste der Mandanten mit Potenzial im Jahresendgeschäft. Bitte kontaktieren Sie die folgenden Mandanten zeitnah, um die entsprechenden Beratungsgespräche zu führen.

Ziel: Alle relevanten Themen wie Basisrente, Riester-Optimierung, betriebliche Altersvorsorge und steuerliche Gestaltung bis zum Jahresende besprechen.

Mit freundlichen Grüßen
Ihr Backoffice-Team`,
    summary: '12 Mandanten mit Potenzial im Jahresendgeschäft identifiziert. Beratungsgespräche zu Basisrente, Riester, bAV und Steueroptimierung empfohlen.',
    answered: false,
    clients: [
      { id: 'ye1', name: 'Thomas Richter', age: 52, topic: 'Basisrente (Rürup) optimieren', potential: '€ 2.100/Jahr', status: 'offen', phone: '+49 171 5551001', email: 'richter@example.de' },
      { id: 'ye2', name: 'Sandra Hoffmann', age: 44, topic: 'Riester-Zulage prüfen & Beitrag anpassen', potential: '€ 1.800/Jahr', status: 'offen', phone: '+49 160 5551002', email: 'hoffmann@example.de' },
      { id: 'ye3', name: 'Klaus-Dieter Bauer', age: 58, topic: 'Betriebliche Altersvorsorge – Entgeltumwandlung erhöhen', potential: '€ 3.200/Jahr', status: 'offen', phone: '+49 152 5551003', email: 'bauer@example.de' },
      { id: 'ye4', name: 'Martina Vogel', age: 39, topic: 'Steueroptimierung durch Sonderausgaben', potential: '€ 1.500/Jahr', status: 'offen', phone: '+49 171 5551004', email: 'vogel@example.de' },
      { id: 'ye5', name: 'Bernd Schäfer', age: 63, topic: 'Letzte Basisrente-Einzahlung vor Rente', potential: '€ 4.500/Jahr', status: 'offen', phone: '+49 160 5551005', email: 'schaefer@example.de' },
      { id: 'ye6', name: 'Elke Zimmermann', age: 47, topic: 'Riester + bAV Kombination optimieren', potential: '€ 2.800/Jahr', status: 'offen', phone: '+49 152 5551006', email: 'zimmermann@example.de' },
      { id: 'ye7', name: 'Jürgen Wolf', age: 55, topic: 'Fondsgebundene Rentenversicherung – Zuzahlung', potential: '€ 5.000/Einmal', status: 'offen', phone: '+49 171 5551007', email: 'wolf@example.de' },
      { id: 'ye8', name: 'Claudia Fischer', age: 36, topic: 'BU-Absicherung + steuerliche Vorteile', potential: '€ 1.200/Jahr', status: 'offen', phone: '+49 160 5551008', email: 'fischer@example.de' },
      { id: 'ye9', name: 'Peter Neumann', age: 49, topic: 'Direktversicherung über Arbeitgeber', potential: '€ 2.400/Jahr', status: 'offen', phone: '+49 152 5551009', email: 'neumann@example.de' },
      { id: 'ye10', name: 'Gabriele Schwarz', age: 60, topic: 'Kapitalauszahlung vs. Verrentung beraten', potential: 'Bestandssicherung', status: 'offen', phone: '+49 171 5551010', email: 'schwarz@example.de' },
      { id: 'ye11', name: 'Ralf Krüger', age: 42, topic: 'Nachhaltige Altersvorsorge – ESG Fonds', potential: '€ 1.800/Jahr', status: 'offen', phone: '+49 160 5551011', email: 'krueger@example.de' },
      { id: 'ye12', name: 'Monika Braun', age: 51, topic: 'Rürup + private RV Kombination', potential: '€ 3.000/Jahr', status: 'offen', phone: '+49 152 5551012', email: 'braun@example.de' }
    ]
  },
  {
    id: 10,
    channel: 'backoffice',
    category: 'birthday',
    type: 'birthday',
    sender: {
      name: 'Backoffice TELIS',
      details: 'Interne Benachrichtigung'
    },
    timestamp: new Date('2026-03-04T07:00:00'),
    preview: 'Heutige Geburtstage – 5 Mandanten gratulieren',
    originalMessage: `Guten Morgen,

die folgenden Mandanten haben heute und in den kommenden Tagen Geburtstag. Nutzen Sie die Gelegenheit, um die Kundenbeziehung zu stärken!

Tipp: Eine persönliche Geburtstagsnachricht zeigt Wertschätzung und stärkt die Kundenbindung nachhaltig.

Ihr Backoffice-Team`,
    summary: '5 Mandanten mit Geburtstagen heute und in den nächsten Tagen. Verschiedene Gratulationsmöglichkeiten verfügbar.',
    answered: false,
    clients: [
      { id: 'bd1', name: 'Helga Meier', age: 65, birthday: '23.02.', daysUntil: 0, since: '2015', phone: '+49 171 6661001', email: 'meier.helga@example.de' },
      { id: 'bd2', name: 'Wolfgang Lehmann', age: 50, birthday: '23.02.', daysUntil: 0, since: '2019', phone: '+49 160 6661002', email: 'lehmann.w@example.de' },
      { id: 'bd3', name: 'Sabine Keller', age: 40, birthday: '24.02.', daysUntil: 1, since: '2020', phone: '+49 152 6661003', email: 'keller.s@example.de' },
      { id: 'bd4', name: 'Hans-Peter Winkler', age: 70, birthday: '25.02.', daysUntil: 2, since: '2012', phone: '+49 171 6661004', email: 'winkler.hp@example.de' },
      { id: 'bd5', name: 'Christine Hartmann', age: 45, birthday: '26.02.', daysUntil: 3, since: '2017', phone: '+49 160 6661005', email: 'hartmann.c@example.de' }
    ]
  },
  {
    id: 11,
    channel: 'backoffice',
    category: 'rework',
    type: 'rework',
    sender: {
      name: 'Backoffice TELIS',
      details: 'Interne Benachrichtigung'
    },
    timestamp: new Date('2026-03-04T09:30:00'),
    preview: 'Nacharbeit – 3 offene Dokumente von Gesellschaften',
    originalMessage: `Sehr geehrter Berater,

für die folgenden Vorgänge liegen Nacharbeiten von Versicherungsgesellschaften vor. Die Gesellschaften benötigen jeweils noch Unterschriften oder Unterlagen vom Kunden, bevor die Anträge weiterbearbeitet werden können.

Bitte nehmen Sie zeitnah Kontakt mit den betroffenen Mandanten auf und stellen Sie die Dokumente zur Unterschrift zu.

Mit freundlichen Grüßen
Ihr Backoffice-Team`,
    summary: '3 offene Nacharbeiten von Versicherungsgesellschaften. Unterschriften und Unterlagen von Mandanten erforderlich.',
    answered: false,
    documents: [
      {
        id: 'rw1',
        clientName: 'Frank Bergmann',
        clientPhone: '+49 171 7771001',
        clientEmail: 'bergmann.frank@example.de',
        company: 'Allianz Lebensversicherung',
        documentType: 'Nachtrag zur Berufsunfähigkeitsversicherung',
        description: 'Die Allianz benötigt eine unterschriebene Gesundheitserklärung (Nachtrag) für die beantragte BU-Erhöhung. Der Mandant muss das Formular unterschreiben und ggf. aktuelle Arztbefunde beilegen.',
        contractNumber: 'BU-2024-88431',
        deadline: '28.02.2026',
        priority: 'high',
        status: 'offen'
      },
      {
        id: 'rw2',
        clientName: 'Ingrid Sommer',
        clientPhone: '+49 160 7771002',
        clientEmail: 'sommer.i@example.de',
        company: 'HDI Versicherung',
        documentType: 'SEPA-Lastschriftmandat',
        description: 'Das SEPA-Mandat für den neuen Hausrat-Vertrag fehlt. Die HDI kann den Vertrag erst policieren, wenn das unterschriebene Mandat vorliegt.',
        contractNumber: 'HR-2026-12093',
        deadline: '05.03.2026',
        priority: 'normal',
        status: 'offen'
      },
      {
        id: 'rw3',
        clientName: 'Rainer Fuchs',
        clientPhone: '+49 152 7771003',
        clientEmail: 'fuchs.r@example.de',
        company: 'Württembergische Versicherung',
        documentType: 'Beratungsdokumentation (§ 61 VVG)',
        description: 'Die Württembergische hat die Beratungsdokumentation zur Kfz-Versicherung zurückgewiesen. Der Mandant muss die korrigierte Version unterschreiben.',
        contractNumber: 'KFZ-2026-44712',
        deadline: '01.03.2026',
        priority: 'normal',
        status: 'offen'
      }
    ]
  },
  {
    id: 12,
    channel: 'whatsapp',
    category: 'question',
    sender: {
      name: 'Tim Bergmann',
      contracts: [],
      phone: '+49 176 8834521'
    },
    timestamp: new Date('2026-03-04T11:10:00'),
    preview: 'E-Auto gekauft – welche Versicherung brauche ich?',
    originalMessage: `Hallo! 🚗⚡

Ich habe mir gerade einen Tesla Model 3 bestellt und brauche eine vernünftige Versicherung dafür.

Ein Kollege hat Sie mir empfohlen. Worauf muss ich bei der Versicherung für ein Elektroauto besonders achten? Gibt es spezielle Tarife für E-Autos?

Lieferung ist voraussichtlich Ende März.

Danke vorab!
Tim Bergmann`,
    summary: 'Neukontakt per Empfehlung: Tesla Model 3 bestellt, sucht E-Auto-Versicherung. Lieferung Ende März. Fragt nach speziellen E-Auto-Tarifen.',
    answered: false
  },
  {
    id: 13,
    channel: 'phone',
    category: 'damage',
    sender: {
      name: 'Ingrid Sommer',
      contracts: [
        { sparte: 'Gebäude', gesellschaft: 'Provinzial', vertragsnummer: 'WG-5529183' },
        { sparte: 'Hausrat', gesellschaft: 'HDI Versicherung', vertragsnummer: 'HR-5529741' }
      ],
      phone: '+49 160 7771002'
    },
    timestamp: new Date('2026-03-03T18:45:00'),
    preview: 'Sturmschaden am Dach – Ziegel abgedeckt, Wasser läuft rein',
    originalMessage: `Guten Abend,

nach dem Sturm heute Nachmittag fehlen bei uns mehrere Dachziegel. Es regnet bereits ins Dachgeschoss rein und die Decke im Schlafzimmer hat schon Wasserflecken.

Ich habe eine Plane notdürftig über die offene Stelle gelegt, aber das hält nicht lange.

Können Sie mir helfen? Brauche ich einen Dachdecker und übernimmt das die Wohngebäudeversicherung?

Ingrid Sommer
Tel: 0160-7771002`,
    summary: 'Akuter Sturmschaden: Dachziegel abgedeckt, Wassereintritt ins Dachgeschoss. Notdürftig mit Plane abgedeckt. Fragt nach Kostenübernahme durch Wohngebäudeversicherung.',
    answered: false
  },
  {
    id: 14,
    channel: 'email',
    category: 'contractChange',
    sender: {
      name: 'Sarah & Daniel Koch',
      contracts: [
        { sparte: 'Haftpflicht', gesellschaft: 'Gothaer', vertragsnummer: 'PHV-8821455' },
        { sparte: 'Berufsunfähigkeit', gesellschaft: 'Nürnberger', vertragsnummer: 'BU-8823901' }
      ],
      email: 'koch.family@gmail.com'
    },
    timestamp: new Date('2026-03-02T09:20:00'),
    preview: 'Nachwuchs kommt! Welche Versicherungen müssen wir anpassen?',
    originalMessage: `Lieber Herr Ritzmann,

wir freuen uns Ihnen mitzuteilen, dass wir im Juni unser erstes Kind erwarten! 🎉

Jetzt haben wir natürlich einige Fragen:
- Muss unsere Haftpflicht angepasst werden (Familien-Tarif)?
- Brauchen wir eine Risikolebensversicherung?
- Sarah geht 12 Monate in Elternzeit – hat das Auswirkungen auf die BU?
- Ab wann sollte man eine Kinderunfallversicherung abschließen?

Könnten wir einen Termin machen, um das alles in Ruhe durchzusprechen?

Herzliche Grüße
Sarah & Daniel Koch`,
    summary: 'Nachwuchs im Juni erwartet. Fragen zu: Familientarif PHV, Risikoleben, BU während Elternzeit, Kinderunfallversicherung. Wünschen Beratungstermin.',
    answered: false
  }
];

// Function to get requests sorted by date (newest first)
export function getSortedRequests(requests = mockRequests) {
  return [...requests].sort((a, b) => {
    // Sort by timestamp, newest first
    return b.timestamp - a.timestamp;
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
