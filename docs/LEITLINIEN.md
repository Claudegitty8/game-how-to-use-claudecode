# Leitlinien: Lernspiel «KI-Studio»

Stand: 11. November 2026 (Phase 2). Diese Grundprinzipien gelten für jede Entscheidung im Projekt. Begründungen stehen in `RECHERCHE.md`, Entscheide in `ENTSCHEIDUNGEN.md`. Wer eine Leitlinie ändern will, braucht einen Eintrag in den Entscheidungen.

## A. Lernen

**A1. Meisterschaft vor Fortschritt.** Ein Kernkonzept gilt erst als gelernt, wenn es dreimal in unterschiedlichen Situationen ohne Hilfe richtig angewendet wurde. Erst dann kommt das nächste. Die Zahl 3 ist ein Datenwert und wird im Test überprüft. Ausnahme: Wer bewusst zu einem späteren Auftrag springt, überspringt das Üben davor. Die übersprungenen Konzepte kommen als Wiederholung wieder (E-043).

**A2. Ein neues Konzept pro Runde.** Nie zwei neue Dinge gleichzeitig.

**A3. Erst probieren, dann verstehen.** Jedes Konzept beginnt mit einem kurzen Versuch ohne Risiko. Danach folgen Erklärung, vorgemachtes Beispiel, Lückenlösung und freie Anwendung.

**A4. Anwenden statt lesen.** Wissen wird abgerufen und benutzt. Erklärtexte sind höchstens drei kurze Sätze lang.

**A5. Wiederholen in wachsenden Abständen.** Gelerntes taucht nach 1, 3 und 7 Runden wieder auf, danach gemischt in neuen Aufträgen.

**A6. Mischen.** Ab dem zweiten Auftrag kombiniert jede Abschlussrunde alte und neue Konzepte.

**A7. Sofortiges, erklärendes Feedback.** Das Spiel zeigt, was passiert ist, und in einem Satz, warum.

**A8. Bild und Wort zusammen.** Jedes Konzept hat einen sichtbaren Baustein und eine Alltags-Analogie.

**A9. Hilfen passen sich an.** Wer es kann, bekommt weniger Hilfe. Wer Vorwissen hat, kann per Schnelltest abkürzen.

**A10. Jeder gelernte Begriff landet im Lexikon.**

## B. Spiel

**B1. Die Mechanik ist das Konzept.** Was der Spieler tut, entspricht dem, was man mit echter KI tut. Ein fehlender Baustein erzeugt genau den Fehler, den eine echte KI machen würde. Keine Rätsel, die nur so aussehen wie KI.

**B2. Fehler sind der beste Teil.** Fehler kosten nichts, sind lustig und zeigen genau, was gefehlt hat. Es gibt kein «Game Over».

**B3. Spass hat Vorrang.** Ist etwas lehrreich, aber langweilig, wird es umgestaltet oder ins Lexikon verschoben.

**B4. Klare Kernschleife.** Auftrag annehmen, bauen, testen, Ergebnis erleben, Belohnung, Studio wächst.

**B5. Erster Erfolg in der ersten Minute.** Keine Anmeldung, kein Tutorial-Text vor dem ersten Bauen.

**B6. Kurze Runden.** 5 bis 10 Minuten, jederzeit unterbrechbar, Stand wird automatisch gespeichert.

**B7. Story sparsam.** Die Geschichte entsteht aus dem Verhalten der KI und aus den Kunden. Kein Textblock über 40 Wörter.

**B8. Schlichte Darstellung.** Klare, schematische Grafik. Nichts bewegt sich nur zur Zierde.

**B9. Simulation dient dem Lernen.** Es gibt genau eine Ressource: Tokens. Kein Geld, keine Buchhaltung.

**B10. Echte Wahl.** Der Spieler wählt Aufträge, Lösungswege und Studio-Ausbau. Mehrere Lösungen sind richtig, wenn sie in der echten Welt auch funktionieren würden.

## C. Zielgruppe und Schutz

**C1. Für Erwachsene ohne Vorwissen und Jugendliche ab 12.** Du-Form, einfache Sprache, Sätze mit höchstens 15 Wörtern, Humor ohne Spott.

**C2. Der Zwölfjährigen-Test.** Jeder Text wird so geschrieben, dass ihn ein zwölfjähriges Kind ohne Hilfe versteht.

**C3. Keine Manipulation.** Kein künstlicher Zeitdruck, keine Kaufanreize, keine Streaks, keine Bestrafung für Pausen, keine Benachrichtigungen, die zurücklocken.

**C4. Keine persönlichen Daten.** Kein Konto, keine Namen, kein Tracking. Der Spielstand bleibt auf dem Gerät.

**C5. Echte KI nur für Erwachsene.** Der Echt-Modus ist ein freiwilliger Zusatz hinter einer 18+-Bestätigung. Das ganze Spiel und der ganze Lernfortschritt funktionieren ohne ihn.

**C6. Für alle bedienbar.** Schrift vergrösserbar, gute Kontraste, alles per Tippen bedienbar (kein Ziehen nötig), nie nur Farbe als Hinweis.

**C7. Jugendgerechte Inhalte.** Keine Gewalt, keine Angstmacherei vor KI, kein Vermenschlichen der KI als Freund.

## D. Inhalt und Fakten

**D1. Fachlich richtig.** Jede Aussage über KI und Claude ist an einer offiziellen Quelle geprüft. Quelle und Prüfdatum stehen bei den Daten.

**D2. Prinzipien statt Zahlen.** Das Spiel lehrt, wie etwas funktioniert. Konkrete Zahlen, Modellnamen und Preise stehen nur in einer eigenen Datendatei mit Prüfdatum.

**D3. Fachbegriffe im Original.** Englischer Begriff, deutsche Erklärung, einmal eingeführt und dann immer gleich verwendet.

**D4. Ehrlich über Grenzen.** Vereinfachungen sind erlaubt, Falsches nicht. Wo vereinfacht wird, sagt es das Lexikon.

**D5. Neutral, wo es geht.** Die KI-Figur im Spiel heisst «Kiwi». Konzepte gelten für Sprachmodelle allgemein. Claude-spezifische Dinge (CLAUDE.md, Skills, Plan mode) sind als solche bezeichnet.

## E. Technik und Ordnung

**E1. Drei getrennte Schichten.** Spiellogik, Oberfläche und Lerninhalte sind strikt getrennt. Lerninhalte sind Daten, kein Programmcode.

**E2. Mehrsprachig vorbereitet.** Alle Texte liegen in Sprachdateien.

**E3. Eine Schnittstelle für beide KI-Modi.** Simuliert und echt sind austauschbar. Der Lernfortschritt hängt nie von der echten KI ab.

**E4. Keine Geheimnisse im Code.** API-Schlüssel landen nie im Code oder im Repository.

**E5. Jede Information nur an einem Ort.** Jede Änderung aktualisiert die betroffenen Dokumente.

**E6. Kleine Schritte.** Git von Anfang an, kleine Commits, automatische Tests für die Spiellogik.

**E7. Nichts löschen oder umbauen ohne Eintrag** in den Entscheidungen.

## Prüfliste vor jeder Übergabe

1. Hält es alle Leitlinien ein?
2. Stimmen die Fachinhalte laut offizieller Quelle, mit Datum?
3. Laufen die Tests?
4. Besteht jeder neue Text den Zwölfjährigen-Test?
5. Macht es Spass, auch beim Scheitern?
6. Sind die Dokumente aktuell?
7. Ist offen benannt, was unsicher oder unfertig ist?
