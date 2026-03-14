# Projekt IQ – Schnelleinstieg

**Stand:** 13. März 2026

---

## Wo stehen wir gerade?

Ausbaustufe 1 ist **konzeptionell fertig** (Strategie.md) und als **Click-Dummy** präsentierbar (`_stufe1/` → öffnen mit `npx serve _stufe1`).

Ausbaustufe 3 wurde durch WIFO ViKI-Analyse (Whitepaper) erweitert: Outbound-Modul mit Haftungsschutz-Dokumentation, Jahrescheck-Automatisierung, Lebensereignis-Erkennung und Datenqualitäts-Score. Details in `_strategie.md` unter Ausbaustufe 3.

Aufgaben und nächste Schritte → **in Things verwalten**.

---

## Dokumente

### Strategie & Konzept

| Datei | Was drin steht |
|---|---|
| `Strategie.md` | Das Hauptdokument: alle 3 Ausbaustufen detailliert, Phasenplan, alle 20 Konzeptentscheidungen für Stufe 1, Beispiel-Workflow, Discovery-Architektur, Erfolgskriterien |
| `Upselling.md` | Strategisches Grundlagendokument zur Wachstumsarchitektur: Lars' Kernthese (Zeitersparnis allein reicht nicht), Analyse, 6 konkrete Impuls-Szenarien mit fertigen Nachrichtenentwürfen |
| `Vorgangsarten.md` | Alle 9 Vorgangsarten mit Vorgehensplänen (Schadensmeldung, Kündigung, Terminanfrage etc.) – inkl. besonderer Schritt-Workflows und Status-Logik |
| `_legal.md` | Recherche-Material: DSGVO + EU AI Act + BaFin-Anforderungen für KI im Versicherungsbereich. Grundlage für das Compliance-Briefing in Phase 0 |

### Click-Dummies

| Ordner | Was drin steht |
|---|---|
| `_stufe1/` | Interaktiver Click-Dummy Ausbaustufe 1: dreistufiger Flow (DOS-Suche → Vertragsauswahl → Antworten), DOS-Terminal-Popup, 3 Mock-Vorgänge. Öffnen: `npx serve _stufe1` |
| `src/` *(Projekt-Root)* | Bestehender KI-Prototyp mit Messenger-Feed, Wachstumsimpulsen, Datenextraktion – entspricht funktional eher Stufe 2/3 |

### Discovery-Phase (noch nicht gestartet)

| Datei | Was drin steht |
|---|---|
| `_interview-fuehrungskraefte.md` | Gesprächsleitfaden für 4–6 Führungskräfte aus TELIS, DMF, DEMA (45 Min.) |
| `_interview-berater.md` | Gesprächsleitfaden für 12–15 Berater / Außendienst (35 Min.) |
| `_interview-fachabteilungen.md` | Gesprächsleitfaden für 2–3 Innendienst-Mitarbeiter (30 Min.) – liefert Volumen und Priorisierungsdaten |
| `_auswertung-template.md` | Leere Auswertungsvorlage: Tabellen für Pain-Points, Kanal-Nutzung, Pilot-Kandidaten, Priorisierungs-Matrix – nach den Interviews ausfüllen |

### Vorstand & Kommunikation

| Datei | Was drin steht |
|---|---|
| `_vorstand-update-1.md` | Vorlage für das erste zweiwöchentliche Vorstandsupdate (KW 3–4 April 2026) – Platzhalter für Interview-Ergebnisse, Zeitplan, offene Entscheidungen |
| `_doku-vorstand.md` | Produktdokumentation für den Vorstand: Was ist IQ, welches Problem löst es, die drei Säulen, besondere Features, was das System nicht ist |

### Referenz & Technik

| Datei | Was drin steht |
|---|---|
| `_doku-lars.md` | Persönliche Bedienungsanleitung für den bestehenden Prototyp: welcher Demo-Request zeigt was, empfohlene Demo-Reihenfolge für Präsentationen, KI-Key konfigurieren |
| `_doku-entwickler.md` | Technische Übergabe-Dokumentation für Entwickler: Tech-Stack, Dateiarchitektur, Datenstrukturen, Render-Architektur, alle State-Objekte |
| `Feature-Liste_Makler-Dashboard.md` | Vollständige Feature-Liste des bestehenden Prototyps (Stand Feb. 2026) – Grundlage für Neuentwicklung |

### Externe Quellen & Recherche

| Datei / Quelle | Was drin steht |
|---|---|
| `_technology/WIFO_ViKI_Whitepaper.pdf` | WIFO-Whitepaper zu KI-gestützter Beratung im Versicherungsvertrieb. Analyse ergab 4 Impulse für Stufe 3: Haftungsschutz-Dokumentation, Jahrescheck-Automatisierung, Lebensereignis-Erkennung, Datenqualitäts-Score |
