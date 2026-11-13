# Changelog

Alle spürbaren Änderungen, neueste zuerst.

## 0.16.0, 13. November 2026: Niemand bleibt mehr hängen

**Behoben**
- Wer im Schritt «Frei» die Lösung zeigen liess oder zuerst danebenlag, bekam dieselben Situationen ohne Ende. Das betraf alle 24 Lektionen (E-047).

**Neu**
- Oben im Schritt «Frei»: «Jetzt allein. 3 Situationen beim ersten Versuch richtig, dann geht es weiter.»
- Bei den Hilfe-Knöpfen steht, dass «Zeig mir, wo» und «Lösung zeigen» nicht zählen. Der Tipp ist erlaubt.
- Kommt eine Situation wieder: «Die kennst du schon. Löse sie jetzt allein, dann zählt sie.»
- Nach zwei Durchgängen ohne Fortschritt: Knopf «Weitergehen und später üben». Die Lektion kommt danach als Wiederholung, bis sie sitzt.
- Insgesamt 75 Tests, darunter einer, der jedes Spiel mit einem Spieler durchspielt, der nie ohne Hilfe löst.

## 0.15.0, 13. November 2026: Über dieses Spiel

**Neu**
- In den Einstellungen steht ganz unten «Über dieses Spiel» (E-045):
  - **Deine Daten:** Der Spielstand bleibt auf dem Gerät, das Spiel schickt nichts weg, keine Cookies. GitHub speichert zur Sicherheit die IP-Adresse. Mit Link zur Datenschutzerklärung von GitHub.
  - **Inoffiziell:** kein Angebot von Anthropic, nicht mit Anthropic verbunden, die Namen Claude und Claude Code gehören Anthropic.
  - **Kontakt:** erscheint, sobald in `de/texte.json` eine E-Mail-Adresse eingetragen ist.
- Links im Spiel sind unterstrichen, gut lesbar und hoch genug für den Daumen.
- Die Inhaltsprüfung kontrolliert die neuen Texte und die E-Mail-Adresse. Insgesamt 64 Tests.

**Entschieden**
- Spenden sind geplant. Vorher kommt ein vollständiges Impressum (E-046, Roadmap 6.12).

## 0.14.0, 13. November 2026: Springen leichter finden

**Neu**
- Solange noch kein Auftrag erledigt oder angefangen ist, steht im Studio unter dem ersten Auftrag der Link «Schon weiter gewesen? Zu deinem Auftrag springen». Er öffnet die Einstellungen direkt bei der aufgeklappten Auftragsliste (E-043).

## 0.13.0, 13. November 2026: Springen und sichere Spielstände

**Neu**
- **Springen:** In den Einstellungen unter «Springen» einen späteren Auftrag wählen. Alles davor gilt als erledigt und gelernt und kommt später als Wiederholung. Mit Rückfrage, und der letzte Sprung lässt sich rückgängig machen (E-043).
- **Kein Fortschritt geht bei Updates verloren:** Alte Spielstände und Dateien werden umgewandelt statt verworfen. Passt ein angefangener Auftrag nach einem Update nicht mehr, beginnt er neu, statt das Spiel zu stören (E-044).
- **Hinweis für iPhone und iPad:** Das Spiel auf den Home-Bildschirm legen, sonst löscht Safari den Stand nach etwa einer Woche ohne Besuch.
- Insgesamt 63 Tests.

## 13. November 2026: Das Spiel ist online

- Version 0.12 ist öffentlich spielbar: https://claudegitty8.github.io/game-how-to-use-claudecode/
- Das Repository ist öffentlich, GitHub Pages ist eingeschaltet (E-041). Am Spiel selbst hat sich nichts geändert.

## 0.12.0, 11. November 2026: Studio-Bild und Vorbereitung fürs Hosting

**Neu**
- **Das Studio als kleines Bild:** Oben im Studio steht die Einrichtung des Kapitels, von der Werkzeugkiste in der Garage bis zum Pokal im bekannten Studio. Gekaufte Zierde steht mit drin.
- **GitHub Pages ist vorbereitet, aber nicht eingeschaltet:** `.github/workflows/veroeffentlichen.yml` veröffentlicht den Ordner `spiel/` nur, wenn der Besitzer es von Hand startet. Vorher laufen alle Prüfungen. Die Anleitung steht in `docs/VEROEFFENTLICHEN.md`.

## 0.11.0, 11. November 2026: Feinschliff

**Neu**
- **Übungsform «Sortieren»:** Schritte mit Pfeilen in die richtige Reihenfolge schieben. Fünf Aufgaben: Agentenschleife, Berechtigungen (harmlos bis heikel), API, Commit und Debugging. Sie stehen an zweiter Stelle der freien Situationen, damit jeder sie sieht.
- **Ampel an den Rechten:** Jedes Recht zeigt einen farbigen Punkt (grün frei, gelb mit Rückfrage, rot alles frei). Die Farbe ergänzt den Text nur.
- **Stationen im Aha:** Agentenschleife und Prüfschleife zeigen ihre drei Stationen als kleine Kette.
- Symbole vor den neuen Bausteingruppen (Werkzeuge, Connectors, Skills, Rechte, Felder, Zettel).
- Zugänglichkeit: Alle Farbpaare in Hell und Dunkel haben einen Kontrast von mindestens 5,4 zu 1 (verlangt sind 4,5). Sichtbarer Fokus auch bei Lexikon-Einträgen. Die Pfeile beim Sortieren sind beschriftet und gross genug für den Daumen.
- Insgesamt 182 Aufgaben, 50 Tests.

**Entschieden, noch nicht umgesetzt**
- Hosting soll über GitHub Pages laufen (E-038). Dafür muss das Repository öffentlich werden oder ein bezahltes Abo her. Das macht der Besitzer oder gibt es ausdrücklich frei.

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
