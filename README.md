# KI-Studio

Ein Lernspiel, in dem man spielerisch lernt, mit KI Spiele und Apps zu bauen. Du gründest ein kleines Studio, nimmst Aufträge an und baust mit der KI «Kiwi». Machst du etwas ungenau, macht Kiwi lustigen Quatsch, und genau daran lernst du.

**Stand:** Version 0.13. Das Spiel ist vollständig gebaut: 6 Kapitel, 12 Aufträge, alle 24 Kernkonzepte, Abschlussauftrag, Schnelltest und Offline-Betrieb. Es ist seit 13. November 2026 öffentlich, aber noch nicht mit echten Spielern getestet. Was offen ist, steht in `docs/ROADMAP.md`.

## Spielen

Direkt im Browser, ohne Konto: https://claudegitty8.github.io/game-how-to-use-claudecode/

## Lokal ausprobieren

Du brauchst nur [Node.js](https://nodejs.org) ab Version 20. Es muss nichts installiert werden.

```
npm start
```

Danach im Browser `http://localhost:8080` öffnen.

## Prüfen

```
npm run pruefen
```

Das startet alle Tests der Spiellogik und prüft die Lerninhalte auf Vollständigkeit.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `spiel/` | Das Spiel, so wie es im Browser läuft |
| `spiel/code/` | Programmcode: `logik`, `ki`, `oberflaeche`, `speicher`, `inhalte` |
| `spiel/inhalte/` | Lerninhalte als Daten: Lehrplan, Regeln, Texte, Fakten |
| `tests/` | Automatische Tests |
| `werkzeuge/` | Hilfsprogramme: Inhaltsprüfung, lokaler Server |
| `docs/` | Vision, Leitlinien, Lehrplan, Game Design, Architektur, Entscheide |
| `CLAUDE.md` | Kurzregeln für die Arbeit mit Claude Code |

Mehr dazu in `docs/ARCHITEKTUR.md`.
