# Changelog

Alle spürbaren Änderungen, neueste zuerst.

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
