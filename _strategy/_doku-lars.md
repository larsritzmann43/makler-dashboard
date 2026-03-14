# Mein Dashboard – Persönliche Referenz

**Stand:** März 2026

---

## Schnellübersicht: Was ist aktuell implementiert?

| Feature | Status | Demo mit Request... |
|---|---|---|
| 3-Spalten-Layout, resizable | ✅ | Alle |
| Anfragen-Liste mit Priorität & Filter | ✅ | Alle |
| Messenger-Feed (links/rechts/zentriert) | ✅ | Alle |
| Gesprächshistorie (scrollbar) | ✅ | Schneider, Weber, Bergmann |
| KI-Antwortvorschlag (GPT-4o-mini) | ✅ | Alle außer Schadensmeldung |
| Vorgehensplan (Checkboxen) | ✅ | Alle außer Schadensmeldung |
| Schadensmeldung – Schritt-Workflow | ✅ | Schneider, Klein, Sommer, Bergmann |
| Wachstumsarchitektur – Impulse | ✅ | Bergmann (ID 19), Hoffmann KFZ (ID 20) |
| Intelligente Datenextraktion | ✅ | Hoffmann (ID 21), Weber K. (ID 22), Maier (ID 23) |
| Jahresendgeschäft (Listenansicht) | ✅ | ID 9 |
| Geburtstage (Listenansicht) | ✅ | ID 10 |
| Nacharbeit (Listenansicht) | ✅ | ID 11 |

---

## Die Mandanten im Demo-System

### Requests mit Gesprächshistorie (gut für Messenger-Demo)

| ID | Name | Kanal | Thema | Besonderheit |
|---|---|---|---|---|
| 1 | Michael Schneider | Telefon | Autounfall A7 | 4 Vorgeschichts-Nachrichten (Steinschlag, Rückruf) |
| 2 | Familie Weber | E-Mail | Terminanfrage Altersvorsorge | 3 Vorgeschichts-Nachrichten (Riester-Frage Jan.) |
| 19 | Thomas Bergmann | WhatsApp | Dankesmeldung nach Fahrraddiebstahl | 5 Vorgeschichts-Nachrichten + Impuls |

### Requests mit Wachstumsimpuls

| ID | Name | Impuls-Typ | Entwurf |
|---|---|---|---|
| 19 | Thomas Bergmann | Upselling: Elementarschutz fehlt | WhatsApp-Entwurf vorgefüllt |
| 20 | Peter Hoffmann (über Allianz) | Retention: KFZ-Beitragserhöhung +18% | WhatsApp-Entwurf vorgefüllt |

### Requests mit Datenextraktion

| ID | Name | Dokument | Felder |
|---|---|---|---|
| 21 | Maria Hoffmann | Rentenbescheid | Rentenerwartung, Eintrittsdatum, Bescheiddatum |
| 22 | Klaus Weber | Personalausweis | Ausweisnummer, Ausstelldatum, Ablaufdatum, Behörde |
| 23 | Sandra Maier | Einkommensänderung | Nettoeinkommen (3.200 → 3.800 €) |

### Requests mit Standard-Vorgehensplan

| ID | Name | Kategorie |
|---|---|---|
| 3 | Lisa Hartmann | Allgemeine Frage (Auslandsversicherung) |
| 4 | Dr. Andreas Müller | Vertragsänderung (BU-Erhöhung) |
| 5 | Julia_Fitness23 | Allgemeine Frage (PKV Instagram) |
| 6 | Petra Schulze | Dokumentenanforderung |
| 7 | Stefan Klein | Schadensmeldung (Fahrraddiebstahl) |
| 8 | Markus Braun | Kündigung (Rechtsschutz, Umzug CH) |
| 12 | Tim Bergmann | Allgemeine Frage (E-Auto) |
| 13 | Ingrid Sommer | Schadensmeldung (Sturmschaden Dach) |
| 14 | Sarah & Daniel Koch | Vertragsänderung (Nachwuchs) |

---

## Wie funktioniert was – in einfachen Worten

### Linke Spalte: Eingang

- Zeigt alle offenen Anfragen
- Sortierung: Dringend (rot) → Normal (grün)
- Klick auf 🔥-Badge: Filter auf nur dringende Anfragen
- Suchfeld oben: filtert nach Name, Vorschautext oder Kategorie
- „Neuer Vorgang"-Button: öffnet Modal zum Starten neuer Prozesse (Demo)

### Mittlere Spalte: Verlauf

- Öffnet sich wenn man eine Anfrage anklickt
- Oben: Name, Kategorie-Badge, Kanal-Badge, Zeitstempel, Vertragschips
- Darunter: Messenger-Feed mit gesamtem Gesprächsverlauf
  - Mandant = links (grau)
  - Makler = rechts (grün)
  - System = Mitte (kursiv, Pill-Form)
- Bei Schadensmeldung: erscheint hier der Textentwurf wenn ein Schritt angeklickt wird
- Unten: Eingabefeld – neue Nachrichten erscheinen direkt im Feed
- Bei Impulsen: Impuls-Karte erscheint unterhalb des Feeds

### Rechte Spalte: DMF.IQ

- **Vorgehensplan**: zeigt die Schritte zur Anfrage-Kategorie
  - Standard: Checkboxen, abhaken = durchgestrichen
  - Schadensmeldung: klickbare Schritt-Karten (kein Checkbox)
- **KI-Antwortvorschlag**: automatisch generiert, editierbar
  - Doppelklick auf Status-Badge = API-Key eingeben
  - Ohne API-Key: Template-Fallback
- Bei Schadensmeldung: KI-Bereich ausgeblendet, nur Schritte

### Schadensmeldung – der besondere Workflow

1. Anfrage anklicken → Messenger-Feed öffnet sich, Schritte erscheinen rechts
2. Schritt anklicken → Textentwurf erscheint in der Mitte (editierbar!)
3. „Absenden" → Schritt wird ✓, System-Pill erscheint im Feed
4. Schritt 1 (Backoffice) absenden → Schritte 2, 3, 4 werden 🔒 gesperrt (Schritt 5 bleibt)
5. Abbrechen → schließt Entwurf, Schritt zurück auf offen

---

## Demo-Reihenfolge (empfohlen für Vorstandspräsentation)

1. **Messenger-Feed zeigen**: Request 19 (Thomas Bergmann) öffnen → Verlauf nach oben scrollen → Diebstahl-Geschichte + Dankesmeldung
2. **Impuls zeigen**: Impuls-Karte bei Bergmann → Elementarschutz-Upselling → WhatsApp-Entwurf sichtbar
3. **Schadensmeldung Workflow**: Request 1 (Michael Schneider) → Schritt 2 anklicken → Entwurf editieren → Absenden
4. **Backoffice-Sperr-Logik**: Schritt 1 absenden → Schritte 2–4 werden 🔒
5. **Datenextraktion**: Request 21 (Maria Hoffmann) → Rentenbescheid → Felder übernehmen/ablehnen
6. **Retention-Impuls**: Request 20 (Allianz-Benachrichtigung) → Beitragserhöhung + Sonderkündigungsrecht
7. **Jahresendgeschäft**: Request 9 → 12 Mandanten-Liste → einzelnen Mandanten anklicken

---

## KI-Key konfigurieren

- Doppelklick auf das Status-Badge rechts oben (steht auf „Bereit" oder „Template")
- OpenAI API-Key eingeben
- Key wird im Browser gespeichert (bleibt auch nach Refresh)
- Ohne Key: Templates werden verwendet (funktioniert für Demo!)

---

## Offene Punkte / was noch nicht da ist

- Kein echter Nachrichtenversand (alles Demo)
- Keine Login-Funktion
- Keine echte Datenpersistenz (Reload = Reset)
- Impulse nur für 2 Szenarien (19 + 20)
- Datenextraktion nur für 3 Dokumenttypen (21, 22, 23)
- Mobile-Ansicht vorhanden, aber nicht priorisiert

---

## Dateien im Projekt

| Datei | Inhalt |
|---|---|
| `index.html` | Layout-Grundgerüst der App |
| `src/main.js` | Gesamte App-Logik, alle Funktionen |
| `src/mockData.js` | Alle Demo-Mandanten und Anfragen |
| `src/style.css` | Alle visuellen Styles |
| `src/ai.js` | OpenAI-Anbindung |
| `src/templates.js` | 8 vordefinierte Antwort-Templates |
| `Feature-Liste_Makler-Dashboard.md` | Vollständige technische Feature-Liste |
| `Vorgangsarten.md` | Alle Vorgangstypen mit Vorgehensplänen |
| `Wachstumsarchitektur.md` | Strategisches Konzept der Impuls-Logik |
| `_doku-vorstand.md` | Diese App erklärt für Vorstände |
| `_doku-entwickler.md` | Übergabe-Dokumentation für Entwickler |
