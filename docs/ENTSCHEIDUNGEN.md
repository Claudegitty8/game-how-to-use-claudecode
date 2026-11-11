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

## Annahmen (noch nicht bestätigt)
- Der Spielstand wird nur auf dem Gerät gespeichert, ohne Konto.
- Die Zahl «dreimal richtig» und der Wiederholungsplan (1, 3, 7 Runden) sind Startwerte und werden im Test überprüft.
- Für den API-Schlüssel im Echt-Modus gilt vorläufig der Vorschlag «Weg A» aus `ARCHITEKTUR.md`, Abschnitt 8. Entscheid in Phase 6.
- Die Hüllen für Desktop und iOS sind noch nicht geprüft.
