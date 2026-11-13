# Architektur: Lernspiel «KI-Studio»

Stand: 11. November 2026 (Version 0.10).

**Zusätze seit Version 0.11:** dritte Aufgabenart `typ: "reihe"` (Sortieren) mit `frage`, `schritte` (in der gezeigten Anfangsreihenfolge), `loesung` (richtige Reihenfolge), `kiwi` und `daneben` (zwei Texte und ein Hinweis). Oberfläche in `spiel/code/oberflaeche/reihe.js`. Welche Übungsform gebaut wird, entscheidet `baueUebung` in `werkbank.js`. Teile der Art `recht` können `ampel` tragen, Konzepte in `texte.json` wahlweise `stationen`.

**Zusätze seit Version 0.10:** `spiel/code/logik/extras.js` (Schnelltest, Einrichtung, freiwillige Fragen, Daumen, Prüfung eines Spielstands aus einer Datei) mit der Oberfläche in `spiel/code/oberflaeche/extras.js`. Daten dazu: `spiel/inhalte/einrichtung.json` und `spiel/inhalte/de/umfrage.json`. Offline-Betrieb: `spiel/sw.js`, `spiel/manifest.webmanifest`, Symbole in `spiel/bilder/` (E-036). Der Spielstand hat drei neue Felder (`einrichtung`, `umfrage`, `daumen`). Ältere Stände der Version 2 funktionieren weiter, weil fehlende Felder als leer gelten. Dieses Dokument erklärt, womit und wie das Spiel gebaut ist.

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
    start.js              verbindet die Teile und schaltet zwischen Ansichten um
    logik/                SPIELLOGIK
      ablauf.js             wo der Spieler steht und was als Nächstes kommt
      meisterschaft.js      Meisterschaftsregel und Wiederholungsabstände
      bewertung.js          prüft eine gebaute Lösung, wählt das Fehlbild
      prompt.js             setzt den Prompt zusammen und zählt Spiel-Tokens
    ki/                   KI-Schnittstelle: simuliert, später echt
    oberflaeche/          OBERFLÄCHE
      studio.js             Startbildschirm «Die Garage»
      runde.js              die fünf Schritte, Mischrunde, Wiederholung
      werkbank.js           Prompt aus Textteilen zusammenstecken
      lexikon.js            Lexikon und Einstellungen
      bausteine.js          kleine Helfer (Knöpfe, Punkte, Kiwi)
    speicher/             Spielstand auf dem Gerät
    inhalte/              lädt die Lerninhalte
  inhalte/                LERNINHALTE als Daten
    regeln.json           einstellbare Zahlen (z. B. 3 Erfolge)
    lehrplan.json         Kapitel, Konzepte, Voraussetzungen
    fakten.json           schnell veraltende Angaben mit Quelle und Datum
    de/texte.json         Texte der Oberfläche, pro Konzept Name, Merkbild, Aha, Tipp
    de/lexikon.json       Lexikon-Einträge
    de/auftraege/         ein Auftrag pro Datei
tests/                    automatische Tests
werkzeuge/                Inhaltsprüfung, lokaler Server
docs/                     Dokumente
```

**Wer darf wen kennen?**

| Schicht | Darf benutzen | Darf nicht |
|---|---|---|
| `logik/` | nichts ausser eigenen Dateien | Oberfläche, Browser, Texte |
| `ki/` | `logik/` | Oberfläche |
| `speicher/`, `inhalte/` | Browser, `logik/ablauf.js` für den leeren Stand | Spielregeln |
| `oberflaeche/` | ruft `logik/` auf, bekommt Inhalte übergeben | Spielregeln oder feste Texte enthalten |
| `start.js` | alles | – |

Weil die Logik weder Browser noch Oberfläche kennt, lässt sie sich automatisch testen. Der Spielstand wird nie verändert, jede Funktion gibt einen neuen Stand zurück.

## 4. Datenformate der Lerninhalte

**`regeln.json`:** `erfolgeFuerMeisterschaft` (3), `wiederholungsAbstaende` ([1, 3, 7]), `hilfestufen` (3).

**`lehrplan.json`:** Liste der Kapitel und der Konzepte. Jedes Konzept hat eine `id`, sein `kapitel` und `braucht` (Konzepte, die vorher gemeistert sein müssen). Die Reihenfolge der Liste ist die Lernreihenfolge. Diese Datei ist sprachneutral.

**`<sprache>/texte.json`:** Texte der Oberfläche (`app`), Namen der Kapitel und pro Konzept `name` und `analogie`. Konzepte, die schon spielbar sind, haben zusätzlich `aha` (ein bis drei Sätze) und `tipp` (Hilfestufe 1).

**`<sprache>/lexikon.json`:** pro Eintrag `begriff`, `englisch`, `erklaerung`, `kern` (Kernkonzept oder leer) und wahlweise `quatsch` und `genauer`.

**`<sprache>/auftraege/<id>.json`:** ein Auftrag. Die Spielreihenfolge der Aufträge steht in `spiel/code/inhalte/lader.js`.

| Feld | Bedeutung |
|---|---|
| `kapitel` | Nummer des Kapitels. Bestimmt, wie das Studio heisst. |
| `tokenBudget` | wahlweise: Spiel-Tokens für den ganzen Auftrag. Jeder Test ausser Probieren und Beispiel wird abgezogen. |
| `kunde`, `wunsch`, `kundenstimme`, `ueberraschung` | Rahmen des Auftrags |
| `lexikon` | wahlweise: Lexikon-Begriffe, die beim Annehmen des Auftrags freigeschaltet und nicht abgeprüft werden |
| `runden` | Liste der Runden in Spielreihenfolge |
| `aufgaben` | alle Aufgaben des Auftrags, nach Kennung |

Eine **Konzept-Runde** (`art: "konzept"`) nennt ihr `konzept` und die Aufgaben für die Schritte: `probieren` (mit `nurTeile`: nur diese Teile sind sichtbar), `beispiel`, `luecke` (mit `vorgabe`: diese Teile stecken schon) und `frei` (mindestens vier Situationen). Das Aha kommt aus `texte.json`. Eine **Mischrunde** (`art: "misch"`) hat nur `titel` und `frei`.

Eine **Aufgabe**:

| Feld | Bedeutung |
|---|---|
| `wunsch` | was die Kundin in dieser Situation will |
| `grundprompt` | womit der Spieler startet |
| `teile` | wählbare Teile mit `id`, `art` und `text`. Arten: `rolle` (System-Prompt), `zettel` (CLAUDE.md, eigenes Feld wie der System-Prompt), `tool`, `stecker` (Connector), `karte` (Skill), `recht` (diese vier sind Einstellungen und stehen nicht im Prompt-Text), `prompt`, `feld` (Feld einer API-Anfrage), `kontext`, `absicherung`, `beispiel`. Die Liste steht in `spiel/code/logik/prompt.js` (`ARTEN`). |
| `nachrichtVon` | wahlweise: Beschriftung des Prompt-Felds, wenn die Nachricht von jemand anderem stammt (z. B. «Nachricht eines Kindes») |
| `pruefungen` | geordnete Liste. Die erste zutreffende bestimmt das Fehlbild. |
| `fehlbilder` | pro Fehlbild mindestens zwei `texte` (Varianten von KI-Quatsch) und ein `hinweis` |
| `erfolg` | Ergebnistexte, wenn keine Prüfung zutrifft |
| `loesung` | eine richtige Auswahl, für «Beispiel» und «Lösung zeigen» |

Wahlweise hat eine Aufgabe `budget` (Obergrenze für den Prompt in Spiel-Tokens) oder `fenster` und `eng` (Grösse von Kiwis Tisch und die Schwelle, ab der er zu voll ist). Ein Teil kann mit `tokens` eine feste Grösse tragen (für grosse Dokumente), ein Fehlbild mit `ausgabeTokens` den Preis einer langen Antwort.

Eine **Prüfung** trifft zu, wenn eines davon gilt: `gewaehlt` (eines dieser Teile ist angesteckt, z. B. ein vages), `fehlt` (eines dieser Teile fehlt), `aus` mit `hoechstens` (höchstens so viele Teile aus der Liste sind angesteckt, z. B. nur ein Beispiel), `tokensUeber` (der Prompt hat mehr Spiel-Tokens als die Zahl). Der Platzhalter `{teil}` in einem Fehlbild wird durch das eine gewählte Beispiel ersetzt.

Eine **Vorhersage-Aufgabe** (`typ: "wahl"`) hat statt Teilen und Prüfungen: `frage`, `optionen` (jede mit `id`, `text`, `hinweis`, genau eine mit `richtig`), `kiwi` (was Kiwi tatsächlich tut, unabhängig von der Wahl), `loesung` und wahlweise `anteile` (Wörter mit `stufe` 1 bis 3 für den «Blick in Kiwis Kopf»). Die Oberfläche dafür ist `oberflaeche/wahl.js`.

**`fakten.json`:** Jeder Eintrag hat `id`, `aussage`, `quelle` (offizielle Seite) und `geprueft` (Datum).

## 5. Die KI-Schnittstelle

Beide KI-Modi erfüllen denselben Vertrag (`spiel/code/ki/schnittstelle.js`):

```
ki.antworte({ aufgabe, auswahl, versuch })
  → { text, ok, fehlbild, hinweis, tokens: { eingabe, ausgabe }, modus }
```

- **Simuliert** (`simuliert.js`): fragt die Spiellogik, welche Prüfung zutrifft, und wählt eine Variante des passenden Fehlbilds. Beim nächsten Versuch kommt eine andere Variante.
- **Echt** (noch nicht gebaut): schickt denselben Prompt an Claude und zeigt die Antwort.

Bewertet wird immer in `logik/bewertung.js`, nie von der echten KI. So bleibt der Lernfortschritt in beiden Modi gleich.

## 6. Spielstand

Der Spielstand liegt im Speicher des Browsers auf dem Gerät (`localStorage`). Es gibt kein Konto und keine Übertragung. Erlaubt ein Gerät kein Speichern, läuft das Spiel mit einem Stand im Arbeitsspeicher weiter. Der Stand trägt eine Versionsnummer (aktuell 2). Stände älterer Versionen werden vorerst verworfen. Vor der Veröffentlichung braucht es eine Umwandlung, damit niemand Fortschritt verliert. In den Einstellungen lässt sich der Stand löschen.

## 7. Automatische Prüfungen

| Prüfung | Befehl | Was sie sichert |
|---|---|---|
| Tests | `npm test` | Meisterschaftsregel, Wiederholung, Bewertung, Spielablauf, simulierte KI, Speicher. `tests/ganzes-spiel.test.js` spielt alle Aufträge von Anfang bis Ende durch und prüft, dass am Schluss alle 24 Konzepte gemeistert sind. |
| Inhaltsprüfung | `npm run inhalte` | Jede Runde hat alle fünf Schritte. Probieren ergibt immer Quatsch. Jede Lösung besteht, ein leerer Prompt nie. Jedes Fehlbild hat zwei Varianten und einen Hinweis. Kein Text über 40 Wörter. Jeder Fakt hat Quelle und Datum. |
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

- **Code:** öffentliches GitHub-Repository (seit 13. November 2026), Commits direkt auf `main`.
- **Vorschau während der Entwicklung:** private Vorschau-Seite, die Claude aus dem Ordner `spiel/` veröffentlicht. Dort funktioniert kein Service Worker, das Offline-Verhalten wird deshalb später separat getestet.
- **Hosting:** GitHub Pages unter https://claudegitty8.github.io/game-how-to-use-claudecode/ (E-038, E-041). Dort funktionieren Service Worker und Offline-Betrieb.
