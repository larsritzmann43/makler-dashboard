# Projekt IQ – Produktdokumentation

**Stand:** März 2026 | **Autor:** Lars Ritzmann

---

## Was ist Projekt IQ?

Ein digitales Kommunikations-Dashboard für Finanzberater und Makler. Es bündelt alle eingehenden Mandanten-Anfragen aus verschiedenen Kanälen an einem Ort, unterstützt die Bearbeitung mit KI und leitet den Berater aktiv zu wertschöpfenden Folgeaktivitäten an.

**Kurz:** Weniger Verwaltung. Mehr Beratung.

---

## Das Problem, das wir lösen

Berater verbringen heute einen erheblichen Teil ihrer Zeit mit Kommunikationsverwaltung: E-Mails checken, WhatsApp beantworten, Schadensmeldungen weiterleiten, Geburtstage notieren. Das kostet Zeit – Zeit, die nicht für Abschlüsse, Mandantengewinnung oder echte Beratung genutzt wird.

Selbst wenn ein Tool Zeit spart, landet diese Zeit nicht automatisch in produktiven Aktivitäten. Berater wissen nach einer effizienten Kommunikationsphase oft nicht: **Was jetzt?**

Connect löst beides: Zeitersparnis **und** gezielte Steuerung in die nächste wertschöpfende Handlung.

---

## Die drei Säulen des Dashboards

### 1. Zentraler Eingang – alle Kanäle an einem Ort

Alle eingehenden Mandanten-Anfragen laufen in einer einzigen Liste zusammen – unabhängig davon, über welchen Kanal sie kommen:

- E-Mail
- Telefon
- WhatsApp
- Instagram
- Mandantenportal
- Backoffice-Benachrichtigungen

Die Liste ist nach Priorität sortiert. Dringende Anfragen (Schadensmeldungen, Fristen) erscheinen automatisch oben. Ein Klick auf einen Eintrag öffnet den vollständigen Verlauf.

---

### 2. Kommunikationsverlauf – der Berater kennt den Kontext

Wählt der Berater eine Anfrage aus, sieht er in der Mitte einen **Messenger-Feed** – ähnlich wie WhatsApp oder iMessage:

- **Mandanten-Nachrichten** erscheinen links (alle bisherigen Nachrichten dieses Mandanten)
- **Antworten des Beraters** erscheinen rechts
- **System-Hinweise** (z.B. „Schadensmeldung eingereicht", „KI-Zusammenfassung") erscheinen zentriert als neutrale Markierung

Der Berater sieht auf einen Blick: Was hat der Mandant bisher geschrieben? Was wurde bereits unternommen? Der Feed ist vollständig scrollbar – die gesamte Kommunikationshistorie ist nachvollziehbar.

---

### 3. Vorgehensplan & KI – die nächsten Schritte sind vorgegeben

Die rechte Spalte zeigt automatisch den passenden Vorgehensplan zur Anfrage:

- Bei einer **Schadensmeldung**: Klickbare Schritte (Backoffice informieren, Versicherer kontaktieren, Formulare senden etc.)
- Bei einer **Terminanfrage**: Schritte zur Terminkoordination mit automatischem Kalender-Vorschlag
- Bei einer **Vertragsänderung**: Checkliste zur Antragsbearbeitung

Parallel generiert eine KI automatisch einen fertigen Antwortvorschlag – der Berater muss nur noch prüfen, anpassen und absenden.

---

## Besondere Funktionen

### Schadensmeldung – strukturierter Workflow

Schadensmeldungen sind zeitkritisch und komplex. Connect führt den Berater durch einen strukturierten 5-Schritte-Prozess:

1. Schadenvorgang ans Backoffice übergeben *(sperrt automatisch Schritte 2–4, wenn das Backoffice übernimmt)*
2. Versicherer informieren
3. Schadenformulare an den Mandanten senden
4. Schadensersatzbeauftragten beauftragen (Polygon)
5. Mandanten über Status informieren

Jeder Klick auf einen Schritt öffnet einen fertig vorausgefüllten Nachrichtenentwurf – mit Mandantenname, Vertragsnummer und Gesellschaft. Der Berater sieht sofort, was er senden würde, kann es anpassen und mit einem Klick absenden.

---

### Wachstumsarchitektur – der Moment nach der Bearbeitung

Das entscheidende Differenzierungsmerkmal gegenüber anderen Kommunikationstools:

Im richtigen Moment – wenn eine Anfrage bearbeitet wurde und der Berater zeitlich frei ist – erscheint ein **kontextueller Impuls**: ein Hinweis auf eine wertschöpfende Folgeaktivität, die direkt zu diesem Mandanten und diesem Moment passt.

**Zwei implementierte Szenarien:**

- **Upselling-Moment:** Mandant meldet sich nach erfolgreicher Schadensregulierung und bedankt sich. Das System erkennt: Im Wohngebäudevertrag fehlt das Elementarschutz-Modul. Impuls: „Idealer Moment für ein kurzes Gespräch – kein Elementarschutz vorhanden." Inkl. fertig formulierter WhatsApp-Nachricht.

- **Retention-Risiko:** Versicherer meldet Beitragserhöhung von 18%. Mandant hat sich noch nicht gemeldet, Sonderkündigungsrecht läuft. Impuls: „Proaktiv kontaktieren, bevor der Mandant selbst kündigt." Inkl. fertig formulierter Nachricht.

Das Ziel: Die eingesparte Zeit landet nicht im Nichts, sondern direkt in Umsatzaktivitäten.

---

### Intelligente Datenextraktion – Mandantendaten automatisch erkennen

Schickt ein Mandant ein Dokument (Rentenbescheid, Personalausweis, Gehaltsnachweis), erkennt das System automatisch die relevanten Datenpunkte und schlägt deren Übernahme in die Finanzanalyse vor.

Der Berater sieht: Alter Wert → Neuer Wert. Kann einzelne Felder auswählen und mit einem Klick übernehmen – oder rückgängig machen.

---

## Was das Dashboard nicht ist

- Kein Ersatz für das bestehende CRM oder Verwaltungssystem
- Kein Produktions-System (aktuell: Prototyp/Click-Dummy für Präsentation und Konzeptvalidierung)
- Keine eigene Datenspeicherung (alle Daten sind Musterdaten für die Demo)

---

## Nächste Ausbaustufen

| Ausbaustufe | Beschreibung |
|---|---|
| **CRM-Integration** | Echte Mandantendaten statt Musterdaten |
| **Kanal-Anbindung** | Echter E-Mail-/WhatsApp-Empfang und -Versand |
| **Mehr Impulse** | Weitere Szenarien: Jubiläen, Vertragsverlängerungen, Lebensevents |
| **Produktionsreife** | Authentifizierung, Datenschutz, Rollenverwaltung |
| **Mobile App** | Native iOS/Android-Version für Berater im Außendienst |
