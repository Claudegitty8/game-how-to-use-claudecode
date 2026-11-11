# Changelog

Alle spürbaren Änderungen, neueste zuerst.

## 0.3.0, 11. November 2026: Kapitel 1 komplett

**Neu**
- Zweiter Auftrag «Turnverein Flinke Füchse»: Der Verein will den Chat-Helfer Turni. Eine Runde zum vierten Kernkonzept «Rolle und System-Prompt» und eine Mischrunde mit allen vier Konzepten.
- Die Werkbank zeigt bei diesen Aufgaben zwei Felder: den System-Prompt (gilt für jede Nachricht) und die Nachricht eines Mitglieds.
- Neues Fehlbild «dauerhaft»: Was einmalig ist und trotzdem im System-Prompt landet, wiederholt Kiwi für immer.
- Mehrere Aufträge hintereinander. Nach einem erledigten Auftrag klopft der nächste Kunde an.
- Wiederholungen wandern von Auftrag zu Auftrag mit.
- Aufträge können Lexikon-Begriffe mitbringen, die nicht abgeprüft werden (hier: Chatbot).
- 8 neue Aufgaben mit 34 Fehlbildern. Insgesamt 28 Aufgaben, 114 Fehlbilder, 6 Lexikon-Einträge, 26 Tests.

**Bekannte Grenzen**
- Weiterhin nicht mit echten Spielern getestet (E-022).
- Läuft noch nicht ohne Internet.

## 0.2.0, 11. November 2026: Erster spielbarer Auftrag

**Neu**
- Auftrag «Bäckerei Brunner» mit drei Runden (Prompt, Kontext geben, Beispiele geben) und einer Mischrunde.
- Jede Runde in fünf Schritten: Probieren, Aha, Beispiel, Lücke, Frei.
- 20 Aufgaben mit 80 Fehlbildern, jedes in zwei Varianten und mit erklärendem Hinweis.
- Meisterschaftsanzeige mit drei Punkten. Es zählt der erste Versuch ohne Hilfe.
- Drei Hilfestufen: Tipp, Teil zeigen, Lösung zeigen.
- Wiederholung früherer Konzepte zu Beginn späterer Runden.
- Studio «Die Garage» mit Auftrag, Meisterschaft und Auftragswand.
- Lexikon mit vier Einträgen, Einstellungen mit drei Schriftgrössen und «Spielstand löschen».
- Der Spielstand wird nach jedem Schritt gespeichert.
- 23 automatische Tests, darunter ein vollständiger Durchlauf des Auftrags. Strengere Inhaltsprüfung.
- Testbogen für Probespiele (`docs/TESTBOGEN.md`).

**Geändert**
- Neues Aufgabenformat mit Textteilen und Prüfungen (E-016). Die Kostprobe aus 0.1 ist entfernt.
- Spielstände aus Version 0.1 werden verworfen.

**Bekannte Grenzen**
- Noch nicht mit echten Spielern getestet.
- Läuft noch nicht ohne Internet.
- Verschobene Punkte siehe E-020.

## 0.1.0, 11. November 2026: Fundament

**Neu**
- Projektstruktur mit getrennten Ordnern für Code, Lerninhalte, Tests und Dokumente.
- Spielgerüst ohne Zusatzpakete: Startseite mit einer Kostprobe der Werkstatt (Auftrag Bäckerei Brunner, zwei Bausteine, KI-Quatsch).
- Spiellogik: Meisterschaftsregel, Wiederholungsabstände, Bewertung fehlender Zutaten.
- KI-Schnittstelle mit simuliertem Modus.
- Spielstand auf dem Gerät, mit Ersatz, falls Speichern nicht möglich ist.
- Lerninhalte als Daten: 24 Kernkonzepte in 6 Kapiteln mit Voraussetzungen, Namen und Analogien.
- 14 automatische Tests und eine Inhaltsprüfung (`npm run pruefen`).
- Dokumente: Vision, Leitlinien, Recherche, Lehrplan, Game Design, Architektur, Entscheidungen, Roadmap, Glossar, Master-Prompt V2, `CLAUDE.md`.

**Bekannte Grenzen**
- Noch kein Spielablauf mit Runden und fünf Schritten (Phase 5).
- Läuft noch nicht ohne Internet.
- Schriftgrösse ist noch nicht einstellbar.
