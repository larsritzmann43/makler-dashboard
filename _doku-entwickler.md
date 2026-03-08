# TELIS FINANZ Connect – Entwickler-Dokumentation

**Stand:** März 2026 | **Prototyp, kein Produktionscode**

---

## Tech-Stack

| Technologie | Version | Zweck |
|---|---|---|
| Vanilla JS (ES Modules) | – | Gesamte App-Logik |
| Vite | 7 | Build-Tool, Dev-Server, HMR |
| Plain CSS (Custom Properties) | – | Alle Styles |
| OpenAI API (GPT-4o-mini) | – | KI-Antwortgenerierung |

Keine Frameworks, kein TypeScript, keine weiteren Runtime-Dependencies.

### Lokale Entwicklung

```bash
npm install
npm run dev       # Dev-Server mit HMR
npm run build     # Production-Build nach dist/
npm run preview   # Production-Build lokal servieren
```

---

## Datei-Architektur

```
/
├── index.html              # Layout-Shell (3 Spalten)
├── src/
│   ├── main.js             # App-Einstiegspunkt + gesamte Logik
│   ├── mockData.js         # Statische Demo-Daten
│   ├── style.css           # Alle Styles
│   ├── ai.js               # OpenAI-Integration
│   └── templates.js        # 8 Antwort-Templates
└── public/
    └── dmf-logo.png
```

### Verantwortlichkeiten

**`main.js`** – zentrales Modul; importiert aus allen anderen, nichts importiert aus ihm.
- Hält den gesamten App-State (`const state = { ... }`)
- Rendert alle UI-Bereiche via Template-Literals → `innerHTML`
- Verdrahtet alle Event-Handler
- Keine reaktive Datenbindung – explizite Re-Renders nach State-Mutationen

**`mockData.js`** – nur Daten, keine Logik außer Sortierfunktionen
- `mockRequests[]` – alle Demo-Anfragen
- `channels`, `categories`, `priorities` – Lookup-Objekte
- `initialFinanzanalysen` – Mandanten-Profile für Datenextraktion
- `getSortedRequests()`, `formatTimeAgo()`, `formatDateTime()` – Hilfsfunktionen

**`ai.js`** – OpenAI-Anbindung, isoliert
- API-Key aus `localStorage` unter `openai_api_key`
- `generateResponse(request)` – Haupt-Funktion, gibt `{ success, response, source, error }` zurück
- Fallback: Template-basierte Generierung wenn kein API-Key

**`templates.js`** – 8 statische Templates
- Platzhalter-Syntax: `[NAME]`, `[DATUM]`, `[UHRZEIT]`
- `fillTemplate(template, values)` – ersetzt Platzhalter

---

## Datenstrukturen

### Request-Objekt

```js
{
  id: number,
  channel: 'email' | 'phone' | 'whatsapp' | 'instagram' | 'backoffice' | 'portal',
  category: 'damage' | 'appointment' | 'contractChange' | 'cancellation' |
            'question' | 'documents' | 'yearEnd' | 'birthday' | 'rework',
  type?: 'yearEnd' | 'birthday' | 'rework',  // nur für Spezial-Views
  sender: {
    name: string,
    contracts?: [{ sparte, gesellschaft, vertragsnummer }],
    phone?: string,
    email?: string,
    instagram?: string
  },
  timestamp: Date,
  preview: string,
  originalMessage: string,
  summary: string,
  answered: boolean,

  // Optional: Kommunikationshistorie für Messenger-Feed
  history?: [
    { type: 'client' | 'broker' | 'system', text: string, timestamp: Date }
  ],

  // Optional: Wachstumsarchitektur-Impuls
  impulse?: {
    variant: 'opportunity' | 'risk',
    title: string,
    insight: string,
    text: string,
    messageDraft: { channel: 'whatsapp' | 'email', text: string }
  },

  // Optional: Datenextraktion
  extractedData?: {
    documentType: string,
    fields: [{ key: string, label: string, newValue: string, confidence: string }]
  },

  // Spezial-Views
  clients?: [...],    // yearEnd, birthday
  documents?: [...]   // rework
}
```

### State-Objekt

```js
const state = {
  requests: [],               // aktive Anfragen
  answeredRequests: [],       // beantwortete Anfragen
  selectedRequest: null,      // aktuell ausgewählte Anfrage
  selectedClient: null,       // ausgewählter Mandant (yearEnd/birthday/rework)
  clientProgress: {},         // nicht aktiv genutzt
  currentFilter: 'all',       // 'all' | 'high'
  currentView: 'requests',    // mobile navigation
  searchQuery: '',
  finanzanalysen: {},         // requestId → Mandanten-Profil (für Datenextraktion)
  extractionStatus: {},       // requestId → 'pending'|'accepted'|'rejected'|'undone'
  extractionSnapshots: {},    // requestId → { applied: [], snapshot: {} }
  damageSteps: {}             // requestId → ['pending'|'selected'|'sent'|'blocked', ...]
}
```

---

## Render-Architektur

Kein Reaktivitätssystem. Schema:

```
User-Aktion → State-Mutation → expliziter Re-Render-Aufruf
```

**Haupt-Render-Funktionen:**

| Funktion | Rendert |
|---|---|
| `renderRequestList()` | Linke Sidebar – Anfragen-Liste |
| `renderStandardRequestView(request)` | Mittlere Spalte + rechte KI-Sektion für Standard-Requests |
| `renderMessageFeed(request)` | Messenger-Feed in der Mitte |
| `renderDamageActionPlan(request)` | Rechte Spalte Schritte für Schadensmeldungen |
| `renderDamageDraft(request, stepIndex)` | Textentwurf-Panel in der Mitte (Schadensmeldung) |
| `renderActionPlan(category)` | Rechte Spalte Checkliste für Standard-Kategorien |
| `renderExtractedDataPanel(request)` | Datenextraktions-Panel in der Mitte |
| `renderYearEndView(request)` | Custom-View Jahresendgeschäft |
| `renderBirthdayView(request)` | Custom-View Geburtstage |
| `renderReworkView(request)` | Custom-View Nacharbeit |
| `renderAnsweredList()` | (beantwortete Liste – aktuell nicht sichtbar) |

**DOM-Elemente** werden einmalig in `const elements = { ... }` gecacht (`getElementById`).
Event-Handler auf dynamisch gerenderten Elementen werden nach jedem Re-Render neu verdrahtet.

---

## Request-Routing

`selectRequest(id)` ist der zentrale Einstiegspunkt wenn eine Anfrage angeklickt wird:

```
selectRequest(id)
├── type === 'yearEnd'  → renderYearEndView()
├── type === 'birthday' → renderBirthdayView()
├── type === 'rework'   → renderReworkView()
└── default             → renderStandardRequestView()
    ├── renderMessageFeed()
    ├── renderExtractedDataPanel()
    ├── renderImpulseCard()  (inline in renderStandardRequestView)
    ├── category === 'damage'
    │   └── renderDamageActionPlan()  [early return]
    └── default
        ├── renderActionPlan(category)
        └── generateAIResponse()
```

---

## Messenger-Feed

### Aufbau

`renderMessageFeed(request)` baut den Feed aus:
1. `request.history[]` – historische Nachrichten (nach Timestamp sortiert)
2. `request.originalMessage` als `type: 'client'` mit `request.timestamp`
3. `request.summary` als `type: 'system'` (KI-Zusammenfassung-Pill)

### Message-Typen

```js
// Neue Bubble in den Feed appenden (z.B. nach Chat-Eingabe)
addChatMessage(text, 'user')   // → type 'broker' (rechts, grün)
addChatMessage(text, 'ai')     // → type 'system' (zentriert, grau)

// Damage-Step-Bestätigung
sendDamageStep(request, stepIndex)  // appended 'system'-Bubble automatisch
```

### CSS-Klassen

```css
.msg--client   /* links, #f1f5f9 */
.msg--broker   /* rechts, rgba(148,193,31,0.13) */
.msg--system   /* zentriert, Pill */
```

---

## Schadensmeldung – Schritt-Workflow

### State

```js
state.damageSteps[requestId] = ['pending', 'pending', 'pending', 'pending', 'pending']
// Werte: 'pending' | 'selected' | 'sent' | 'blocked'
```

### Action-Plan-Struktur

```js
actionPlans.damage = [
  {
    text: string,
    recipient: string,
    blocksOnSend?: number[],  // Indizes, die nach Absenden gesperrt werden
    draft: (request) => string  // Entwurf-Text mit Interpolation
  }
]
```

Schritt 0 (`blocksOnSend: [1, 2, 3]`): Absenden sperrt Schritte 1–3, Schritt 4 bleibt offen.

### Funktionen

```js
renderDamageActionPlan(request)        // rendert Schritte in rechter Spalte
renderDamageDraft(request, stepIndex)  // öffnet Entwurf-Panel in mittlerer Spalte
sendDamageStep(request, stepIndex)     // setzt Status, blockt Folgeschritte, Feed-Update
```

---

## Wachstumsarchitektur (Impulse)

Impulse werden in `renderStandardRequestView` gerendert wenn `request.impulse` vorhanden:

```js
if (request.impulse?.messageDraft) {
  // Entwurf direkt in KI-Textarea laden statt AI zu generieren
  elements.aiResponseText.value = request.impulse.messageDraft.text;
}
```

Die Impuls-Karte wird in `#impulseCard` gerendert (unterhalb des Messenger-Feeds).

---

## Intelligente Datenextraktion

**State:** `state.extractionStatus[requestId]` = `'pending' | 'accepted' | 'rejected' | 'undone'`

**Ablauf:**
1. `renderExtractedDataPanel(request)` – zeigt Alt/Neu-Vergleich mit Checkboxen
2. „Übernehmen" → `applyExtraction(request, selectedKeys)` – schreibt in `state.finanzanalysen`
3. „Rückgängig" → `undoExtraction(request)` – stellt Snapshot wieder her (30s Fenster)

Die Finanzanalyse-Daten (`state.finanzanalysen`) werden als Vergleichswert verwendet.

---

## CSS-System

Design-Tokens als Custom Properties in `:root`:

```css
--color-primary: #94c11f      /* DMF Grün */
--color-bg-card: #ffffff
--color-border: #d1d5db
--color-text-primary: #2a2a2a
--color-text-muted: #6e7378
--shadow-sm / --shadow-md / --shadow-lg
--space-xs bis --space-2xl    /* 0.25rem – 3rem */
--radius-sm / --radius-md / --radius-lg / --radius-full
--font-size-xs bis --font-size-2xl
```

BEM-ähnliche Klassen-Konvention: `.block__element--modifier`

---

## Resizable Columns

`setupResizeHandles()` in `main.js`:
- Zwei Drag-Handles (`#resizeHandleLeft`, `#resizeHandleRight`)
- Ändert `dashboard.style.gridTemplateColumns` via `mousedown/mousemove/mouseup`
- Mindestbreiten: Links 200px, Mitte 300px, Rechts 220px

---

## Neue Vorgangsart hinzufügen

1. **`mockData.js`**: Neues Objekt in `categories` + Anfrage-Objekte in `mockRequests`
2. **`main.js` `actionPlans`**: Neues Array für die Kategorie
3. **`selectRequest()`**: Ggf. neuen `if (request.type === ...)` Branch hinzufügen
4. **Render-Funktion**: `renderXxxView(request)` oder Standard-Vorgehensplan reicht
5. **`style.css`**: Kategorie-spezifische Styles (Chip-Farbe: `.request-category--xxx`)

---

## KI-Integration

`src/ai.js` → `generateResponse(request)`:

- **Mit API-Key:** OpenAI `/v1/chat/completions`, Model `gpt-4o-mini`, max 500 Tokens, Temp 0.7
- **Ohne API-Key:** Template-Fallback via `getTemplatesByCategory(category)`
- API-Key: `localStorage.getItem('openai_api_key')`
- Fehlerbehandlung: 401 → Hinweis auf ungültigen Key; sonstiger Fehler → Template-Fallback

---

## Bekannte Einschränkungen

- Kein echter Nachrichtenversand
- Kein Backend, keine Persistenz (Reload = Reset)
- Keine Authentifizierung
- Browser-only (API-Key im localStorage = nicht für Produktion geeignet)
- Keine Tests konfiguriert
