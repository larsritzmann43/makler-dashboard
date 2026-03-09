# TELIS FINANZ Connect – Vorgehensweise & Umsetzungsplan

**Stand:** März 2026 | **Autor:** Lars Ritzmann
**Scope:** TELIS FINANZ AG, Deutsches Maklerforum AG, DEMA Deutsche Versicherungsmakler AG

---

## Ausgangslage

Der Prototyp „TELIS FINANZ Connect" wurde dem Vorstand präsentiert und hat unmittelbar eine strategische Diskussion über die Umsetzung ausgelöst. Der Auftrag lautet: Ein konkretes, professionell strukturiertes Umsetzungskonzept erarbeiten – mit klaren Schritten, nachvollziehbarer Priorisierung und bi-wöchentlichen Fortschrittsberichten an den Vorstand.

---

## Vision in drei verkaufbaren Ausbaustufen

Jede Stufe hat einen eigenständigen Mehrwert – auch ohne die nächste. Das ermöglicht frühe Erfolge und kontrolliertes Wachstum.

---

### Stufe 1 – Unified Inbox
**Kernbotschaft:** „Unsere Berater sehen alle Mandanten-Kontakte an einem Ort."

**Was geliefert wird:**
- Alle Eingangskanäle in einer einzigen, priorisierten Liste: E-Mail, WhatsApp, Telefon, Instagram, Mandantenportal, Backoffice-Benachrichtigungen
- Automatische Prioritätssortierung nach Vorgangsart (Schaden = dringend, Kündigung = normal)
- Suchfunktion, Statusverwaltung, Archivierung
- Kanalübergreifende Ansicht ohne Wechsel zwischen Systemen

**Noch nicht enthalten:** KI, Intelligenz, Datenintegration

> ⚠️ **API-Abhängigkeit:** Anbindung der Eingangskanäle erfordert Schnittstellen zu WhatsApp Business API, E-Mail-Servern und ggf. Telefonie-Systemen. Diese müssen parallel beauftragt werden.

---

### Stufe 2 – Context Layer
**Kernbotschaft:** „Der Berater kennt den vollständigen Kontext – sofort, ohne Suchen."

**Was geliefert wird:**
- Vollständige, scrollbare Kommunikationshistorie je Mandant (Messenger-Feed: Mandant links, Makler rechts, System zentriert)
- KI-generierte Zusammenfassung der eingehenden Nachricht
- Automatischer Antwortvorschlag per KI, editierbar und versendbar
- Strukturierter Vorgehensplan je Vorgangsart (Schadensmeldung, Terminanfrage, Vertragsänderung etc.)

> ⚠️ **API-Abhängigkeit:** LLM-Integration (OpenAI oder alternatives Modell) – im Prototyp bereits funktionsfähig vorhanden, muss für Produktion skaliert und datenschutzkonform betrieben werden.

---

### Stufe 3 – Intelligence Layer
**Kernbotschaft:** „Das System denkt mit – und steuert aktiv in Umsatzaktivitäten."

**Was geliefert wird:**
- Kontextuelle Impulse im richtigen Moment: Upselling, Retention, Empfehlungsanlässe
- Intelligente Datenextraktion aus Mandanten-Dokumenten direkt in die Finanzanalyse
- Wachstumsarchitektur: eingesparte Zeit wird automatisch in wertschöpfende Aktivitäten gelenkt
- Rückschreibung in die Mandantenakte

> ⚠️ **API-Abhängigkeit:** Lesender und schreibender Zugriff auf die zentrale Mandantendatenbank (CRM) ist Voraussetzung für diese Stufe. Das ist die kritischste technische Abhängigkeit im gesamten Projekt.

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

## Bi-Weekly Milestone-Plan (erste 12 Wochen)

| KW | Zeitraum | Arbeitspaket | Vorstandsupdate |
|---|---|---|---|
| **1–2** | März 2026 | Discovery-Struktur finalisieren · Führungskräfte briefen · Gesprächsleitfäden schreiben | – |
| **3–4** | April 2026 | Führungskräfte-Interviews durchführen (Schicht 1) | **Update 1:** Discovery gestartet, Methodik, erste qualitative Signale |
| **5–6** | April 2026 | Berater-Interviews (Schicht 2) · Fachabteilungen (Schicht 3) | **Update 2:** Feldarbeit läuft, erste Pain-Point-Cluster sichtbar |
| **7–8** | Mai 2026 | Auswertung · Priorisierungs-Matrix · Stufe-1-Konzept ausformulieren | **Update 3:** Discovery-Ergebnisse, Priorisierung zur Entscheidung vorlegen |
| **9–10** | Mai 2026 | Technisches Scoping Stufe 1 · API-Aufwände schätzen · Kanalanbindungen klären | **Update 4:** Umsetzungsplan Stufe 1 mit Ressourcenbedarf |
| **11–12** | Juni 2026 | Fachkonzept Stufe 1 finalisieren · Entwicklerteam / Vergabe vorbereiten | **Update 5:** Stufe 1 ready to build – Startschuss beantragen |

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

**Für die Discovery-Phase:**
- Mind. 12 Berater-Interviews geführt und ausgewertet
- Klare Top-3 Pain-Points je Nutzergruppe dokumentiert
- Mindestens eine überraschende Erkenntnis, die den Fokus verändert

**Für Stufe 1:**
- Ein Berater kann eine eingehende Anfrage von Eingang bis Antwort ohne Systemwechsel bearbeiten
- Subjektive Zeitersparnis messbar (Selbstauskunft Berater)
- Akzeptanzrate in Pilot-Gruppe > 70 %

**Langfristig (Stufe 3):**
- Messbare Erhöhung der Abschlussquote in Pilot-Gruppe
- Kontaktfrequenz je Mandant steigt
- Direkt auf Impulse zurückführbare Abschlüsse dokumentiert
