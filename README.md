# KI-Studio

Ein Lernspiel, in dem man spielerisch lernt, mit KI Spiele und Apps zu bauen. Du gründest ein kleines Studio, nimmst Aufträge an und baust mit der KI «Kiwi». Machst du etwas ungenau, macht Kiwi lustigen Quatsch, und genau daran lernst du.

**Stand:** Version 0.5. Spielbar sind Kapitel 1 (Aufträge «Bäckerei Brunner» und «Turnverein») und Kapitel 2 (Aufträge «Dorfmuseum» und «Dorfzeitung»). Das sind 9 von 24 Kernkonzepten. Wie es weitergeht, steht in `docs/ROADMAP.md`.

## Ausprobieren

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
