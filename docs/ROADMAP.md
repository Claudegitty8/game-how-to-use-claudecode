# Roadmap: Lernspiel «KI-Studio»

Stand: 13. November 2026. Die Reihenfolge ist verbindlich, Termine gibt es bewusst keine.

## Erledigt

- **Phase 0, Verständnis:** Unklarheiten geklärt.
- **Phase 1, Recherche:** `RECHERCHE.md`.
- **Phase 2, Konzept:** `LEITLINIEN.md`, `LEHRPLAN.md`, `GAME_DESIGN.md`.
- **Phase 3, Prompt-Prüfung:** `MASTER_PROMPT_V2.md`.
- **Phase 4, Fundament:** Technik, Ordner, Architektur, leere App mit Kostprobe, Tests, Inhaltsprüfung.

- **Phase 5, Erstes spielbares Stück:** Auftrag «Bäckerei Brunner» mit drei Runden und Mischrunde, Meisterschaft, Hilfen, Lexikon, Speichern. Testbogen in `TESTBOGEN.md`.

- **Schritt 6.2 (Teil):** Zweiter Auftrag «Turnverein» mit Rolle und System-Prompt, mehrere Aufträge, Wiederholungen über Aufträge hinweg. Kapitel 1 ist damit komplett.

## Stand

Version 0.12: Das Spiel ist vollständig gebaut (12 Aufträge, 24 Kernkonzepte, Abschlussauftrag, Schnelltest, Studio-Einrichtung, freiwillige Fragen, Offline-Betrieb). Seit Version 0.13 kann man zu einem Auftrag springen, und Spielstände bleiben bei Updates erhalten. Version 0.14 macht das Springen vom Studio aus auffindbar. Version 0.15 bringt «Über dieses Spiel» mit Datenschutz, Hinweis «inoffiziell» und Platz für eine Kontakt-Adresse. Seit 13. November 2026 ist das Spiel öffentlich spielbar: https://claudegitty8.github.io/game-how-to-use-claudecode/. **Alles Weitere braucht den Besitzer:** Kontakt-Adresse (6.10), Testrunde (6.1), Echt-Modus und Spenden (6.12).

## Offen und jederzeit nachholbar: Testrunde (Schritt 6.1)

Jetzt, wo das ganze Spiel steht, spielen mindestens zwei Jugendliche (12 bis 14) und zwei Erwachsene ohne Vorwissen den ersten Auftrag. Der Besitzer führt die Testrunde mit `TESTBOGEN.md` durch und bringt die Notizen zurück. Daraus entsteht eine Liste von Änderungen. Der Besitzer hat entschieden, vorerst ohne Testrunde weiterzubauen (E-022).

## Phase 6, Ausbau

| Schritt | Inhalt |
|---|---|
| 6.1 | Testrunde mit zwei Jugendlichen und zwei Erwachsenen. Ergebnisse einarbeiten. |
| 6.2 | Rest: Ergebnisse der Testrunde einarbeiten, verschobene Punkte aus E-020. |
| 6.3 | **Erledigt:** Kapitel 2 «Wie die KI tickt» mit den Aufträgen «Dorfmuseum» und «Dorfzeitung», Übungsform Vorhersagen, Absicherung, Token-Zähler, Kiwis Tisch, Token-Budget. Gesparte Tokens lassen sich seit Version 0.10 für die Studio-Einrichtung ausgeben. |
| 6.4 | **Erledigt:** Schnelltest «Das kann ich schon», freiwillige Fragen vorher und nachher, Daumen pro Auftrag, Spielstand als Datei. |
| 6.5 | **Erledigt:** Kapitel 3 «Kiwi bekommt Hände» (Aufträge «Jassclub» und «Schülerband») und Kapitel 4 «Das Studio vernetzt sich» (Aufträge «Velo-Laden» und «Blumenladen»). Seit Version 0.11 mit Übungsform «Sortieren», Ampel und Stationen (E-037). |
| 6.6 | **Erledigt:** Kapitel 5 «Echte Software» (Aufträge «Kinderzirkus» und «Bibliothek»), Kapitel 6 «Sicher unterwegs» (Auftrag «Gemeinde») und der Abschlussauftrag «Dorffest». Alle 24 Kernkonzepte sind spielbar. |
| 6.7 | **Erledigt:** installierbare Web-App, die ohne Internet läuft. Seit 13. November 2026 öffentlich auf GitHub Pages: https://claudegitty8.github.io/game-how-to-use-claudecode/ (E-041). Neue Fassungen stellt der Besitzer von Hand online, Anleitung in `VEROEFFENTLICHEN.md`. |
| 6.8 | Zugänglichkeit prüfen (Schriftgrössen, Kontraste, Bedienung mit Hilfstechnik). **Teilweise erledigt:** Kontraste gerechnet, Fokus und Beschriftungen geprüft. Noch offen: Prüfung mit Vorlesehilfe an echten Geräten. |
| 6.9 | Echt-Modus für Erwachsene. Entscheid zum API-Schlüssel. |
| 6.10 | Rechtliches: Name «Claude», Datenschutz, Impressum. **Teilweise erledigt (Version 0.15, E-045):** «Über dieses Spiel» mit Datenschutz und Hinweis «inoffiziell». Noch offen: Der Besitzer legt eine eigene E-Mail-Adresse fürs Spiel an. Sie kommt in `de/texte.json` unter `ueberKontaktAdresse`, danach neu veröffentlichen. |
| 6.11 | Später: Desktop-Programm, danach iOS. |
| 6.12 | Spenden (E-046). Vorher: vollständiges Impressum mit Name, Postadresse und E-Mail; prüfen, ob GitHub Pages Spenden-Links erlaubt; Hinweis ohne Druck (Leitlinie C3). |

## Offene Entscheide

- API-Schlüssel: Weg A oder B (vor 6.9, Vorschlag in `ARCHITEKTUR.md`).
- Name «Claude»: Vorerst Hinweis «inoffiziell» (E-045). Ob die Adresse mit «claudecode» bleibt oder Anthropic gefragt wird, ist offen.
- Ob 24 Kernkonzepte zu viel sind (nach 6.1).
