# Vorgangsarten & Vorgehenspläne – Makler-Dashboard

Übersicht aller implementierten Eingangstypen mit ihren Vorgehensplänen (Stand: März 2026).

---

## 1. 🚨 Schadensmeldung
**Priorität:** Hoch | **Kategorie:** `damage`

Eingehende Meldung eines Schadensfalls durch den Mandanten (z.B. Autounfall, Hausratschaden, Diebstahl).

### Interaktionsmodell

Schadensmeldungen nutzen ein abweichendes Interaktionsmodell: Statt einer Checkbox-Checkliste gibt es **klickbare Schritt-Karten** in der rechten Spalte. Ein Klick auf einen Schritt lädt einen kontextbezogenen Textentwurf in die mittlere Spalte. Der KI-Antwortbereich (rechte Spalte) wird für Schadensmeldungen ausgeblendet.

### Vorgehensschritte

| Schritt | Aktion | Empfänger | Besonderheit |
|---------|--------|-----------|--------------|
| ① | Schadenvorgang an das Backoffice übergeben | Backoffice-Team (intern) | Sperrt Schritte ②③④ nach Absenden |
| ② | Versicherer informieren | Versicherer | Wird durch ① gesperrt |
| ③ | Schadenformulare an Mandanten senden | Mandant | Wird durch ① gesperrt |
| ④ | Schadensersatzbeauftragter beauftragen (Polygon) | Polygon GmbH | Wird durch ① gesperrt |
| ⑤ | Mandanten über Status informieren | Mandant | Immer verfügbar |

### Status-Logik

- `pending` → normal, klickbar, Nummernindikator ①–⑤
- `selected` → blauer Rahmen, Textentwurf erscheint in der Mitte
- `sent` → ausgegraut, Indikator wird zu ✓, Text durchgestrichen
- `blocked` → ausgegraut, Indikator wird zu 🔒, kursiv, nicht klickbar

**Sonderregel:** Wird Schritt ① (Backoffice-Übergabe) abgeschickt, werden Schritte ②③④ automatisch gesperrt. Schritt ⑤ bleibt stets verfügbar.

### Textentwurf-Panel (mittlere Spalte)

Klick auf einen Schritt öffnet ein Entwurf-Panel mit:
- Header: Schritt-Nummer + Titel + Empfänger
- Editierbare Textarea mit dem vorausgefüllten Entwurf (Mandantendaten, Vertragsnummer, Gesellschaft werden automatisch eingesetzt)
- „Abbrechen" → schließt Panel, Schritt zurück auf `pending`
- „Absenden →" → Schritt wird `sent`, ggf. Folgeschritte `blocked`, Panel schließt sich

---

## 2. 📅 Terminanfrage
**Priorität:** Normal | **Kategorie:** `appointment`

Mandant bittet um einen Beratungstermin. System schlägt automatisch einen freien Termin aus dem Kalender vor.

| Schritt | Aktion | Detail |
|---------|--------|--------|
| 1 | Verfügbare Termine prüfen | Kalender auf passende Slots checken |
| 2 | Terminvorschlag an Kunden senden | 2–3 Alternativen anbieten |
| 3 | Beratungsunterlagen vorbereiten | Relevante Produktinfos zusammenstellen |
| 4 | Termin im Kalender bestätigen | Nach Rückmeldung des Kunden eintragen |

---

## 3. 📝 Vertragsänderung
**Priorität:** Normal | **Kategorie:** `contractChange`

Mandant möchte einen bestehenden Vertrag anpassen (Summe, Laufzeit, Tarif, Beitrag). Auch: eingehende Beitragsanpassungen von Versicherern.

| Schritt | Aktion | Detail |
|---------|--------|--------|
| 1 | Aktuelle Vertragsdaten prüfen | Bestehendes Vertragsprofil und Konditionen sichten |
| 2 | Änderungsantrag vorbereiten | Formular mit gewünschten Anpassungen ausfüllen |
| 3 | Gesundheitsprüfung klären | Prüfen, ob erneute Risikoprüfung erforderlich ist |
| 4 | Benötigte Unterlagen anfordern | Einkommensnachweise etc. vom Kunden anfordern |
| 5 | Antrag an Versicherer weiterleiten | Nach Rücklauf der Unterlagen einreichen |

---

## 4. ❌ Kündigung
**Priorität:** Normal | **Kategorie:** `cancellation`

Mandant möchte einen Vertrag kündigen. Ziel: Fristen klären, Alternativangebot prüfen, Verlust vermeiden.

| Schritt | Aktion | Detail |
|---------|--------|--------|
| 1 | Kündigungsfristen prüfen | Vertragslaufzeit und Stichtag im System nachsehen |
| 2 | Alternativangebot prüfen | Mögliche Vertragsanpassung als Alternative anbieten |
| 3 | Kündigungsbestätigung erstellen | Schriftliche Bestätigung mit Termin aufsetzen |
| 4 | Kunden über Folgen informieren | Versicherungslücken und Handlungsbedarf klären |

---

## 5. ❓ Allgemeine Frage
**Priorität:** Normal | **Kategorie:** `question`

Mandant stellt eine inhaltliche Frage zu Verträgen, Leistungen, Bedingungen oder allgemeinen Versicherungsthemen.

| Schritt | Aktion | Detail |
|---------|--------|--------|
| 1 | Vertragsbedingungen prüfen | Relevante Klauseln im Versicherungsvertrag nachschlagen |
| 2 | Fachinformation zusammenstellen | Antwort mit Vertragsdetails und Hinweisen formulieren |
| 3 | Kunden antworten | Verständliche Antwort per bevorzugtem Kanal senden |

---

## 6. 📄 Dokumentenanforderung
**Priorität:** Normal | **Kategorie:** `documents`

Mandant benötigt ein Dokument (Versicherungsbestätigung, Bescheinigung, Nachweis) oder sendet ein Dokument zur Ablage ein.

| Schritt | Aktion | Detail |
|---------|--------|--------|
| 1 | Gewünschtes Dokument identifizieren | Klären, welche Bescheinigung genau benötigt wird |
| 2 | Dokument ausstellen | Bestätigung / Nachweis mit aktuellen Vertragsdaten erstellen |
| 3 | Adressdaten aktualisieren (falls nötig) | Neue Adresse im Vertragssystem hinterlegen |
| 4 | Dokument an Kunden senden | Per E-Mail oder Post zustellen |

*Besonderheit: Bei Dokumenten mit KI-erkennbaren Daten (Rentenbescheid, Personalausweis, Gehaltsnachweis) erscheint zusätzlich das Datenextraktions-Panel mit Übernahme in die Finanzanalyse.*

---

## 7. 📊 Jahresendgeschäft
**Priorität:** Hoch | **Kategorie:** `yearEnd`

Sammelvorgang mit einer Liste von Mandanten, die Beratungspotenzial für das Jahresendgeschäft haben (Altersvorsorge, Steueroptimierung). Spezielle Listenansicht mit Mandanten-Dashboard.

| Schritt | Aktion | Detail |
|---------|--------|--------|
| 1 | Mandanten-Dashboard sichten | Bestehende Verträge und Versorgungslücken prüfen |
| 2 | Beratungstermin vereinbaren | Telefonisch oder per E-Mail Termin abstimmen |
| 3 | Steuerliche Situation besprechen | Sonderausgaben-Potenzial und Freibeträge klären |
| 4 | Produktvorschlag erstellen | Passendes Angebot mit Berechnung vorbereiten |
| 5 | Antrag aufnehmen | Unterschriften und Unterlagen einholen |
| 6 | Nachbereitung & Dokumentation | Beratungsprotokoll erstellen und ablegen |

---

## 8. 🎂 Geburtstage
**Priorität:** Normal | **Kategorie:** `birthday`

Sammelvorgang mit einer Liste von Mandanten, die in nächster Zeit Geburtstag haben. Spezielle Ansicht mit direkten Aktionsoptionen (E-Mail, WhatsApp, Anruf, KI-Anruf, Karte, Geschenk).

| Schritt | Aktion | Detail |
|---------|--------|--------|
| 1 | Gratulationsweg wählen | E-Mail, WhatsApp, Anruf oder Karte auswählen |
| 2 | Persönliche Nachricht senden | Glückwünsche mit persönlicher Note versenden |
| 3 | Beratungsanlass prüfen | Runder Geburtstag = guter Anlass für Vertragscheck |

---

## 9. 📋 Nacharbeit
**Priorität:** Hoch | **Kategorie:** `rework`

Sammelvorgang für ausstehende Dokumente, die noch unterschrieben oder zurückgesendet werden müssen. Spezielle Listenansicht mit Dokumenten-Dashboard je Mandant.

| Schritt | Aktion | Detail |
|---------|--------|--------|
| 1 | 📞 Mandant kontaktieren | Mandant anrufen und Dringlichkeit klären |
| 2 | 📄 Dokument vorbereiten | Dokument (z.B. Antrag, Nachtrag) zum Versand vorbereiten |
| 3 | ✉️ Zur Unterschrift zusenden | Per E-Mail, Post oder persönliche Übergabe |
| 4 | ✍️ Unterschriebenes Dokument einsammeln | Rücklauf des Dokuments sicherstellen |
| 5 | 📤 An Gesellschaft zurücksenden | Unterschriebenes Dokument an Versicherer senden |
| 6 | ✅ Vorgang abschließen | Bestätigung der Gesellschaft abwarten und dokumentieren |

---

## Ergänzende Features

### Wachstumsarchitektur – Kontextuelle Impulse
Bestimmte Anfragen lösen zusätzlich einen **Impuls** in der mittleren Spalte aus, der den Makler zu einer wertschöpfenden Folgeaktivität anleitet (Upselling, Retention, Empfehlung). Der Impuls enthält einen fertig formulierten WhatsApp- oder E-Mail-Entwurf, der direkt in den Antwortbereich übernommen wird.

Implementierte Impuls-Szenarien:
- **Upselling-Moment** – nach erfolgreicher Schadensregulierung (fehlender Elementarschutz)
- **Retention-Risiko** – bei Beitragserhöhung mit aktivem Sonderkündigungsrecht

### Intelligente Datenextraktion
Bei eingehenden Dokumenten und Nachrichten erkennt das System automatisch Felder, die in die **Finanzanalyse** des Mandanten gehören, und schlägt deren Übernahme vor (Alt/Neu-Vergleich, Checkbox-Auswahl, Undo).

Implementierte Extraktions-Szenarien:
- **Rentenbescheid** – Rentenerwartung, Renteneintrittsdatum, Bescheiddatum
- **Personalausweis** – Ausweisnummer, Ausstelldatum, Ablaufdatum, Behörde
- **Einkommensänderung** – Nettoeinkommen (mit Vorher-Wert-Vergleich)
