# Feature-Liste: TELIS FINANZ AG – Kommunikations-Dashboard

> **Zweck:** Vollständige Auflistung aller Funktionalitäten des bestehenden Prototyps als Grundlage für die Neuentwicklung.
> **Stand:** 14. Februar 2026
> **Tech-Stack Prototyp:** Vanilla JS (ES Modules), Vite, CSS Custom Properties, OpenAI API

---

## 1. Allgemeine Architektur & Layout

### 1.1 Drei-Spalten-Layout (Desktop)
- Linke Sidebar: Anfragen-Liste mit Filtern
- Mittlerer Bereich: Detail-Ansicht der ausgewählten Anfrage + Chat
- Rechte Sidebar: Vorgehensplan, KI-Antwortvorschlag, Prompt-Ergebnisse
- CSS-Grid-basiertes Layout mit `grid-template-columns`

### 1.2 Resizable Columns
- Zwei Drag-Handles zwischen den drei Spalten (links|mitte und mitte|rechts)
- Spaltenbreiten per Maus-Drag stufenlos anpassbar
- Mindestbreiten: Links 200px, Mitte 300px, Rechts 220px
- Visuelle Feedback-States beim Hovern und Ziehen
- Text-Selektion wird während des Resizens deaktiviert

### 1.3 Responsive Design / Mobile
- Breakpoints: 1200px (Sidebar schmaler), 1024px (Mobile-Layout), 480px (kleine Screens)
- Unter 1024px: Einzelansicht mit Bottom-Navigation
- Mobile Bottom-Navigation mit drei Tabs: „Anfragen", „Aktuell", „Templates"
- Panels werden per `is-visible`-Klasse ein-/ausgeblendet
- Bei Auswahl einer Anfrage automatischer Wechsel zur Detail-Ansicht

---

## 2. Navigation (TOS-Header)

### 2.1 Top-Navigation
- Sticky Header mit TELIS-Corporate-Gradient (Blau)
- Logo links (SVG von CDN: `cdn.gwvs.de`)
- Navigationslinks: Dashboard (aktiv), Mandanten, Statistik, Informationen, Viverum-Online (externer Link)
- Aktiver Tab mit weißem Unterstrich-Indikator (3px)
- Hover-Effekte auf Nav-Items

### 2.2 Header-Rechts
- Live-Datum (deutsch formatiert, z.B. „Samstag, 14. Februar 2026")
- Live-Uhrzeit (HH:MM, jede Sekunde aktualisiert)
- User-Avatar-Icon (SVG, runder Button)

---

## 3. Anfragen-Verwaltung (Linke Sidebar)

### 3.1 Anfragen-Liste
- Überschrift „Eingehende Anfragen" mit Zähler-Badge (Anzahl offener Anfragen)
- Liste aller unbeantworteten Anfragen
- Sortierung: Zuerst nach Priorität (Dringend → Mittel → Normal → Niedrig), dann nach Zeitstempel (älteste zuerst innerhalb gleicher Priorität)
- Jeder Eintrag zeigt: Kanal-Icon, Absender-Name, Zeitangabe (relativ: „vor X Min./Std."), Vorschau-Text (max. 2 Zeilen), Kategorie-Label, Prioritäts-Punkt (farbig)
- Aktiver Eintrag visuell hervorgehoben (blauer Rahmen + Hintergrund)
- Fade-In-Animation mit gestaffeltem Delay pro Listenelement

### 3.2 Prioritäts-Filter
- Filter-Buttons: Alle, Dringend (rot), Mittel (orange), Normal (grün)
- Aktiver Filter visuell hervorgehoben (ausgefüllt)
- Filtert die Anfragen-Liste in Echtzeit
- Zähler aktualisiert sich entsprechend

### 3.3 Kommunikationskanäle
- E-Mail (📧, blau #1976d2)
- Telefon (📞, grün #43a047)
- WhatsApp (💬, grün #25d366)
- Instagram (📸, pink #e1306c)
- Jeder Kanal hat eigenes Icon und eigene Hintergrundfarbe

### 3.4 Anfrage-Kategorien mit automatischer Priorität
- Schadensmeldung → Priorität: Dringend (🚨)
- Terminanfrage → Priorität: Mittel (📅)
- Vertragsänderung → Priorität: Mittel (📝)
- Kündigung → Priorität: Niedrig (❌)
- Allgemeine Frage → Priorität: Normal (❓)
- Dokumentenanforderung → Priorität: Normal (📄)

---

## 4. Anfrage-Detailansicht (Mittlerer Bereich)

### 4.1 Leer-Zustand
- Platzhalter-Icon (Sprechblase-SVG) und Text „Wählen Sie eine Anfrage aus der Liste"
- Wird ausgeblendet, sobald eine Anfrage ausgewählt ist

### 4.2 Detailinformationen
- Kanal-Icon + Kanal-Name (oben links)
- Prioritäts-Badge (oben rechts, farbig: Dringend/Mittel/Normal/Niedrig)
- Absender-Info-Box: Name (fett), Vertragsnummer/Details, Empfangszeitpunkt (deutsch formatiert)
- Kategorie-Badge (z.B. „📅 Terminanfrage")
- Zusammenfassung der Anfrage (KI-generierte Kurzfassung)
- Original-Nachricht (vollständiger Text, mit linkem blauen Rahmen, Pre-Wrap-Formatierung)

### 4.3 Zeitformatierung
- Relative Zeitangaben in der Liste: „Gerade eben", „vor X Min.", „vor X Std.", oder Datum (TT.MM.)
- Volle Datumsanzeige in der Detailansicht: „Wochentag, TT.MM.YYYY, HH:MM"
- Deutsche Lokalisierung durchgängig

---

## 5. KI-Chat-Interface (Unterer Teil Mitte)

### 5.1 Chat-Funktion
- Chat-Fenster mit Nachrichtenverlauf (max. 200px Höhe, scrollbar)
- Nachrichten-Bubbles: Benutzer (blau, rechts), KI (weiß mit Rahmen, links)
- Texteingabefeld (Textarea) mit Sende-Button (Pfeil-Icon)
- Absenden per Klick oder Enter-Taste (Shift+Enter für Zeilenumbruch)
- Chat wird ausgeblendet wenn leer (`:empty`-Pseudo-Klasse)

---

## 6. KI-Antwortvorschlag (Rechte Sidebar)

### 6.1 KI-Antwortgenerierung
- Automatische Generierung beim Auswählen einer Anfrage
- OpenAI API Integration (GPT-4o-mini)
- System-Prompt auf Deutsch mit spezifischen Richtlinien für Versicherungsmakler
- Kontextübergabe: Kategorie, Kanal, Absender, Originaltext, Zusammenfassung
- Bei Terminanfragen: Kalender-Slots werden mitgegeben
- Lade-Indikator: „Generiere..." mit Puls-Animation (orange Badge)
- Status-Anzeige: „KI generiert", „Template", „Fallback (API-Fehler)", „Fehler"

### 6.2 Fallback-System (ohne API-Key)
- Template-basierte Antwortgenerierung als Fallback
- Automatische Platzhalter-Befüllung: `[NAME]` → Anrede (Herr/Frau Nachname oder Familie XY)
- Bei Terminanfragen: `[DATUM]` und `[UHRZEIT]` werden mit nächstem freien Slot befüllt

### 6.3 API-Key-Verwaltung
- API-Key wird in localStorage gespeichert
- Konfiguration per Doppelklick auf den KI-Status-Badge
- Prompt-Dialog zeigt maskierten aktuellen Key
- Fehlerbehandlung bei ungültigem Key (401-Erkennung)

### 6.4 Antwort-Editor
- Editierbares Textarea-Feld (min. 300px Höhe, vertikal resizable)
- KI-generierte Antwort kann manuell angepasst werden
- „Neu generieren"-Button (Refresh-Icon) → generiert Antwort erneut
- „Antworten"-Button (Sende-Icon) → markiert Anfrage als beantwortet

### 6.5 Terminvorschlag-Karte
- Wird nur bei Terminanfragen angezeigt
- Zeigt vorgeschlagenes Datum und Uhrzeit
- Basiert auf Mock-Kalender mit verfügbaren Slots (Mo–Fr, verschiedene Uhrzeiten)

---

## 7. Vorgehensplan (Rechte Sidebar, oben)

### 7.1 Kategorie-basierte Aktionspläne
- Wird pro Anfrage-Kategorie automatisch angezeigt
- Fortschritts-Badge (z.B. „2/5")
- Jede Kategorie hat eigene Schritte:

**Schadensmeldung (5 Schritte):**
1. Versicherer informieren
2. Schadenformulare an Kunden senden
3. Schaden dokumentieren lassen
4. Gutachter beauftragen (falls nötig)
5. Kunden über Status informieren

**Terminanfrage (4 Schritte):**
1. Verfügbare Termine prüfen
2. Terminvorschlag an Kunden senden
3. Beratungsunterlagen vorbereiten
4. Termin im Kalender bestätigen

**Vertragsänderung (5 Schritte):**
1. Aktuelle Vertragsdaten prüfen
2. Änderungsantrag vorbereiten
3. Gesundheitsprüfung klären
4. Benötigte Unterlagen anfordern
5. Antrag an Versicherer weiterleiten

**Kündigung (4 Schritte):**
1. Kündigungsfristen prüfen
2. Alternativangebot prüfen
3. Kündigungsbestätigung erstellen
4. Kunden über Folgen informieren

**Allgemeine Frage (3 Schritte):**
1. Vertragsbedingungen prüfen
2. Fachinformation zusammenstellen
3. Kunden antworten

**Dokumentenanforderung (4 Schritte):**
1. Gewünschtes Dokument identifizieren
2. Dokument ausstellen
3. Adressdaten aktualisieren (falls nötig)
4. Dokument an Kunden senden

### 7.2 Interaktive Checkliste
- Klick auf einen Schritt markiert ihn als erledigt (Toggle)
- Erledigte Schritte: Grüner Haken, Durchstreich-Text, reduzierte Opacity
- Fortschritts-Badge aktualisiert sich automatisch
- Jeder Schritt hat Titel + Detail-Beschreibung

---

## 8. Antwort-Templates

### 8.1 Vordefinierte Templates (8 Stück)
1. **Terminbestätigung** – Mit Platzhaltern für Datum, Uhrzeit, Ort
2. **Schadensmeldung Eingang** – Bestätigung mit Schadennummer, nächste Schritte
3. **Dringender Schaden – Soforthilfe** – Sofortmaßnahmen, Rückruf-Zusage
4. **Dokumentenanforderung** – Dokument als Anhang, Angebot weiterer Hilfe
5. **Vertragsänderung Bestätigung** – Unterlagen-Anforderung, Bearbeitungsdauer
6. **Allgemeine Rückfrage** – Antwort-Platzhalter, Kontaktoptionen
7. **Kündigungsbestätigung** – Vertragsende-Datum, Rückhalte-Gesprächsangebot
8. **Versicherungsschutz Info** – Deckungsumfang, Geltungsbereich, Hinweise

### 8.2 Template-Funktionen
- Templates sind nach Kategorie filterbar (`getTemplatesByCategory`)
- Platzhalter-System mit `[KEY]`-Syntax (NAME, DATUM, UHRZEIT, NUMMER, etc.)
- `fillTemplate()`-Funktion für dynamische Platzhalter-Ersetzung
- Automatische Anrede-Erkennung: „Familie Weber" vs. „Herr/Frau Nachname"

---

## 9. Beantwortete Anfragen & Archivierung

### 9.1 Beantwortet-Liste
- Eigener Bereich in der Sidebar mit Zähler
- Zeigt: Kanal-Icon, Absender, Zeitpunkt der Beantwortung (relativ)
- Grüner Haken als Status-Indikator
- Leerzustand: „Noch keine beantworteten Anfragen"

### 9.2 Antwort senden
- Validierung: Antworttext darf nicht leer sein
- Anfrage wird als beantwortet markiert (Zeitstempel + Antworttext gespeichert)
- Anfrage verschwindet aus der offenen Liste, erscheint in der Beantwortet-Liste
- Detail-Ansicht wird zurückgesetzt (Leerzustand)
- Erfolgs-Benachrichtigung: „Antwort erfolgreich gesendet! ✓"

### 9.3 Archivierung
- Archivieren-Button pro beantworteter Anfrage
- Bestätigungs-Modal mit: Icon, Titel, Absender-Name, Erklärungstext
- Modale Überlagerung mit Backdrop-Blur
- Schließen per: Abbrechen-Button, Klick außerhalb, oder Bestätigen
- Animiertes Ein-/Ausblenden (Scale + Opacity)
- Erfolgs-Benachrichtigung: „Vorgang erfolgreich archiviert 📁"

---

## 10. Benachrichtigungen

### 10.1 Toast-Notifications
- Zentriert am unteren Bildschirmrand (100px vom unteren Rand)
- Corporate-Blau-Hintergrund, weißer Text, abgerundete Ecken
- Slide-Up-Animation beim Erscheinen
- Automatisches Ausblenden nach 2 Sekunden (Fade-Out)
- Shadow für visuelle Tiefe

---

## 11. Design-System & Styling

### 11.1 Corporate Identity – TELIS-Finanz AG
- Primärfarbe: #006FB9 (Corporate Blue), Dunkel: #004A7C, Hell: #4DA3D9
- Neutral-Töne: Blue-Gray-Palette
- Schrift: Roboto (Google Fonts), Fallback: System-Fonts
- Hintergrund: #F1F7FB (helles Blaugrau)

### 11.2 CSS Custom Properties (Design Tokens)
- Farben: Primär, Neutral, Prioritäten, Kanäle
- Shadows: sm, md, lg
- Spacing: xs (0.25rem) bis 2xl (3rem)
- Border-Radius: sm (6px) bis full (9999px)
- Typografie: xs (0.75rem) bis 2xl (1.5rem)
- Transitions: fast (150ms), base (250ms), slow (350ms)
- Layout: Header-Höhe (56px), Sidebar-Breite (320px), Mobile-Nav (70px)

### 11.3 Animationen
- `fadeIn`: Opacity 0→1 + translateY(10px→0)
- `slideIn`: Opacity 0→1 + translateX(-10px→0)
- `slideUp`: Für Notifications
- `fadeOut`: Für Notification-Ausblendung
- `pulse`: Für Lade-Status (Opacity-Wechsel)
- Gestaffelte Animations-Delays für Listen (0.05s pro Element, bis 5 Elemente)

### 11.4 Custom Scrollbars
- Breite: 6px
- Track: Hintergrundfarbe
- Thumb: Border-Farbe, rund, dunklerer Hover-State

---

## 12. Mock-Daten (für Prototyp)

### 12.1 Test-Anfragen (8 Stück)
1. Michael Schneider – Autounfall (Telefon, Schadensmeldung, Dringend)
2. Familie Weber – Altersvorsorge-Beratung (E-Mail, Terminanfrage, Mittel)
3. Lisa Hartmann – Auslandsversicherung (WhatsApp, Frage, Normal)
4. Dr. Andreas Müller – BU-Erhöhung (E-Mail, Vertragsänderung, Mittel)
5. Julia_Fitness23 – PKV-Anfrage (Instagram, Frage, Normal)
6. Petra Schulze – Versicherungsbestätigung (E-Mail, Dokumente, Normal)
7. Stefan Klein – Wasserschaden (WhatsApp, Schadensmeldung, Dringend)
8. Markus Braun – Kündigung Rechtsschutz (E-Mail, Kündigung, Niedrig)

### 12.2 Mock-Kalender
- 5 Tage mit je 3–4 verfügbaren Zeitslots
- `getNextAvailable()`-Funktion für automatischen Terminvorschlag

---

## 13. Technische Details

### 13.1 State Management
- Zentrales `state`-Objekt mit: `requests`, `answeredRequests`, `selectedRequest`, `currentFilter`, `currentView`
- Kein Framework – reines DOM-Rendering nach State-Änderungen

### 13.2 Build & Tooling
- Vite als Build-Tool und Dev-Server
- ES Modules (type: "module" in package.json)
- Keine weiteren Runtime-Dependencies (nur Vite als Dev-Dependency)

### 13.3 Lokalisierung
- Komplett auf Deutsch (Texte, Datumsformate, Zeitangaben)
- `de-DE`-Locale für `toLocaleDateString` und `toLocaleTimeString`

### 13.4 API-Integration
- OpenAI API (GPT-4o-mini): `/v1/chat/completions`
- Bearer-Token-Authentifizierung
- Max-Tokens: 500, Temperature: 0.7
- Graceful Degradation: Template-Fallback bei fehlendem API-Key oder API-Fehler
