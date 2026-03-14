# Projekt IQ – Vorgehensweise & Umsetzungsplan

**Stand:** März 2026 | **Autor:** Lars Ritzmann
**Scope:** TELIS Unternehmensgruppe

---

## Ausgangslage

Der Prototyp „Projekt IQ" wurde dem Vorstand präsentiert und hat unmittelbar eine strategische Diskussion über die Umsetzung ausgelöst. Der Auftrag lautet: Ein konkretes, professionell strukturiertes Umsetzungskonzept erarbeiten – mit klaren Schritten, nachvollziehbarer Priorisierung und zwei-wöchentlichen Fortschrittsberichten an den Vorstand.

---

## Vision in drei verkaufbaren Ausbaustufen

**Wichtige Vorbemerkung:** Ausbaustufe 1 enthält bereits alle drei Spalten / Layer in ihrer ersten Ausprägung. Stufe 2 und 3 beschreiben die spätere Weiterentwicklung dieser Layer. Jede Stufe hat einen eigenständigen Mehrwert – auch ohne die nächste. Das ermöglicht frühe Erfolge, kontrolliertes Wachstum und klare Entscheidungspunkte für die Weiterentwicklung.


---


### Ausbaustufe 1 – "IQ Inbox 2026" 
**Kernbotschaft:** „IQ bündelt Eingänge an einem Ort, lernt den Kontext und speichert erkannte Daten und die aktuelle Kommunikation im Mandantenfenster."

Ausbaustufe 1 liefert die drei Spalten des Systems in ihrer ersten, produktiven Form.

---

#### Konzeptfragen & Entscheidungen

Die folgenden Fragen wurden vor der Detailspezifikation gestellt und beantwortet.

**Spalte 1 – Unified Inbox:**

1. **Eingangskanäle – technische Anbindung:** Wie kommen die Nachrichten technisch ins System? Pull-Modell, Push-Modell, manuelle Weiterleitung?
> **Entscheidung:** Abhängig von den noch zu ermittelnden Services. Pull- oder Push-Modell wird je Kanal entschieden. Die Weiterleitung von Nachrichten an IQ ist ein zentrales Feature und muss kanalübergreifend funktionieren.

2. **Was ist eine „Nachricht" genau?** Einzelne Nachrichten oder gruppierte Konversationen?
> **Entscheidung:** Gruppierungslogik: Alle WhatsApp-Nachrichten desselben Absenders innerhalb von **24 Stunden** = eine Konversation (ein Inbox-Eintrag). SMS und E-Mail = je Nachricht ein **einzelner Vorgang**, keine Gruppierung.

3. **Sortierung & Priorisierung:** Mehrere Farben oder eine einzige Markierung?
> **Entscheidung:** Binär – **dringend ja/nein**, nur ein roter Punkt. Als dringend gelten: **Schaden** und **Kündigung**. Alle anderen ohne Kennzeichnung. Keine Farbabstufungen, keine Umsortierung. Älteste oben, neueste unten. Makler arbeitet sich von oben nach unten durch.

4. **Statusverwaltung:** Keine Statusverwaltung, oder doch ein minimaler Status?
> **Entscheidung:** Doch eine minimale Statusverwaltung. Makler markiert Vorgang als **fertig bearbeitet**. Fertige Vorgänge werden nach oben hinausgeschoben – die linke Spalte zeigt primär unbearbeitete Vorgänge. Bearbeitete sind per **Scroll nach oben** sichtbar (Historie der letzten 24 Stunden). Nach 24 Stunden verschwinden sie aus der Inbox.

5. **Volltextsuche – Scope:** Nur Nachrichtentext oder auch Absender, Kanal etc.?
> **Entscheidung:** Suche über **allen verfügbaren Text** – Nachrichteninhalt, Antworten, Absendername, Kanal etc.

**Spalte 2 – Context Layer:**

6. **DOS-Suche – technische Realität:** Deep Link, API, Pop-Up oder Copy-Paste?
> **Entscheidung:** DOS hat derzeit **keine API**. Offene Sicherheitsthemen. KI darf nicht eigenständig im DOS arbeiten. Deep Links sind möglich → IQ öffnet ein **Pop-Up** mit der DOS-Suchmaske, vorausgefüllt mit erkannten Kommunikationsdaten.

7. **DOS-Ergebnisse zurück in IQ:** Automatisch oder manuell?
> **Entscheidung:** Zunächst **manuelle Übertragung** durch den Makler.

8. **Anhänge:** Welche Dateitypen, inline oder Download?
> **Entscheidung:** Fotos, PDFs, Sprachnachrichten. Anzeige **inline** (Bilder direkt sichtbar, PDFs als Vorschau, Audio als Player).

9. **Antwortkanal:** Über den Ursprungskanal zurück oder manuell?
> **Entscheidung:** Grundsätzlich über den **Ursprungskanal** zurück. **Ausnahmen:** Bei Eingang per Telefon oder WhatsApp wählt der Makler, ob per **E-Mail oder SMS**. IQ sendet **nicht per WhatsApp** – WhatsApp ist ein reiner Eingangskanal.

10. **Weiterleitung – an wen und wie?** Freitext, Dropdown, oder beides?
> **Entscheidung:** An beliebige **E-Mail-Adresse** oder **Telefonnummer/Handynummer**. Zusätzlich **vordefinierte Queues aus dem Innendienst** (z.B. Schadenteam, Backoffice), die hinterlegt/angebunden werden können. Kombination aus Freitext und hinterlegten Empfängern.

11. **Konversationsarchivierung:** Automatisch oder manuell abschließen?
> **Entscheidung:** Makler markiert Konversation **manuell als abgeschlossen**. Dann wird die gesamte Konversation als **Plaintext** an die DOS-Notizen übergeben. Nachrichten nach dem Abschluss starten einen neuen Vorgang.

12. **Neuen Mandanten anlegen:** Pflichtfelder und Prozess?
> **Entscheidung:** Pflichtfelder: **Name, Adresse, Telefon, E-Mail**. IQ generiert ein Formular → nach Ausfüllung ans DOS übertragen. **Vor der Speicherung** wird automatisch eine Datenschutzerklärung an den neuen Mandanten gesendet.

**Spalte 3 – Intelligence Layer:**

13. **Prozedurale Schritte – Pflege:** Fest codiert oder konfigurierbar?
> **Entscheidung:** **Konfigurierbares Backend** (Admin-Oberfläche). Berechtigte Personen können Vorgangsarten, Prozessregeln und Schrittfolgen jederzeit bearbeiten und anpassen.

14. **Intelligente Vorschläge – ab Tag 1?** Woher kommen die Vorschläge ohne Trainingsdaten?
> **Entscheidung:** Prozedurale Schritte ab Tag 1 verfügbar. Werden **vor dem Roll-Out** über ein **RAG-System** (Retrieval-Augmented Generation) antrainiert und bereitgestellt – basierend auf dokumentiertem Fachwissen.

15. **Feedback-Mechanismus:** Akzeptieren = ausführen oder nur bewerten?
> **Entscheidung:** Spalte 3 = Bewertungs- und Vorschlagsebene. Makler kann **positiv bewerten** (Akzeptieren) oder **negativ bewerten** (Ablehnen). Die tatsächliche Umsetzung (Antwort, Weiterleitung) erfolgt in **Spalte 2** (Handlungsebene).

**Übergreifend – Stufe 1 als Ganzes:**

16. **Authentifizierung:** Eigenes Login?
> **Entscheidung:** Kein eigenes Login. Authentifizierung über die **bestehende DOS-Anmeldung**. Nicht im Scope.

17. **Deployment:** Eigenständige App oder integriert?
> **Entscheidung:** Web-App, eingebettet als **eigener Menüpunkt innerhalb des bestehenden DOS**. Kein separates Tool.

18. **Echtzeit vs. Polling:** WebSocket oder Polling?
> **Entscheidung:** WebSocket oder Polling alle 60 Sekunden – **das in der Umsetzung einfachere**. Funktional gleichwertig.

19. **Offline-Fähigkeit:** Erforderlich?
> **Entscheidung:** Nein. **Immer online** ist akzeptable Voraussetzung.

20. **Datenhaltung:** Cloud, On-Premise, welche Datenbank?
> **Entscheidung:** Eigene Datenbank, **On-Premise bei TELIS**, **Oracle-Datenbank** (Infrastruktur vorhanden). Lerndatensatz: `{eingang, vorgangsart, aktion, dauer, feedback}` – ab Tag 1 strukturiert erfasst.

---

#### Konzept – Spalte 1: Unified Inbox

- Alle Kommunikationsaktivitäten an einem Ort
- **Eingangskanäle:** Welche Kanäle eingebunden werden, wird nach den Discovery-Interviews entschieden (WhatsApp, SMS, E-Mail, Telefon etc.). Technische Anbindung (Pull/Push) je Kanal individuell.
- **Gruppierungslogik:** WhatsApp-Nachrichten desselben Absenders innerhalb von 24 Stunden = eine Konversation (ein Inbox-Eintrag). SMS und E-Mail = je Nachricht ein einzelner Vorgang.
- **Sortierung:** Chronologisch – älteste oben, neueste unten. Makler arbeitet sich von oben nach unten durch.
- **Priorisierung:** Binär (dringend ja/nein). Roter Punkt bei erkannten Keywords „Schaden" und „Kündigung". Alle anderen Vorgangsarten ohne Markierung. Keine Umsortierung – nur visuelle Kennzeichnung.
- **Minimale Statusverwaltung:** Makler markiert Vorgang als fertig bearbeitet. Fertige Vorgänge werden nach oben geschoben (außerhalb des primären Sichtbereichs). Per Scroll nach oben erreichbar: Historie der letzten 24 Stunden. Nach 24 Stunden verschwinden bearbeitete Vorgänge aus der Inbox.
- **Volltextsuche:** Über allen verfügbaren Text – Nachrichteninhalt, Antworten, Absendername, Kanal etc.
- **Eigenen Vorgang anlegen:** Makler kann manuell einen neuen Vorgang erstellen (ohne eingehende Nachricht erzeugen, die nach der gleichen Logik wie die anderen Eingänge bearbeitbar sind).
- **Echtzeit-Updates:** Neue Nachrichten erscheinen automatisch (WebSocket oder Polling alle 60 Sekunden – das einfachere in der Umsetzung).

---

#### Konzept – Spalte 2: Context Layer (Handlungsebene)

**Nachrichtenanzeige:**
- Die angeklickte Nachricht wird vollständig angezeigt: Text + Anhänge
- **Anhänge inline:** Fotos direkt sichtbar, PDFs als eingebettete Vorschau, Sprachnachrichten als Audio-Player

**DOS-Mandantensuche:**
- System liest aus der Nachricht erkannte Kommunikationsdaten aus (Mobilnummer, E-Mail, Telefonnummer)
- Klick auf „Im DOS suchen" → **Pop-Up** öffnet sich mit DOS-Suchmaske, vorausgefüllt mit erkannten Daten (Deep Link)
- DOS hat derzeit keine API – KI darf nicht eigenständig im DOS arbeiten
- Ergebnisse werden vom Makler **manuell zurück in IQ übertragen** (Name, Adresse, Mandantennummer)

**Wenn Mandant nicht gefunden:**
- Makler kann manuell nach Name suchen (erneuter Pop-Up mit angepasstem Suchbegriff)
- Korrekten Mandanten auswählen
- System speichert die erkannten Kommunikationsdaten beim Mandanten im DOS → Datenanreicherung als Nebeneffekt

**Wenn Mandant neu:**
- IQ generiert ein **Mandanten-Anlage-Formular** mit Pflichtfeldern: Name, Adresse, Telefon, E-Mail
- Nach Ausfüllung wird das Formular ans DOS übertragen
- **Vor der Speicherung** wird automatisch eine Datenschutzerklärung an den neuen Mandanten (Absender) gesendet

**Antwort:**
- Makler formuliert Antwort im Context Layer (editierbares Textfeld)
- Antwort wird über den **Ursprungskanal** zurückgesendet
- **Ausnahmen Telefon und WhatsApp:** Makler wählt, ob per E-Mail oder SMS geantwortet wird. WhatsApp ist ein reiner Eingangskanal – IQ sendet nicht per WhatsApp.

**Weiterleitung:**
- Weiterleitung an **beliebige E-Mail-Adresse** oder **Telefonnummer** (Freitextfeld)
- Zusätzlich: **Vordefinierte Innendienst-Queues** auswählbar (z.B. Schadenteam, Backoffice) – im System hinterlegt und pflegbar
- Weiterleitungstext wählbar oder frei formulierbar

**Konversationsarchivierung:**
- Makler markiert Konversation **manuell als abgeschlossen**
- Gesamte Konversation wird als **Plaintext** an die DOS-Notizen des zugeordneten Mandanten übergeben
- Nachrichten, die nach dem Abschluss eingehen, starten automatisch einen **neuen Vorgang**

**Das lernende Modell (ab Tag 1):**
- System erfasst strukturiert: welcher Eingang führte zu welcher Handlung (Antwort, Weiterleitung, Eskalation)
- Lerndatensatz-Schema: `{eingang, vorgangsart, aktion, dauer, feedback}`
- Gespeichert in **Oracle-Datenbank**, On-Premise bei TELIS
- Zusätzlich: Internes Füttern des Modells mit bekannten Zusammenhängen über **RAG-System**
- Modell läuft lokal oder bei EU-Anbieter – wird parallel in Phase 0 geklärt

---

#### Konzept – Spalte 3: Intelligence Layer (Bewertungs- und Vorschlagsebene)

... Hier sollte zu Beginn nur stehen, was die KI gerade über den Vorgang versteht. Keine Interaktion durch den User, ein reines Statusfenster zum Lernen im Hintergrund. 

- Zeigt, was das System zum Vorgang gelernt hat (Vorgangsart, Intention des Mandanten, Handlungen des Maklers, Intention des Maklers)... *Prozedurale Schritte* (Regellogik): z.B. „Schaden → an Schadenteam weiterleiten" – immer gleich, kein Modell nötig
- **Prozedurale Schritte:** werden über ein RAG-System antrainiert
- **Konfigurierbares Backend:** Vorgangsarten, Prozessregeln und Schrittfolgen sind über eine Admin-Oberfläche pflegbar. Berechtigte Personen können Gelerntes anpassen – kein fest codiertes Regelwerk.

---

#### Übergreifende Rahmenbedingungen – Stufe 1

- **Authentifizierung:** Über bestehende DOS-Anmeldung. Kein eigenes Login-System.
- **Deployment:** Web-App als eigener Menüpunkt innerhalb des bestehenden DOS. Integrierter Bestandteil der Arbeitsumgebung, kein separates Tool.
- **Online-Voraussetzung:** Immer online. Keine Offline-Fähigkeit erforderlich.
- **Datenhaltung:** Eigene Oracle-Datenbank, On-Premise bei TELIS. Infrastruktur vorhanden. Lerndaten ab Tag 1 strukturiert erfasst.

**Beispiel-Workflow Schadenmeldung per WhatsApp:**
1. Nachricht erscheint in Spalte 1 mit rotem Punkt (Keyword „Schaden" erkannt)
2. Makler klickt → Spalte 2 zeigt vollständige Nachricht + Anhänge inline + Button „Im DOS suchen"
3. Pop-Up öffnet DOS-Suchmaske mit vorausgefüllter Mobilnummer → Makler findet Mandanten, überträgt Daten zurück
4. Spalte 3 zeigt: „An Schadenteam weiterleiten" (prozedural) → Makler bewertet positiv
5. Makler wechselt in Spalte 2, wählt Schadenteam-Queue als Weiterleitungsempfänger, formuliert Antwort per E-Mail oder SMS an den Mandanten
6. Makler markiert Konversation als abgeschlossen → Plaintext-Archivierung im DOS
7. Lerndatensatz wird erfasst: `{eingang: "WhatsApp", vorgangsart: "Schaden", aktion: "Weitergeleitet an Schadenteam", dauer: "4min", feedback: "akzeptiert"}`


-------------------------------------------------------


### Ausbaustufe 2 – "IQ.27 Context Layer"
**Kernbotschaft:** „IQ erkennt den vollständigen Kontext – sofort, ohne Suchen."

**Weiterentwicklung gegenüber Stufe 1:**
- Vollständige, scrollbare Kommunikationshistorie je Mandant (Messenger-Feed)
- Mandanten-Gedächtnis: Kontext aus vergangenen Vorgängen, vereinbarte Sonderkonditionen, Beschwerdehistorie – jede neue Nachricht startet nicht bei null
- KI-generierte Zusammenfassung der eingehenden Nachricht
- Automatischer Antwortvorschlag per KI, editierbar und versendbar
- Strukturierter Vorgehensplan je Vorgangsart (Schadensmeldung, Terminanfrage, Vertragsänderung etc.)
- Daten erkennen und in FA speichern
- Antworten vorschlagen
Fragen zu Mandanten und Verträgen ermöglichen

> ⚠️ **Voraussetzung:** LLM-Integration (EU-gehostetes Modell oder datenschutzkonform betriebene OpenAI-Anbindung) – Compliance-Klärung aus Phase 0 erforderlich.


-------------------------------------------------------


### Ausbaustufe 3 – "IQ.28 Intelligence Layer"
**Kernbotschaft:** „IQ denkt mit – und steuert aktiv logische Aktivitäten."

**Weiterentwicklung gegenüber Stufe 1:**
- Kontextuelle Impulse im richtigen Moment: Upselling, Retention, Empfehlungsanlässe
- Intelligente Datenextraktion aus Mandanten-Dokumenten direkt in die Finanzanalyse
- Wachstumsarchitektur: eingesparte Zeit wird automatisch in wertschöpfende Aktivitäten gelenkt
- Proaktive Kommunikation: Das System erinnert, informiert und handelt – bevor der Mandant schreibt
- Aggregierte Muster aus allen Interaktionen: proprietäres Wissen über Vorgangsarten, Häufigkeiten, Lösungswege – nicht replizierbar
- **Predictive Bestandskundenentwicklung** (Use Case 5 – siehe unten)
- **Outbound & Proaktive Bestandskommunikation** (abgeleitet aus WIFO ViKI-Analyse – siehe unten)
> ⚠️ **Voraussetzung:** Lesender und schreibender Zugriff auf die zentrale Mandantendatenbank (CRM/DOS). Das ist die kritischste technische Abhängigkeit im gesamten Projekt.

---

#### Use Case 5 – Predictive Bestandskundenentwicklung

**„Der Makler weiß immer, wen er heute anrufen muss."**

**Das Problem heute:**
Bestandskunden werden suboptimal entwickelt. Nicht aus mangelndem Willen – sondern weil kein Makler bei 100+ Kunden im Blick hat, wessen BU veraltet ist, wessen Lebensumstände sich geändert haben, wessen Vertrag sich durch ein neues Produkt deutlich verbessern ließe.

**Die Lösung – Predictive Intelligence Engine:**
Eine KI, die den gesamten Kundenstamm kontinuierlich analysiert und dem Makler täglich eine priorisierte Aktionsliste liefert:

- „Herr Bauer hat vor 3 Jahren geheiratet – seine Risikolebensversicherung ist nicht angepasst."
- „Frau Koch zahlt 340 € für ihre KFZ-Versicherung – ein Wechsel spart ihr 190 €, ideal für das Jahresgespräch."
- „Familie Schneider hat gerade ein Kind bekommen (laut letztem Gesprächsprotokoll) – Anlass für ein vollständiges Vorsorge-Update."

Zusätzlich: KI erkennt Muster, welche Kunden abwanderungsgefährdet sind – und triggert proaktiven Kontakt.

**Der Wettbewerbsvorteil:**
Kunden erleben DMF-Makler als erstaunlich aufmerksam und proaktiv. Nicht weil der Makler ein besseres Gedächtnis hat – sondern weil die KI für ihn denkt. Das ist das Versprechen „Menschlichkeit + Disziplin" aus dem Leitbild, technologisch ermöglicht.

**Business Impact:**
- Cross-Selling-Quote steigt
- Kundenbindung steigt deutlich
- Jahresgesprächsquote steigt (Erfolgsregel Nr. 3: 10 Gespräche/Woche – die KI liefert die richtigen 10)

**Technische Voraussetzungen:**
- Vollständiger Lesezugriff auf Mandantendatenbank (Verträge, Lebensumstände, Gesprächsprotokolle)
- Strukturierter Lerndatensatz aus Stufe 1 + 2 (Interaktionshistorie, Vorgangsarten, Ergebnisse)
- Produktdatenbank mit aktuellen Marktkonditionen für Vergleiche (z.B. KFZ-Prämienvergleich)
- Schreibzugriff auf DOS für automatisch erstellte Gesprächsanlässe / Wiedervorlagen

---

#### Outbound & Proaktive Bestandskommunikation (WIFO ViKI-Analyse)

**Hintergrund:** Eine Analyse des WIFO ViKI-Whitepapers (KI-gestützte Beratung im Versicherungsvertrieb) hat vier konkrete Handlungsfelder für Ausbaustufe 3 identifiziert. Das Leitthema: Das System kommuniziert proaktiv – bevor der Mandant schreibt oder ein Problem entsteht.

---

**1. Haftungsschutz als Verkaufsargument**

Das System dokumentiert automatisch jeden Beratungsanlass, jede KI-Empfehlung und jede Maklerentscheidung. Diese lückenlose Dokumentationskette ist nicht nur Compliance-Anforderung – sie ist ein aktives Verkaufsargument gegenüber dem Mandanten:

> „Ich habe Ihnen bereits im März auf den Ablauf Ihrer BU hingewiesen – das ist bei uns System, nicht Zufall."

IQ erzeugt damit nachweisbare Sorgfaltspflicht-Erfüllung – ein struktureller Vorteil gegenüber nicht-digitalisierten Wettbewerbern.

---

**2. Jahrescheck-Automatisierung**

Regulatorisch und strategisch wertvoller Touchpoint: Der Jahrescheck ist gesetzlich empfohlen und kundenbindend. IQ erkennt automatisch, welche Mandanten keinen Jahrescheck in den letzten 12 Monaten hatten, und generiert eine priorisierte Liste mit vorformuliertem Kontaktanlass.

- Integration in die tägliche Aktionsliste (Use Case 5)
- Vorformulierte Kontaktnachricht mit relevantem Anlass (z.B. Inflation, neue Produktkonditionen, Lebensveränderung)
- Feedback-Loop: Reaktion des Mandanten wird als Signal gespeichert

---

**3. Lebensereignis-Erkennung**

IQ verarbeitet alle eingehenden Nachrichten nicht nur als Vorgänge – sondern als Signalquelle für Lebensveränderungen. Erkannte Ereignisse werden als strukturierte Mandantennotizen gespeichert und triggern proaktive Handlungsvorschläge:

| Erkanntes Ereignis | Proaktiver Anlass |
|---|---|
| Heirat / Scheidung | Risikolebensversicherung, Nachlassplanung |
| Geburt eines Kindes | Vorsorge-Update, Kindergeld-Modelle |
| Immobilienkauf | Gebäudeversicherung, Finanzierungsabsicherung |
| Jobwechsel / Gehaltsänderung | BU-Anpassung, bAV |
| Ruhestand nähert sich | Rentenoptimierung, Pflegevorsorge |

Erkennung erfolgt aus Gesprächsprotokollen, Nachrichten und DOS-Daten kombiniert.

---

**4. Datenqualitäts-Score**

Nach jeder DOS-Suche in Ausbaustufe 1 bewertet IQ ab Stufe 3 die Vollständigkeit des Mandantenprofils:

- Fehlende Kontaktdaten, veraltete Adressen, fehlende E-Mail → Score sinkt
- Makler sieht beim Öffnen eines Vorgangs sofort: „Datenprofil: 3 Felder fehlen"
- System schlägt aktiv vor, fehlende Daten beim nächsten Kontakt zu erfassen

Strategischer Wert: IQ verbessert die Datenqualität im DOS als Nebeneffekt jeder Interaktion – ohne dedizierten Pflegeaufwand.

---

## Grundprinzipien der Umsetzung

**Compliance ist keine Phase – sie ist die Eintrittskarte.**
Kein Mandantendatensatz berührt das System, bevor DSGVO- und BaFin-Konformität rechtlich bestätigt ist.

**Eingangskanal-Integration und DOS-Zugriff sind separate technische Tracks.**
Welche Kanäle eingebunden werden, wird durch Discovery-Interviews entschieden. Der DOS-Zugriff in Stufe 1 ist bewusst manuell ausgelöst (kein automatischer API-Lesezugriff). Welcher Agent auf was zugreift und welches Modell genutzt wird, wird parallel zu Phase 1 geklärt – Datenschutz in jeder Tiefe.

**DOS-Anbindung gehört zu Stufe 1, nicht zu Stufe 3.**
Ein Makler, der nach der App noch manuell ins DOS tippt, hat ein System mehr – nicht eines weniger. Ohne Konversationsarchivierung gibt es keine echte Adoption.

**Rollout beginnt mit zwei Maklern, nicht mit zweihundert.**
Zwei digital-affine Pilotmakler nutzen das System unter echten Bedingungen. Erst wenn die sagen „Das spart mir wirklich Zeit" – wird ausgerollt. Kein Top-Down-Rollout.

**Daten strukturiert speichern – von Tag 1.**
Jede Interaktion wird mit Vorgangsart, Kanal, Bearbeitungszeit und Ergebnis erfasst. Das Datenschema für Lerndaten wird in Stufe 1 von Anfang an strukturiert aufgebaut. Das ist kein Feature – das ist die Architekturentscheidung, die in zwei Jahren den Wettbewerbsvorsprung ausmacht.

---

## Phasenplan

| Phase | Inhalt | Zeitraum | Produkt-Stufe | Vorstandsupdate |
|---|---|---|---|---|
| **Phase 0** | Compliance-Gutachten: DSGVO, BaFin, KI-Modell, Serverstandort · DOS-API-Klärung: Schreibzugriff, Schnittstellen, Aufwand | KW 1–2, März 2026 | Voraussetzung für alles | – |
| **Phase 1** | Discovery: Führungskräfte-Interviews (Schicht 1) · Erste qualitative Signale | KW 3–4, April 2026 | Vorbereitung Stufe 1 | **Update 1:** Discovery gestartet, Methodik, erste Signale |
| **Phase 1** | Discovery: Berater-Interviews (Schicht 2) · Fachabteilungen (Schicht 3) | KW 5–6, April 2026 | Vorbereitung Stufe 1 | **Update 2:** Pain-Point-Cluster sichtbar |
| **Phase 1** | Auswertung · Priorisierungs-Matrix · Fachkonzept Stufe 1 ausformulieren | KW 7–8, Mai 2026 | Vorbereitung Stufe 1 | **Update 3:** Discovery-Ergebnisse, Priorisierung zur Entscheidung |
| **Phase 2** | Technisches Scoping · API-Aufwände schätzen · Datenbankschema definieren · Entwicklerteam / Vergabe vorbereiten | KW 9–10, Mai 2026 | Vorbereitung Stufe 1 | **Update 4:** Umsetzungsplan mit Ressourcenbedarf |
| **Phase 2** | Fachkonzept finalisieren · Entwicklung **Stufe 1** beginnen | KW 11–12, Juni 2026 | **Stufe 1 – Unified Inbox** | **Update 5:** Startschuss Stufe 1 |
| **Phase 3** | Pilotbetrieb mit 2 Maklern · Echte Daten · Echte Kanäle · Feedback-Schleife | KW 13–18, Juli 2026 | **Stufe 1 – Pilotbetrieb** | **Update 6 & 7:** Adoptions-Signal, Anpassungen |
| **Phase 4** | Auswertung Pilot · Entscheidung Rollout · Konzept **Stufe 2** | KW 19–22, August 2026 | Übergang zu **Stufe 2 – Context Layer** | **Update 8:** Rollout-Freigabe + Stufe-2-Roadmap |
| **Phase 5** | Entwicklung Stufe 2 · EU-KI-Integration · Mandanten-Gedächtnis | ab KW 23 | **Stufe 2 – Context Layer** | fortlaufend bi-weekly |
| **Phase 6** | Stufe 3 · Impulse · Proaktivität · Datenaggregation | nach Stufe-2-Stabilisierung | **Stufe 3 – Intelligence Layer** | fortlaufend bi-weekly |

---

## Discovery-Phase – vor der ersten Zeile Code

Bevor Stufe 1 spezifiziert und gebaut werden kann, müssen echte Nutzerdaten vorliegen. Ohne sie bauen wir an den Pain-Points vorbei.

### Befragungs-Architektur

**Schicht 1 – Führungskräfte (4–6 Personen)**
- Ziel: Strategische Prioritäten, organisatorische Schmerzpunkte, Akzeptanz-Rahmenbedingungen
- Je 1–2 Führungskräfte aus TELIS, DMF, DEMA
- Einzelgespräche, 45 Minuten
- Rekrutierung: direkt durch Lars Ritzmann

**Schicht 2 – Berater / Makler Außendienst (12–15 Personen)**
- Ziel: Operative Pain-Points, Kanalgewohnheiten, Tagesablauf, Akzeptanz-Signale
- Mix: erfahrene Berater + jüngere, digital-affine Berater
- Einzelgespräche oder Kleingruppenformate, 30–45 Minuten
- Rekrutierung: über Führungskräfte aus Schicht 1

**Schicht 3 – Fachabteilungen / Innendienst (2–3 Personen)**
- Ziel: Vorgangs-Volumen, häufigste Fehlerquellen, Rückfrage-Hotspots
- Gibt das entscheidende Priorisierungssignal für Vorgangsarten

### Befragungs-Dokumente

Zu jedem Interview-Typ liegt ein ausgearbeiteter Gesprächsleitfaden vor (separate Dokumente):
- `_interview-fuehrungskraefte.md`
- `_interview-berater.md`
- `_interview-fachabteilungen.md`

Für die Auswertung und Vergleichbarkeit der Ergebnisse:
- `_auswertung-template.md`

---

## Priorisierungs-Matrix (nach Discovery zu befüllen)

| Vorgangsart | Volumen/Monat | Aufwand je Fall | Strategischer Wert | Priorität |
|---|---|---|---|---|
| Schadensmeldung | ? | hoch | hoch | TBD |
| Terminanfrage | ? | mittel | hoch | TBD |
| Vertragsänderung | ? | hoch | mittel | TBD |
| Kündigung | ? | mittel | sehr hoch (Retention) | TBD |
| Allg. Frage | ? | niedrig | mittel | TBD |
| Dokumentenanforderung | ? | niedrig | niedrig | TBD |

*Wird nach den Fachabteilungs-Interviews befüllt.*

---

## Erfolgskriterien

**Für Phase 0 (Compliance):**
- Rechtsgutachten liegt vor: klare Aussage zu KI-Modell, Serverstandort, Datenkategorien
- DOS-API: Schreibzugriff bestätigt oder Alternativlösung definiert
- Go / No-Go für den gewählten Technologie-Stack

**Für die Discovery-Phase:**
- Mind. 12 Berater-Interviews geführt und ausgewertet
- Klare Top-3 Pain-Points je Nutzergruppe dokumentiert
- Mindestens eine überraschende Erkenntnis, die den Fokus verändert

**Für Stufe 1 (Pilotbetrieb):**
- Ein Berater kann eine eingehende Anfrage von Eingang bis Antwort ohne Systemwechsel bearbeiten
- Aktennotiz landet automatisch im DOS – ohne manuellen Schritt
- Subjektive Zeitersparnis messbar (Selbstauskunft Berater)
- Akzeptanzrate in Pilot-Gruppe > 70 %

**Langfristig (Stufe 3):**
- Messbare Erhöhung der Abschlussquote in Pilot-Gruppe
- Kontaktfrequenz je Mandant steigt
- Direkt auf Impulse zurückführbare Abschlüsse dokumentiert
- Proprietäre Datenbasis: Muster über Vorgangsarten, Kanäle, Lösungswege – nicht replizierbar
