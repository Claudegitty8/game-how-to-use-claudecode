# Architektur: Lernspiel «KI-Studio»

Stand: 11. November 2026 (Phase 4). Dieses Dokument erklärt, womit und wie das Spiel gebaut ist.

## 1. Technikwahl

**Entscheid:** Reines Web ohne Zusatzpakete. HTML, CSS und JavaScript (ES-Module), Lerninhalte als JSON-Dateien, Tests mit dem in Node.js eingebauten Testwerkzeug.

**In einfacher Sprache:** Das Spiel besteht nur aus Dateien, die jeder Browser direkt versteht. Es gibt keinen Zwischenschritt, der aus dem Code erst das Spiel «baut», und keine fremden Bausteine, die veralten oder Sicherheitslücken bekommen können.

| Möglichkeit | Vorteile | Nachteile | Urteil |
|---|---|---|---|
| **Reines Web ohne Pakete** | Nichts zu installieren und zu pflegen. Läuft überall. Leicht nachvollziehbar. | Mehr Handarbeit bei sehr komplexen Oberflächen. | **Gewählt** |
| React mit Vite und TypeScript | Sehr verbreitet, viele Hilfsmittel. | Hunderte fremde Pakete, regelmässige Pflege, Build-Schritt. | Verworfen |
| Spiel-Engine (z. B. Phaser) | Stark bei Bewegung und Grafik. | Unser Spiel besteht aus Karten, Text und Bausteinen. Schlechter zugänglich für Hilfstechnik. | Verworfen |

**Wann wir neu entscheiden:** Wenn die Werkstatt so komplex wird, dass der Code der Oberfläche unübersichtlich wird. Weil Logik und Inhalte getrennt sind, liesse sich dann nur die Oberfläche austauschen.

## 2. Weg zu Desktop und iOS

Das Spiel ist eine gewöhnliche Web-App. Für spätere Plattformen wird sie eingepackt, nicht neu gebaut:

1. **Installierbare Web-App:** mit einer Manifest-Datei und einem Service Worker. Damit läuft das Spiel nach dem ersten Laden ohne Internet. Geplant vor der ersten Veröffentlichung.
2. **Desktop-Programm:** Hülle um die Web-App (z. B. Tauri oder Electron).
3. **iOS:** Hülle um die Web-App (z. B. Capacitor).

Welche Hülle genau, wird entschieden, wenn es so weit ist. Die Werkzeuge dafür sind noch nicht geprüft.

## 3. Die drei Schichten

```
spiel/
  index.html              Einstiegsseite
  stil/haupt.css          Aussehen
  code/
    start.js              verbindet die Teile
    logik/                SPIELLOGIK: Regeln, Bewertung, Meisterschaft
    ki/                   KI-Schnittstelle: simuliert, später echt
    oberflaeche/          OBERFLÄCHE: was man sieht und antippt
    speicher/             Spielstand auf dem Gerät
    inhalte/              lädt die Lerninhalte
  inhalte/                LERNINHALTE als Daten
    regeln.json           einstellbare Zahlen (z. B. 3 Erfolge)
    lehrplan.json         Kapitel, Konzepte, Voraussetzungen
    fakten.json           schnell veraltende Angaben mit Quelle und Datum
    de/texte.json         alle sichtbaren Texte auf Deutsch
    de/demo.json          Kostprobe einer Aufgabe
tests/                    automatische Tests
werkzeuge/                Inhaltsprüfung, lokaler Server
docs/                     Dokumente
```

**Wer darf wen kennen?**

| Schicht | Darf benutzen | Darf nicht |
|---|---|---|
| `logik/` | nichts ausser eigenen Dateien | Oberfläche, Browser, Texte |
| `ki/` | `logik/` | Oberfläche |
| `speicher/`, `inhalte/` | Browser | Spielregeln |
| `oberflaeche/` | bekommt alles übergeben | Spielregeln oder feste Texte enthalten |
| `start.js` | alles | – |

Weil die Logik weder Browser noch Oberfläche kennt, lässt sie sich automatisch testen.

## 4. Datenformate der Lerninhalte

**`regeln.json`:** `erfolgeFuerMeisterschaft` (3), `wiederholungsAbstaende` ([1, 3, 7]), `hilfestufen` (3).

**`lehrplan.json`:** Liste der Kapitel und der Konzepte. Jedes Konzept hat eine `id`, sein `kapitel` und `braucht` (Konzepte, die vorher gemeistert sein müssen). Die Reihenfolge der Liste ist die Lernreihenfolge. Diese Datei ist sprachneutral.

**`<sprache>/texte.json`:** Texte der Oberfläche (`app`), Namen der Kapitel und pro Konzept `name` und `analogie`.

**Aufgabe** (heute `de/demo.json`, in Phase 5 ein Ordner pro Auftrag):

| Feld | Bedeutung |
|---|---|
| `grundprompt` | womit der Spieler startet |
| `zutaten` | wählbare Bausteine mit `id`, `name`, `text`. Reihenfolge = Wichtigkeit. `noetig: false` für plausible, aber unnötige Bausteine. |
| `fehlbilder` | pro nötiger Zutat mindestens zwei Varianten von KI-Quatsch |
| `hinweise` | pro nötiger Zutat ein Satz, der den Zusammenhang erklärt |
| `erfolg` | Ergebnistexte, wenn alles Nötige da ist |

**`fakten.json`:** Jeder Eintrag hat `id`, `aussage`, `quelle` (offizielle Seite) und `geprueft` (Datum).

Das Format wird in Phase 5 erweitert (Runden, fünf Schritte, mehrere Situationen, Lexikon).

## 5. Die KI-Schnittstelle

Beide KI-Modi erfüllen denselben Vertrag (`spiel/code/ki/schnittstelle.js`):

```
ki.antworte({ aufgabe, auswahl, versuch })
  → { text, ok, luecke, tokens: { eingabe, ausgabe }, modus }
```

- **Simuliert** (`simuliert.js`): fragt die Spiellogik, was fehlt, und wählt das passende Fehlbild aus den Daten.
- **Echt** (noch nicht gebaut): schickt denselben Aufbau an Claude und zeigt die Antwort.

Bewertet wird immer in `logik/bewertung.js`, nie von der echten KI. So bleibt der Lernfortschritt in beiden Modi gleich.

## 6. Spielstand

Der Spielstand liegt im Speicher des Browsers auf dem Gerät (`localStorage`). Es gibt kein Konto und keine Übertragung. Erlaubt ein Gerät kein Speichern, läuft das Spiel mit einem Stand im Arbeitsspeicher weiter. Der Stand trägt eine Versionsnummer, damit spätere Änderungen alte Stände umwandeln können.

## 7. Automatische Prüfungen

| Prüfung | Befehl | Was sie sichert |
|---|---|---|
| Tests | `npm test` | Meisterschaftsregel, Wiederholung, Bewertung, simulierte KI, Speicher |
| Inhaltsprüfung | `npm run inhalte` | Jedes Konzept hat Name und Analogie. Voraussetzungen kommen vorher. Jede Zutat hat Fehlbilder und Hinweis. Jeder Fakt hat Quelle und Datum. |
| Beides | `npm run pruefen` | vor jedem Commit |

## 8. Vorschlag: API-Schlüssel für den Echt-Modus

Der Echt-Modus ist ein freiwilliger Zusatz für Erwachsene und wird erst in Phase 6 gebaut. Zwei Wege:

| | A: Schlüssel bleibt beim Spieler | B: Eigener kleiner Server |
|---|---|---|
| Wie | Der Spieler trägt seinen eigenen Schlüssel ein. Er wird nur für die laufende Sitzung im Arbeitsspeicher gehalten, nie gespeichert und nie an uns gesendet. | Unser Server hält einen Schlüssel und leitet Anfragen weiter. |
| Kosten für uns | keine | Serverkosten und alle Token-Kosten |
| Daten bei uns | keine | Anfragen laufen über uns |
| Risiko | Der Schlüssel ist während der Sitzung im Browser. Schadhafte Browser-Erweiterungen könnten ihn lesen. | Missbrauch unseres Schlüssels, wir bräuchten Konten und Limits. |

**Empfehlung: Weg A.** Er passt zu «keine Daten, kein Konto, keine Kosten». Anthropic rät allgemein davon ab, die API direkt aus dem Browser aufzurufen, weil ein Schlüssel im Seitencode für alle lesbar wäre. Bei Weg A steht der Schlüssel nicht im Seitencode, sondern wird vom Besitzer selbst eingegeben. Das Restrisiko erklärt das Spiel vor der Eingabe in einfacher Sprache und empfiehlt einen eigenen Schlüssel mit tiefem Ausgabenlimit. Der endgültige Entscheid fällt in Phase 6.

## 9. Entwicklung und Vorschau

- **Code:** privates GitHub-Repository, Commits direkt auf `main`.
- **Vorschau während der Entwicklung:** private Vorschau-Seite, die Claude aus dem Ordner `spiel/` veröffentlicht. Dort funktioniert kein Service Worker, das Offline-Verhalten wird deshalb später separat getestet.
- **Endgültiges Hosting:** noch offen, Entscheid vor der Veröffentlichung.
