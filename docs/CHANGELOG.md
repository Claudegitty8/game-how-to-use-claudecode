# Changelog

Alle spürbaren Änderungen, neueste zuerst.

## 0.10.0, 11. November 2026: Alles, was ohne Entscheid des Besitzers geht

**Neu**
- **Ohne Internet spielen:** Nach dem ersten Laden liegt das Spiel auf dem Gerät. Es lässt sich als App auf den Startbildschirm legen (eigenes Symbol). Wirkt erst auf einem richtigen Hosting, nicht in der privaten Vorschau.
- **Schnelltest «Das kann ich schon»:** Vor jedem Auftrag wählbar. Drei Aufgaben pro Konzept, je ein Versuch, ohne Hilfe. Wer alle drei schafft, überspringt die Einführung dieses Konzepts. Die Mischrunde bleibt, das Lexikon wird trotzdem gefüllt, und das Konzept kommt später als Wiederholung.
- **Studio einrichten:** Gesparte Spiel-Tokens lassen sich für acht Dinge ausgeben, von der Zimmerpflanze bis zur Discokugel. Reine Zierde.
- **Freiwillige Fragen vorher und nachher:** Sechs Fragen vor dem ersten Auftrag und nach dem letzten. Am Schluss sieht man den Vergleich. Gespeichert wird nur die Anzahl richtiger Antworten, nur auf dem Gerät.
- **Daumen:** Am Ende jedes Auftrags ein Daumen hoch oder runter. Bleibt auf dem Gerät.
- **Spielstand als Datei sichern und laden** (Einstellungen).
- 48 Tests. Neu geprüft: Das ganze Spiel lässt sich auch nur mit Schnelltests und Mischrunden durchspielen.

**Bekannte Grenzen**
- Nicht mit echten Spielern getestet (E-022).
- Die Zierde erscheint als Liste, nicht als gezeichnetes Studio.
- Die Zugänglichkeit ist nicht mit Vorlesehilfen an echten Geräten geprüft.
- Offen und Sache des Besitzers: Hosting, Echt-Modus, Rechtliches.

## 0.9.0, 11. November 2026: Das ganze Spiel, Kapitel 3 bis 6

Das Spiel ist inhaltlich vollständig: 12 Aufträge, alle 24 Kernkonzepte, Abschlussauftrag.

**Neu**
- **Kapitel 3 «Kiwi bekommt Hände»:** Aufträge «Jassclub» (Tool, Agentenschleife, Prüfschleife) und «Schülerband» (Berechtigungen, Planen vor Bauen, Subagent).
- **Kapitel 4 «Das Studio vernetzt sich»:** Aufträge «Velo-Laden» (API, API-Schlüssel) und «Blumenladen» (Connector und MCP, Skill).
- **Kapitel 5 «Echte Software»:** Aufträge «Kinderzirkus» (Dateien und Projekt, Commit) und «Bibliothek» (Debugging und Test, CLAUDE.md).
- **Kapitel 6 «Sicher unterwegs»:** Auftrag «Gemeinde» (Prompt Injection) und der Abschlussauftrag «Dorffest» in drei Etappen: Idee, Bau, Auslieferung. Er mischt alles Gelernte.
- Sechs neue Bausteingruppen in der Werkbank: Werkzeuge, Connectors, Skills, «Was Kiwi darf», Felder der Anfrage und der Zettel CLAUDE.md. Werkzeuge, Connectors, Skills und Rechte sind Einstellungen und stehen nicht im Prompt-Text (E-031).
- Bei Vorhersage-Aufgaben stehen die Antworten in gemischter Reihenfolge. Vorher stand die richtige immer zuoberst (E-032).
- Neues Zwischenbild «Etappe geschafft» für Mischrunden mitten im Auftrag.
- Das Studio wächst mit: Büro, Büro mit Serverraum, Studio-Etage, bekanntes Studio. Schlussbild, wenn alles erledigt ist.
- 113 neue Aufgaben. Insgesamt 177 Aufgaben (89 zum Bauen, 88 zum Vorhersagen), 282 Fehlbilder, 40 Lexikon-Einträge, 44 geprüfte Fakten, 41 Tests.
- Neuer Test: Das ganze Spiel wird automatisch von Anfang bis Ende durchgespielt. Am Schluss müssen alle 24 Konzepte gemeistert und das ganze Lexikon offen sein.

**Bekannte Grenzen**
- Weiterhin nicht mit echten Spielern getestet (E-022). Darum Version 0.9 und nicht 1.0.
- Kapitel 3 bis 6 benutzen die bestehende Werkbank. Eigene Bilder (Schleife mit Stationen, Ampel, Steckerleiste) und die Übungsform «Sortieren» fehlen noch (E-029).
- Gesparte Tokens lassen sich für nichts ausgeben. Kein Schnelltest, keine Vorher-Nachher-Fragen.
- Kein Echt-Modus, läuft nicht ohne Internet, Hosting und Rechtliches offen.

## 0.5.0, 11. November 2026: Kapitel 2 komplett

**Neu**
- Vierter Auftrag «Dorfzeitung Hinterwiler Bote»: drei Konzept-Runden und eine Mischrunde.
- Konzept 7 «Token»: Token-Zähler in der Werkbank, Aufgaben mit Obergrenze, Token-Steine zeigen, wie ein Satz zerfällt.
- Konzept 8 «Kontextfenster»: «Kiwis Tisch» zeigt als Balken, wie voll das Kontextfenster ist. Zu voll macht Kiwi ungenau, übervoll lässt die Frage herunterfallen.
- Konzept 9 «Wissensstand»: Kiwi kennt weder Neuigkeiten von gestern noch das heutige Datum, ausser man gibt sie mit.
- **Token-Budget pro Auftrag** (E-007): Jeder Test kostet Spiel-Tokens. Probieren und Beispiel sind gratis. Was übrig bleibt, steht als «gespart» an der Auftragswand. Ist das Budget leer, wird nachgefüllt, es gibt dann nur keinen Sparbonus.
- Neue Prüfung `tokensUeber` für Budget und Kontextfenster. Die Inhaltsprüfung stellt sicher, dass Anzeige und Bewertung dieselben Grenzen benutzen.
- 21 neue Aufgaben. Insgesamt 64 Aufgaben, 13 Lexikon-Einträge, 19 geprüfte Fakten, 35 Tests.

**Bekannte Grenzen**
- Gesparte Tokens lassen sich noch für nichts ausgeben (Studio-Ausbau folgt später).
- Weiterhin nicht mit echten Spielern getestet (E-022).
- Läuft noch nicht ohne Internet.

## 0.4.0, 11. November 2026: Kapitel 2, Etappe 1

**Neu**
- Dritter Auftrag «Dorfmuseum Hinterwil»: ein Quiz fürs Dorffest, bei dem alles stimmen muss. Zwei Konzept-Runden und eine Mischrunde.
- Konzept 5 «Wahrscheinlichkeit statt Wissen» mit der neuen Übungsform **Vorhersagen**: Der Spieler tippt, welches Wort Kiwi wählt oder ob Kiwi etwas trifft oder rät.
- «Blick in Kiwis Kopf»: Balken zeigen nach der Antwort, wie oft ein Wort passt (sehr oft, manchmal, fast nie). Bewusst ohne Zahlen.
- Konzept 6 «Halluzination und Prüfen» mit der neuen Bausteingruppe **Absicherung**: nur die Chronik benutzen, «Das weiss ich nicht» erlauben, Beleg verlangen.
- Neue Fehlbilder: zum Raten gezwungen, dazugedichtet, dem Witzbuch geglaubt, nach dem Mund geredet, richtig aber ohne Beleg.
- Das Studio heisst ab Kapitel 2 «Die Garage mit Labor». Drei neue Lexikon-Einträge.
- 15 neue Aufgaben. Insgesamt 43 Aufgaben, 9 Lexikon-Einträge, 29 Tests.

**Bekannte Grenzen**
- Kapitel 2 ist erst zur Hälfte da: Token, Kontextfenster und Wissensstand fehlen noch, ebenso das Token-Budget.
- Weiterhin nicht mit echten Spielern getestet (E-022).

## 0.3.0, 11. November 2026: Kapitel 1 komplett

**Neu**
- Zweiter Auftrag «Turnverein Flinke Füchse»: Der Verein will den Chat-Helfer Turni. Eine Runde zum vierten Kernkonzept «Rolle und System-Prompt» und eine Mischrunde mit allen vier Konzepten.
- Die Werkbank zeigt bei diesen Aufgaben zwei Felder: den System-Prompt (gilt für jede Nachricht) und die Nachricht eines Mitglieds.
- Neues Fehlbild «dauerhaft»: Was einmalig ist und trotzdem im System-Prompt landet, wiederholt Kiwi für immer.
- Mehrere Aufträge hintereinander. Nach einem erledigten Auftrag klopft der nächste Kunde an.
- Wiederholungen wandern von Auftrag zu Auftrag mit.
- Aufträge können Lexikon-Begriffe mitbringen, die nicht abgeprüft werden (hier: Chatbot).
- 8 neue Aufgaben mit 40 Fehlbildern. Insgesamt 28 Aufgaben, 120 Fehlbilder, 6 Lexikon-Einträge, 26 Tests.

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
