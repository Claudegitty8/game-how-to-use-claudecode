# Entscheidungen: Lernspiel «KI-Studio»

Jede wichtige Entscheidung mit Datum und Begründung. Neue Einträge unten anfügen.

## 2026-11-11, Phase 0 (Verständnis)

### E-001: Arbeitsort
**Entscheid:** Die Dokumente der Phasen 0 bis 3 liegen im Claude-Projekt «Spielerisch Lernen». Wo der Code lebt (GitHub-Repo oder lokaler Ordner), wird in Phase 4 entschieden.
**Grund:** Die damalige Sitzung lief in der Cloud ohne Git-Repository und ohne Paket-Installation. Die Phasen 0 bis 3 bestehen nur aus Dokumenten und brauchen beides nicht.
**Abgelöst durch:** E-015.

### E-002: Auftrag besteht aus mehreren Runden
**Entscheid:** Ein Auftrag besteht aus mehreren kurzen Runden von 5 bis 10 Minuten. Pro Runde wird höchstens ein neues Konzept eingeführt. Die Meisterschaftsregel (dreimal selbstständig richtig angewendet) bleibt streng.
**Grund:** Löst den Widerspruch zwischen «immer nur ein neues Konzept», «Meisterschaft vor Fortschritt» und «ein Auftrag mit den ersten drei Konzepten» in Phase 5.

### E-003: Kernkonzepte und Lexikon-Begriffe
**Entscheid:** Rund 20 bis 25 Kernkonzepte unterliegen der vollen Meisterschaftsregel. Die übrigen Begriffe der Lernziele erscheinen in Aufträgen und im Lexikon, ohne Pflichtübung. Welche Begriffe Kern sind, legt der Lehrplan fest.
**Grund:** Über 60 Begriffe mit je drei Anwendungen plus Wiederholung würden das Spiel zu lang und den Bauaufwand zu gross machen.

### E-004: Bauen mit Bausteinen statt Freitext
**Entscheid:** Im Werkstatt-Modus wählt und verdrahtet der Spieler Bausteine und Textteile. Die Stufe «frei» bedeutet: ohne Hilfen, nicht frei getippt.
**Grund:** Der simulierte Modus kann frei getippte Prompts nicht zuverlässig bewerten. Bausteine sind am Handy gut bedienbar und fair bewertbar. Der Lernfortschritt bleibt unabhängig von der echten KI.

## 2026-11-11, Phase 2 (Konzept)

### E-005: Echt-Modus nur für Erwachsene
**Entscheid:** Die optionale Anbindung an echtes Claude bleibt, liegt aber hinter einer 18+-Bestätigung und ist klar als Zusatz markiert. Das ganze Spiel ist ohne sie durchspielbar.
**Grund:** Claude ist als Verbraucherprodukt erst ab 18 Jahren erlaubt, und Produkte für Minderjährige brauchen zusätzliche Schutzmassnahmen (`RECHERCHE.md`, Abschnitt 3.4). Unsere Zielgruppe beginnt bei 12.

### E-006: Erst probieren, dann erklären
**Entscheid:** Jedes Konzept wird in fünf Schritten eingeführt: Probieren, Aha, Beispiel, Lücke, Frei. Der erste Master-Prompt verlangte «erst vorgemachte Lösung». Das Beispiel rückt an die dritte Stelle.
**Grund:** Die Forschung zum produktiven Scheitern zeigt besseres Verständnis, wenn der Eigenversuch vor der Erklärung kommt. Es passt zudem zur Spielidee, dass Fehler der unterhaltsamste Teil sind.

### E-007: Leichte Simulation mit Tokens als einziger Ressource
**Entscheid:** Das Studio wächst sichtbar. Es gibt genau eine Ressource, Tokens, und zwar erst ab Kapitel 2. Kein Geld, keine Mitarbeitenden, keine Buchhaltung. Gesparte Tokens dienen nur der Verschönerung.
**Grund:** Die Simulation soll dem Lernen dienen und nicht ablenken. Tokens lehren nebenbei Kosten und Kontextfenster.

### E-008: 24 Kernkonzepte in 6 Kapiteln
**Entscheid:** Der Lehrplan legt 24 Kernkonzepte und rund 30 Lexikon-Begriffe fest (`LEHRPLAN.md`). Das Spiel beginnt mit Prompt, Kontext und Beispielen, nicht mit Theorie.
**Grund:** Erst tun, dann verstehen, und das Nützlichste zuerst. Der erste Erfolg soll in der ersten Minute möglich sein.

### E-009: KI-Figur heisst «Kiwi»
**Entscheid:** Die KI im Spiel trägt den neutralen Namen «Kiwi». Claude-spezifische Konzepte werden als solche bezeichnet. Der Name ist ein Vorschlag und änderbar.
**Grund:** Die meisten Konzepte gelten für Sprachmodelle allgemein. Die Verwendung des Markennamens «Claude» für eine Spielfigur ist rechtlich ungeklärt.

### E-010: Änderungen an den Lernzielen des Master-Prompts
**Entscheid:** Neu als Kernkonzept: Prüfschleife und Planen vor Bauen. «Schritt-für-Schritt-Denken» wird Lexikon-Eintrag. Die Agentenschleife heisst «Kontext sammeln, handeln, prüfen».
**Grund:** Abgleich mit der aktuellen offiziellen Dokumentation (`RECHERCHE.md`, Abschnitt 3).

## 2026-11-11, Phase 3 und 4 (Prompt-Prüfung und Fundament)

### E-011: Master-Prompt V2 gilt
**Entscheid:** `MASTER_PROMPT_V2.md` ersetzt die erste Fassung. Die Freigabe erfolgte mit dem Start von Phase 4. Die erste Fassung bleibt als Verlauf im Claude-Projekt.
**Grund:** V2 behebt die Fehler, Widersprüche und Lücken der ersten Fassung (Anhang von V2).

### E-012: Reines Web ohne Zusatzpakete
**Entscheid:** HTML, CSS und JavaScript mit ES-Modulen, Lerninhalte als JSON, Tests mit dem in Node.js eingebauten Testwerkzeug. Keine Abhängigkeiten, kein Build-Schritt.
**Grund:** Nichts zu installieren und zu pflegen, läuft überall, für einen Nicht-Programmierer mit Claudes Hilfe gut wartbar. Alternativen und der Zeitpunkt für eine Neubeurteilung stehen in `ARCHITEKTUR.md`, Abschnitt 1.

### E-013: Commits direkt auf main
**Entscheid:** Claude schreibt direkt in den Hauptstand `main`, in kleinen Commits. Vor jedem Commit muss `npm run pruefen` bestehen.
**Grund:** Wunsch des Besitzers: einfachster Ablauf ohne Pull Requests. Die automatischen Prüfungen sind das Sicherheitsnetz.

### E-014: Vorschau als private Seite, Hosting offen
**Entscheid:** Während der Entwicklung veröffentlicht Claude jeden Stand als private Vorschau-Seite mit Link. Über das endgültige Hosting wird vor der Veröffentlichung entschieden.
**Grund:** Das Repository ist privat, und es soll kein weiteres Konto nötig sein.

### E-015: Das Repository ist der massgebliche Ort
**Entscheid:** Alle Dokumente liegen ab jetzt in `docs/` im GitHub-Repository. Dort wird geändert. Kopien im Claude-Projekt «Spielerisch Lernen» dienen nur zum Nachlesen und werden bei Bedarf nachgeführt.
**Grund:** Jede Information nur an einem Ort. Claude Code liest die Dokumente aus dem Repository.

## 2026-11-11, Phase 5 (Erstes spielbares Stück)

### E-016: Neues Aufgabenformat, Kostprobe entfernt
**Entscheid:** Aufgaben haben jetzt Textteile mit einer Art (Prompt, Kontext, Beispiel) und eine geordnete Liste von Prüfungen statt «nötiger Zutaten». Die Kostprobe aus Phase 4 (`de/demo.json`, `oberflaeche/startseite.js`) ist gelöscht und durch den Auftrag «Bäckerei Brunner» ersetzt.
**Grund:** Das alte Format konnte nur «etwas fehlt» ausdrücken. Für echtes KI-Verhalten braucht es auch «etwas Schädliches ist dabei» (vage Wörter, unwichtiger Kontext, unpassendes Beispiel) und «zu wenige Beispiele».

### E-017: Was für die Meisterschaft zählt
**Entscheid:** Eine freie Situation zählt nur, wenn sie beim ersten Test richtig ist und höchstens die erste Hilfestufe (allgemeiner Tipp) benutzt wurde. Alles andere kostet nichts, die Situation kommt später nochmals.
**Grund:** Nach einem Fehlversuch verrät der Hinweis fast die Lösung. Würde der zweite Versuch zählen, wäre «selbstständig richtig» nicht mehr erfüllt. Gleichzeitig soll Weiterprobieren erlaubt bleiben, weil der Quatsch der Spass ist.

### E-018: Vier freie Situationen pro Konzept
**Entscheid:** Jede Konzept-Runde hat mindestens vier freie Situationen. Drei müssen gezählt gelöst werden. Die übrige dient später als Wiederholung.
**Grund:** So gibt es nach einem Fehlversuch eine andere Situation, und die Wiederholung zeigt etwas, das der Spieler noch nicht gelöst hat.

### E-019: Aufträge enthalten Struktur und Text in einer Datei
**Entscheid:** Ein Auftrag liegt als eine Datei pro Sprache vor (`de/auftraege/baeckerei.json`), mit Ablauf und Texten zusammen.
**Grund:** Fehlbilder, Textteile und Prüfungen hängen eng zusammen und lassen sich so gemeinsam schreiben und prüfen. Für eine weitere Sprache wird die ganze Datei übersetzt.

### E-020: Verschoben auf später
**Entscheid:** Diese Punkte aus `GAME_DESIGN.md` sind in Version 0.2 bewusst noch nicht gebaut: Bonus-Ereignisse während des Auftrags (es gibt eine Überraschung am Schluss), weniger Vorgaben in der Lücke für starke Spieler, Spielstand als Datei sichern, gezeichnete Studio-Ansicht.
**Grund:** Sie sind für die Frage «Funktioniert die Kernidee?» nicht nötig. Zuerst kommt die Testrunde mit echten Spielern.

## 2026-11-11, Phase 6 (Ausbau)

### E-021: System-Prompt als eigenes Feld der Werkbank
**Entscheid:** Textteile der Art `rolle` bilden den System-Prompt, der getrennt vom Prompt angezeigt wird. In der Runde «Rolle und System-Prompt» ist die Nachricht eines Mitglieds vorgegeben, der Spieler baut nur den System-Prompt. Einmaliges im System-Prompt führt zum Fehlbild «Kiwi wiederholt es für immer».
**Grund:** So entspricht die Mechanik der echten Trennung zwischen dauerhafter Anweisung und einzelner Nachricht (Leitlinie B1). Die offizielle Dokumentation empfiehlt, die Rolle im System-Prompt zu setzen.

### E-022: Weiterbauen ohne Testrunde
**Entscheid:** Auf Wunsch des Besitzers wird vorerst ohne Testrunde mit echten Spielern weitergebaut. Die Testrunde bleibt offen und empfohlen, bevor Kapitel 2 fertig ist.
**Grund:** Entscheid des Besitzers. Risiko: Fällt die Kernidee im Test durch, müssen mehr Inhalte umgeschrieben werden.

### E-023: Aufträge in fester Reihenfolge
**Entscheid:** Aufträge werden nacheinander gespielt, in der Reihenfolge aus `lader.js`. Die Wahl zwischen zwei Aufträgen (GAME_DESIGN, Abschnitt 9) kommt frühestens in Kapitel 2.
**Grund:** Jeder Auftrag führt neue Konzepte ein, die auf den vorherigen aufbauen. Eine Wahl braucht doppelte Inhalte.

### E-024: Übungsform «Vorhersagen» und Balken ohne Zahlen
**Entscheid:** Für «Wahrscheinlichkeit statt Wissen» gibt es eine zweite Aufgabenart (`typ: "wahl"`): Der Spieler sagt vorher, was Kiwi tut. Der «Blick in Kiwis Kopf» zeigt Balken mit den Stufen «sehr oft», «manchmal», «fast nie», ohne Prozentzahlen.
**Grund:** Das Konzept lässt sich nicht durch Zusammenstecken eines Prompts lernen. Echte Wahrscheinlichkeiten kennen wir nicht, erfundene Zahlen würden Leitlinie D2 verletzen. Das Lexikon sagt offen, dass die Balken Schätzungen sind.

### E-025: Absicherung als eigene Bausteingruppe
**Entscheid:** Sätze, die Halluzinationen verhindern (nur gegebene Quellen benutzen, Nichtwissen erlauben, Beleg verlangen), bilden die Gruppe «Absicherung».
**Grund:** Es sind die drei offiziell empfohlenen Gegenmittel. Als eigene Gruppe werden sie zu einem Werkzeug, das der Spieler später in jedem Auftrag wiedererkennt.

### E-026: Spiel-Tokens statt echter Tokens
**Entscheid:** Das Spiel zählt «Spiel-Tokens»: rund 1,3 pro Wort, grosse Dokumente tragen einen festen Wert. Die Oberfläche nennt sie immer «Spiel-Tokens», das Lexikon sagt offen, dass es keine echte Zählung ist.
**Grund:** Echte Token-Zahlen hängen von Modell und Sprache ab und ändern sich (Leitlinie D2). Für das Lernziel genügt: Länge kostet, bei Eingabe und Ausgabe.

### E-027: Token-Budget ohne Sackgasse
**Entscheid:** Ab dem Auftrag «Dorfzeitung» hat jeder Auftrag ein Token-Budget. Probieren und Beispiel sind gratis. Ist das Budget leer, wird es zur Hälfte nachgefüllt, die einzige Folge ist «nichts gespart». Was nicht auf Kiwis Tisch passt, wird beim Abziehen nicht mitgerechnet.
**Grund:** Umsetzung von E-007 und Leitlinie B2: Kosten sollen spürbar sein, aber Fehler dürfen nie bestrafen oder das Weiterspielen verhindern.

### E-028: Kontextfenster als Tisch mit drei Zuständen
**Entscheid:** «Kiwis Tisch» hat drei Zustände: viel Platz, eng (Kiwi wird ungenau), voll (etwas fällt herunter, auch die Frage).
**Grund:** Entspricht zwei belegten Effekten: Genauigkeit sinkt mit wachsender Token-Zahl, und Chat-Oberflächen lassen Älteres zuerst herausfallen. Vereinfachung: Die Schnittstelle für Programmierer lehnt zu lange Eingaben stattdessen mit einem Fehler ab. Das steht bei den Fakten.

### E-029: Kapitel 3 bis 6 mit der bestehenden Werkbank
**Entscheid:** Die Konzepte ab Kapitel 3 werden mit den zwei vorhandenen Übungsformen gebaut (Zusammenstecken und Vorhersagen). Werkzeuge, Rechte, Connectors, Skills und der Zettel sind neue Bausteingruppen. Eigene Bilder (Kreis mit Stationen, Ampel, Steckerleiste, Karteikasten) und die Übungsform «Sortieren» aus dem Lehrplan kommen später.
**Grund:** Der Besitzer wollte das Spiel in einem Zug fertig haben. Die Mechanik bleibt trotzdem das Konzept (fehlendes Werkzeug ergibt «nur geredet», fehlende Rückfrage ergibt «gelöscht»). Neue Übungsformen sollen erst nach der Testrunde entstehen.

### E-030: Zwölf statt dreizehn Aufträge
**Entscheid:** Kapitel 3 hat zwei Aufträge mit je drei Konzepten statt drei Aufträge mit je zwei. Das Spiel hat damit 12 Aufträge.
**Grund:** Tool, Agentenschleife und Prüfschleife gehören eng zusammen, ebenso Berechtigungen, Planen und Subagent. Die Reihenfolge der 24 Konzepte bleibt wie im Lehrplan.

### E-031: Einstellungen stehen nicht im Prompt
**Entscheid:** Teile der Arten `tool`, `stecker`, `karte` und `recht` erscheinen nicht im Text des Prompts, zählen aber als Spiel-Tokens. Teile der Art `zettel` (CLAUDE.md) stehen wie der System-Prompt in einem eigenen Feld. Die Liste aller Arten steht nur noch in `spiel/code/logik/prompt.js`.
**Grund:** In echten Programmen schreibt man Werkzeuge und Rechte nicht in die Nachricht, man stellt sie ein. Auf dem Tisch brauchen sie trotzdem Platz.

### E-032: Antworten in fester, gemischter Reihenfolge
**Entscheid:** Bei Vorhersage-Aufgaben mischt die Oberfläche die Antworten. Die Reihenfolge hängt nur vom Text der Frage ab und ist darum jedes Mal gleich.
**Grund:** In den Daten stand die richtige Antwort oft zuoberst. Das hätte man schnell durchschaut.

### E-033: Abschlussauftrag in drei Etappen, Version 0.9
**Entscheid:** Der Abschlussauftrag «Dorffest» besteht aus drei Mischrunden (Idee, Bau, Auslieferung) ohne neues Konzept. Die Version heisst 0.9, nicht 1.0.
**Grund:** Der Lehrplan verlangt einen Abschluss, der alles mischt. 1.0 gibt es erst, wenn echte Spieler das Spiel getestet haben (E-022).

### E-034: Schnelltest pro Auftrag statt pro Kapitel
**Entscheid:** «Das kann ich schon» steht bei jedem Auftrag, nicht nur am Kapitelanfang. Geprüft werden die ersten drei freien Situationen jedes Konzepts. Nur ein fehlerfreies Konzept wird übersprungen, alles andere bleibt unverändert. Der Schnelltest kostet keine Spiel-Tokens.
**Grund:** Passt zur festen Reihenfolge der Aufträge (E-023) und hält die Regel «Scheitern kostet nichts» ein (Leitlinie B2).

### E-035: Messwerte bleiben Zahlen auf dem Gerät
**Entscheid:** Von den freiwilligen Fragen wird nur gespeichert, wie viele richtig waren. Vom Daumen nur hoch oder runter pro Auftrag. Nichts wird übertragen. Bei den Fragen vor dem Spiel gibt es keine Auflösung.
**Grund:** Feste Regel 7 (keine persönlichen Daten, kein Tracking). Ohne Auflösung bleibt der Vergleich vorher und nachher ehrlich.

### E-036: Offline über einen Service Worker, Symbol und Name ausserhalb der Inhalte
**Entscheid:** Ein Service Worker (`spiel/sw.js`) holt mit Internet immer die neuste Fassung und liefert ohne Internet die abgelegte. Der Name «KI-Studio» steht zusätzlich in `spiel/manifest.webmanifest` und `spiel/index.html`.
**Grund:** So gibt es nie veraltete Stände, solange Internet da ist. Der Browser verlangt den Namen an diesen zwei Orten. Das ist die einzige Ausnahme von der Regel «alle sichtbaren Texte in den Inhalten».

## Annahmen (noch nicht bestätigt)
- Der Spielstand wird nur auf dem Gerät gespeichert, ohne Konto.
- Die Zahl «dreimal richtig» und der Wiederholungsplan (1, 3, 7 Runden) sind Startwerte und werden im Test überprüft.
- Für den API-Schlüssel im Echt-Modus gilt vorläufig der Vorschlag «Weg A» aus `ARCHITEKTUR.md`, Abschnitt 8. Entscheid in Phase 6.
- Die Hüllen für Desktop und iOS sind noch nicht geprüft.
- Vereinfachung in Konzept 5: «Was in vielen Texten steht, trifft Kiwi meist» ist eine Faustregel, kein belegter Satz aus der offiziellen Dokumentation. Belegt ist nur, dass Sprachmodelle das nächste Wort vorhersagen.
- Das Fehlbild «Mit nur einem Beispiel kopiert die KI es» ist in der offiziellen Dokumentation nur sinngemäss belegt (Beispiele sollen sich genug unterscheiden, damit keine ungewollten Muster übernommen werden).
- Vereinfachungen ab Kapitel 3: Die Felder der Wetter- und Kalender-API sind erfunden. «Tresor» steht für jede sichere Ablage von Geheimnissen. Skills steckt im Spiel der Spieler an, in echt wählt die KI sie anhand der Beschreibung selbst. Die Namen der Berechtigungs-Modi von Claude Code kommen im Spiel nicht vor, sie stehen nur bei den Fakten.
- «Ein Commit hält den Stand aller Projekt-Dateien fest» und die Aussagen zu Frontend, Backend, Bug und Test sind allgemeines Grundwissen ohne Eintrag in `fakten.json`.
