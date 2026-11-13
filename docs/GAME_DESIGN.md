# Game Design: Lernspiel «KI-Studio»

Stand: 11. November 2026 (Phase 2). Grundlage: `LEITLINIEN.md` und `LEHRPLAN.md`. Die Technik steht in `ARCHITEKTUR.md`.

## 1. Das Spiel in drei Sätzen

Du gründest in einer Garage ein kleines Studio und baust zusammen mit der KI «Kiwi» Spiele und Apps für schrullige Kunden. Du baust, indem du in der Werkstatt Bausteine wählst und verdrahtest. Fehlt etwas oder ist es ungenau, macht Kiwi herrlichen Quatsch, und genau daran lernst du, wie KI funktioniert.

## 2. Kernschleife

1. **Auftrag annehmen:** Ein Kunde beschreibt in zwei Sätzen, was er will.
2. **Bauen:** In der Werkstatt Bausteine wählen und verdrahten.
3. **Testen:** Knopf «Kiwi, los!» drücken.
4. **Ergebnis erleben:** Kiwi liefert. Entweder passt es, oder es ist Quatsch mit sichtbarer Ursache.
5. **Belohnung:** Kundenreaktion, Lexikon-Eintrag, gesparte Tokens.
6. **Studio wächst:** neue Räume, neue Bausteine, neue Kunden.

Eine Schleife dauert 1 bis 2 Minuten. Eine Runde besteht aus mehreren Schleifen und dauert 5 bis 10 Minuten.

## 3. Aufbau: Kapitel, Auftrag, Runde

- **Kapitel (6):** eine Ausbaustufe des Studios mit einem Thema.
- **Auftrag (12, siehe E-030):** ein Kunde mit einem Wunsch. Besteht aus 2 bis 4 Runden plus einer Mischrunde.
- **Runde:** führt genau ein neues Kernkonzept ein, in fünf Schritten.

| Schritt | Was passiert | Dauer |
|---|---|---|
| 1. Probieren | Der Spieler baut ohne Erklärung. Kiwi macht Quatsch. Kostet nichts. | 1 Min. |
| 2. Aha | Kiwis Quatsch wird aufgedeckt: Was hat gefehlt? Analogie und Bild, höchstens drei Sätze. Neuer Baustein wird freigeschaltet. | 1 Min. |
| 3. Beispiel | Eine fertige, gute Lösung ansehen und testen. | 1 Min. |
| 4. Lücke | Eine halbfertige Lösung ergänzen. Hilfe auf Wunsch. | 1–2 Min. |
| 5. Frei | Drei verschiedene Situationen ohne Hilfe lösen. | 3–5 Min. |

Nach Schritt 5 gilt das Konzept als gemeistert. Scheitert ein freier Versuch, gibt es Feedback und eine neue, andere Situation. Es zählen drei Erfolge, nicht drei Versuche.

## 4. Die Werkstatt

Die Werkstatt ist der wichtigste Bildschirm. Sie zeigt Kiwi in der Mitte und darum herum **Steckplätze**. Jedes gelernte Konzept ist ein Baustein mit eigener Form und Farbe.

| Bereich | Bausteine | Ab Kapitel |
|---|---|---|
| Eingang (links) | Prompt, Kontext, Beispiele | 1 |
| Über Kiwi | Rolle, System-Prompt, CLAUDE.md, Skills | 1 / 4 / 5 |
| In Kiwi (Sichtfenster) | Token-Zähler, Kontextfenster als Tischfläche | 2 |
| Kiwis Gürtel | Tools, Connectors, jeweils mit Berechtigungs-Ampel | 3 / 4 |
| Um Kiwi herum | Agentenschleife, Plan-Schalter, Prüfung, Subagenten | 3 |
| Ausgang (rechts) | Ergebnis, Prüfbaustein «Quelle zeigen» | 2 |

**Bedienung (zuerst fürs Handy):**
- Steckplatz antippen, dann aus einer Auswahl den Baustein oder Textteil wählen. Kein Ziehen nötig.
- Textbausteine (z. B. der Prompt) werden aus vorbereiteten Textteilen zusammengesetzt, nicht frei getippt.
- Die Werkstatt beginnt fast leer und zeigt nur, was schon gelernt ist. So wächst sie mit dem Können.
- Auf kleinen Bildschirmen ist immer ein Bereich gross, die anderen sind als Leiste sichtbar.

**Stufe «frei»:** Der Spieler sieht nur den Kundenwunsch und die leere Werkstatt. Welche Bausteine nötig sind, entscheidet er selbst. Es gibt mehr Textteile zur Auswahl als nötig, darunter plausible, aber unpassende.

## 5. Das KI-Quatsch-System

Kiwis Verhalten im simulierten Modus folgt festen Regeln, die als Daten abgelegt sind:

1. Jede Aufgabe kennt ihre **nötigen Zutaten** (z. B. Ziel, Zielgruppe, Format).
2. Jede fehlende, falsche oder überflüssige Zutat hat ein eigenes **Fehlbild**: einen lustigen, aber logischen Fehler.
3. Kiwi liefert das Ergebnis mit dem Fehlbild der wichtigsten Lücke.
4. Das Feedback zeigt die Verbindung: Der leere oder falsche Steckplatz blinkt, ein Satz erklärt den Zusammenhang.

**Regeln für guten Quatsch:**
- Er ist nachvollziehbar: Man muss denken können «Stimmt, woher hätte Kiwi das wissen sollen?»
- Er ist nie peinlich für den Spieler. Gelacht wird über Kiwi, nicht über den Menschen.
- Er entspricht echtem KI-Verhalten (Leitlinie B1). Jedes Fehlbild ist einer echten Schwäche zugeordnet.
- Pro Aufgabe gibt es mehrere Varianten, damit ein zweiter Versuch nicht denselben Witz bringt.

**Überraschungen bei richtigen Lösungen:** Etwa jede vierte gelungene Lösung löst ein Bonus-Ereignis aus: Der Kunde empfiehlt das Studio weiter, ein Sonderwunsch kommt hinzu, oder Kiwi findet eine elegante Zusatzidee. Die Ereignisse sind kleine Geschichten, keine Glücksspiel-Belohnungen.

## 6. Feedback und Hilfen

- **Sofort:** Nach jedem Test erscheint das Ergebnis und ein Satz «Das ist passiert, weil …».
- **Drei Hilfestufen auf Wunsch:** allgemeiner Tipp, Hinweis auf ein bestimmtes Teil, Lösung zeigen. Der Tipp ist frei. Ab der zweiten Stufe zählt die Situation nicht für die Meisterschaft und kommt später nochmals (E-017).
- **Erster Versuch zählt:** Für die Meisterschaft zählt eine freie Situation nur, wenn sie beim ersten Test richtig ist. Wer danebenliegt, darf weiterprobieren und den Quatsch geniessen, die Situation kommt später nochmals (E-017). Kommt sie wieder, sagt das Spiel «Die kennst du schon». Nach zwei Durchgängen ohne Fortschritt darf man weitergehen, das Konzept kommt dann als Wiederholung, bis es sitzt (E-047).
- **Anpassung:** Wer zweimal hintereinander scheitert, bekommt automatisch die erste Hilfestufe angeboten. Wer alles auf Anhieb löst, bekommt in der Lücken-Stufe weniger Vorgaben.
- **Schnelltest:** Zu Beginn jedes Kapitels kann man «Das kann ich schon» wählen. Wer drei freie Aufgaben pro Konzept besteht, überspringt die Einführung. Das Lexikon wird trotzdem gefüllt.

## 7. Meisterschaft und Wiederholung

- Jedes Kernkonzept hat eine **Meisterschaftsanzeige** mit drei Punkten.
- Nach der Meisterschaft kehrt das Konzept nach 1, 3 und 7 Runden als kleine Nebenaufgabe zurück («Übrigens, Frau Brunner hat noch eine Frage»).
- Gelingt die Wiederholung, wächst der Abstand. Misslingt sie, kommt sie früher wieder, ohne Punktabzug und ohne Vorwurf.
- **Mischrunde** am Ende jedes Auftrags: eine grössere Aufgabe, die mehrere Konzepte auf einmal braucht.

## 8. Tokens: die einzige Ressource

- Tokens erscheinen erst in Kapitel 2, zusammen mit dem Konzept «Token». Vorher wächst das Studio nur durch gelöste Aufträge.
- Jeder Auftrag bringt ein **Token-Budget**. Jeder Test verbraucht Tokens je nach Länge von Eingabe und Ausgabe.
- **Gesparte Tokens** kann man in den Studio-Ausbau stecken (Einrichtung, Maskottchen, Wandfarbe). Der Ausbau ist reine Zierde und Selbstausdruck, er macht nichts leichter.
- **Schutz vor Frust:** Der Schritt «Probieren» ist immer gratis. Das Budget kann nie eine Sackgasse erzeugen: Ist es leer, schiebt der Kunde mit einem Spruch nach, und es gibt lediglich keinen Sparbonus.
- So lernt man nebenbei: Länge kostet, überladener Kontext kostet doppelt, und knappe, klare Prompts sind auch die günstigen.

## 9. Fortschritt und Freischaltungen

| Kapitel | Studio | Neu in der Werkstatt |
|---|---|---|
| 1 | Garage | Eingang, Rolle |
| 2 | Garage mit Labor | Sichtfenster, Tokens |
| 3 | Büro | Werkzeuggürtel, Schleife, Helfer |
| 4 | Büro mit Serverraum | Steckerleiste, Tresor, Karteikasten |
| 5 | Studio-Etage | Projektordner, Speicherpunkte |
| 6 | Bekanntes Studio | Glaskasten für fremde Texte |

Sichtbarer Fortschritt an drei Orten: das Studio selbst, die wachsende Werkstatt und das Lexikon. Dazu eine **Auftragswand** mit erledigten Projekten und Kundenstimmen.

**Echte Wahl:** Ab Kapitel 2 stehen meist zwei Aufträge zur Auswahl, die dasselbe Konzept in anderem Gewand lehren (z. B. Spiel oder App). Der Spieler wählt nach Geschmack.

## 10. Lexikon

- Jeder Begriff wird beim ersten Auftreten freigeschaltet, mit kleiner Animation.
- Ein Eintrag enthält: englischer Begriff, deutsche Erklärung in zwei Sätzen, Analogie, Bild des Bausteins, Kiwis lustigster Fehler dazu und bei Kernkonzepten die Meisterschaftsanzeige.
- Claude-spezifische Begriffe sind markiert. Wo vereinfacht wurde, steht ein Hinweis «Genauer gesagt …».
- Das Lexikon ist jederzeit erreichbar, auch mitten in einer Aufgabe.

## 11. Figuren und Ton

- **Kiwi:** die KI im Spiel. Eifrig, wörtlich, nie beleidigt, nie ein «Freund». Kiwi ist ein Werkzeug mit Charme. Dargestellt als einfache geometrische Figur.
- **Kunden:** wiederkehrende, liebenswert schrullige Leute aus dem Quartier. Beispiele: Frau Brunner von der Bäckerei, ein Turnverein, ein Brettspiel-Opa, eine Schülerband.
- **Ton:** trocken-witzig, freundlich, nie belehrend. Humor entsteht aus wörtlich genommenen Anweisungen, das funktioniert für Zwölfjährige und Erwachsene.
- **Keine Angstmacherei und kein Hype:** KI wird als nützliches Werkzeug mit klaren Grenzen gezeigt.

## 12. Die zwei KI-Modi

- **Simuliert (Standard):** alles oben Beschriebene. Läuft ohne Konto, ohne Kosten und nach dem ersten Laden ohne Internet.
- **Echt (nur Erwachsene, freiwillig):** In den Einstellungen hinter einer 18+-Bestätigung. Nach gemeisterten Aufgaben erscheint ein Knopf «Mit echter KI ausprobieren». Derselbe Aufbau wird an Claude geschickt, die Antwort wird angezeigt.
  - Der Echt-Modus bewertet nichts und verändert keinen Lernfortschritt.
  - Vor dem Eintragen des Schlüssels erklärt das Spiel die Risiken in einfacher Sprache (Kosten, Schlüssel schützen, Limit setzen).
  - Wie der Schlüssel technisch abgelegt wird: Vorschlag in `ARCHITEKTUR.md`, Abschnitt 8.

## 13. Speichern, Zugänglichkeit, Schutz

- Automatisches Speichern nach jedem Schritt, nur auf dem Gerät. Spielstand lässt sich als Datei sichern und löschen.
- Schrift in drei Grössen, hoher Kontrast, alle Hinweise mit Form und Text statt nur Farbe, Animationen abschaltbar, Ton optional.
- Keine Streaks, keine Timer, keine Push-Nachrichten, keine Ranglisten, keine Käufe. Nach einer Runde schlägt das Spiel eine Pause vor, statt zum Weiterspielen zu drängen.

## 14. Woran wir Erfolg messen

1. **Lernen:** Vor Kapitel 1 und nach Kapitel 6 je sechs kurze Situationsfragen im Spiel («Was würdest du tun?»), freiwillig und ohne Note. Ziel: deutlich mehr richtige Antworten danach.
2. **Behalten:** Erfolgsquote bei den Wiederholungen nach 7 Runden. Ziel: mindestens 80 %.
3. **Spass:** Am Ende jedes Auftrags ein einziger Daumen hoch oder runter. Zusätzlich Beobachtung bei Testrunden.
4. **Verständlichkeit:** Testrunden mit mindestens zwei Jugendlichen (12 bis 14) und zwei Erwachsenen ohne Vorwissen vor jeder grösseren Erweiterung.

Alle Messwerte bleiben auf dem Gerät. Für Testrunden werden sie von Hand abgelesen.

## 15. Vorschau: der erste Auftrag (für Phase 5)

**Kundin:** Frau Brunner, Bäckerei Brunner. **Wunsch:** «Ein kleines Spiel für meine Kundschaft, während sie auf die Gipfeli wartet.»

| Runde | Konzept | Probieren | Drei freie Situationen |
|---|---|---|---|
| 1 | Prompt | «Mach ein Spiel» ergibt die Steuer-Kartoffel. | Spielidee, Titel, Spielregel bestellen |
| 2 | Kontext geben | Klarer Prompt, aber Kiwi kennt die Bäckerei nicht: Tiefseetaucher. | Zielgruppe, Ort, Zweck mitgeben |
| 3 | Beispiele geben | Level-Namen ohne Muster: beliebig. Mit nur einem Muster: zehnmal dasselbe. | Level-Namen, Belohnungstexte, Begrüssung |
| 4 | Mischrunde | – | Frau Brunner will ein zweites Spiel für Kinder: alles zusammen |

Freigeschaltet werden: Werkstatt-Eingang mit drei Steckplätzen, vier Lexikon-Einträge, die Auftragswand mit dem ersten Projekt.

## 16. Was noch offen oder unsicher ist

- **Textteile statt freiem Tippen:** Ob sich das Zusammensetzen eines Prompts aus Teilen wie «echtes Prompten» anfühlt, ist die grösste Unsicherheit. Phase 5 muss das zeigen.
- **Aufwand für Inhalte:** Jede Aufgabe braucht mehrere Fehlbilder und Varianten. Grob geschätzt 300 bis 400 kleine Texte für das ganze Spiel. Das ist der grösste Arbeitsposten.
- **Schnelltest:** Regeln sind festgelegt, die Aufgaben dafür noch nicht.
- **Name «Kiwi»** und Kundenfiguren sind Vorschläge und frei änderbar.
- **Ton und Musik:** nicht ausgearbeitet, für Phase 5 nicht nötig.
- **Name «Claude» im Echt-Modus:** vor einer Veröffentlichung rechtlich zu klären (siehe `RECHERCHE.md`, Abschnitt 4).
