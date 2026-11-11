# KI-Studio: Regeln für jede Sitzung

Lernspiel, in dem man spielerisch lernt, mit KI Spiele und Apps zu bauen. Zielgruppe: Erwachsene ohne Vorwissen und Jugendliche ab 12. Der Besitzer des Projekts ist kein Programmierer: Erkläre alles in einfacher Sprache auf Deutsch.

## Zuerst lesen, wenn die Aufgabe es braucht

- `docs/LEITLINIEN.md`: Grundprinzipien. Vor jeder Änderung an Spiel oder Inhalten lesen.
- `docs/LEHRPLAN.md`: 24 Kernkonzepte, Reihenfolge, Analogien, KI-Quatsch.
- `docs/GAME_DESIGN.md`: Kernschleife, Werkstatt, Runden, erster Auftrag.
- `docs/ARCHITEKTUR.md`: Technik, Ordner, Datenformate.
- `docs/ROADMAP.md`: was als Nächstes kommt.
- `docs/ENTSCHEIDUNGEN.md`: alle Entscheide mit Begründung.
- `docs/MASTER_PROMPT_V2.md`: der vollständige Auftrag mit Phasen.

## Befehle

- `npm run pruefen`: alle Tests und die Prüfung der Lerninhalte. Muss vor jedem Commit bestehen.
- `npm test`: nur die Tests der Spiellogik.
- `npm run inhalte`: nur die Prüfung der Lerninhalte.
- `npm start`: Spiel lokal ansehen unter http://localhost:8080.

Es gibt keine installierten Pakete und keinen Build-Schritt. Füge keine Abhängigkeiten hinzu, ohne Eintrag in `docs/ENTSCHEIDUNGEN.md`.

## Feste Regeln

1. **Drei Schichten, strikt getrennt.** `spiel/code/logik/` kennt keine Oberfläche. `spiel/code/oberflaeche/` enthält keine Spielregeln und keine festen Texte. Lerninhalte liegen als JSON in `spiel/inhalte/`.
2. **Alle sichtbaren Texte stehen in `spiel/inhalte/<sprache>/`.** Nie im Code.
3. **Die Mechanik ist das Konzept.** Jeder KI-Quatsch entspricht einem echten KI-Verhalten.
4. **Fakten über KI und Claude nur mit offizieller Quelle und Prüfdatum.** Zahlen und Namen stehen in `spiel/inhalte/fakten.json`, nicht in Spieltexten.
5. **Zwölfjährigen-Test für jeden Text:** Du-Form, kurze Sätze, kein Textblock über 40 Wörter.
6. **Keine Geheimnisse im Repository.** Kein API-Schlüssel in Code, Daten oder Commits.
7. **Keine persönlichen Daten, kein Tracking, keine manipulativen Mechaniken** (Zeitdruck, Streaks, Ranglisten, Kaufanreize).
8. **Der Lernfortschritt hängt nie von der echten KI ab.** Bewertet wird nur in `spiel/code/logik/`.
9. **Jede Information nur an einem Ort.** Jede Änderung aktualisiert die betroffenen Dokumente und `docs/CHANGELOG.md`.
10. **Nichts löschen oder umbauen ohne Eintrag** in `docs/ENTSCHEIDUNGEN.md`.

## Arbeitsweise

- Erst planen, dann bauen: Bei Aufgaben mit mehr als einer Datei zuerst einen kurzen Plan in einfacher Sprache vorlegen.
- Neue Spiellogik bekommt einen Test. Neue Inhalte müssen die Inhaltsprüfung bestehen.
- Erst «fertig» melden, wenn `npm run pruefen` besteht und die Seite im Browser in Handybreite angesehen wurde.
- Kleine Commits auf `main` mit klarer deutscher Nachricht (Entscheid E-013).
- Bei Unklarheiten höchstens fünf Fragen mit 2 bis 4 Antwortoptionen und einer Empfehlung.
- Nach jeder Phase: kurze Zusammenfassung, offene Punkte nennen, auf Freigabe warten.
- Löschen, Veröffentlichen und alles, was Geld kostet, nur nach ausdrücklicher Zustimmung.

## Sprache im Code

Fachliche Namen und Kommentare auf Deutsch (z. B. `meisterschaft`, `bewerte`). Umlaute in Dateinamen und Bezeichnern vermeiden (`pruefen` statt `prüfen`).
