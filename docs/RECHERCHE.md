# Recherche: Lernspiel «KI-Studio»

Stand: 11. November 2026. Phase 1 des Master-Prompts.
Alle Aussagen sind in eigenen Worten zusammengefasst. Die Quellen stehen am Ende, die Nummern in eckigen Klammern verweisen darauf.

**So ist das Dokument zu lesen:** Jeder Abschnitt endet mit «Folgerung für unser Spiel». Abschnitt 4 sammelt alles, was im ersten Master-Prompt fehlte oder nicht mehr stimmte. Abschnitt 5 sagt offen, was unsicher ist.

---

## 1. Was Lernspiele und Simulatoren erfolgreich macht

### 1.1 Was die Forschung über Lernspiele sagt

- **Lernspiele wirken, aber nicht von allein.** Eine grosse Auswertung von 39 Studien fand: Mit Lernspielen lernt man etwas besser (Effekt d = 0,29) und behält es besser (d = 0,36) als mit herkömmlichem Unterricht. Motivierender waren die Spiele im Schnitt aber nicht. [1]
- **Mehrere Sitzungen schlagen eine einzelne.** Spiele wirkten stärker, wenn über mehrere Sitzungen gespielt wurde und wenn sie mit weiterer Erklärung ergänzt waren. [1][2]
- **Einfache Grafik reicht, oft ist sie besser.** Schematische Darstellung war wirksamer als comicartige oder realistische. Aufwendige Grafik kann vom Lernen ablenken. [1][2][3]
- **Story ist ein Risiko.** Der Unterschied war nicht eindeutig belegt, aber Spiele ohne Geschichte schnitten tendenziell eher besser ab als solche mit. [2]
- **Die Gestaltung entscheidet.** Eine Auswertung für MINT-Fächer fand einen mittleren bis grossen Vorteil für Lernspiele (g = 0,62). Zusätzliche Spielelemente brachten nochmals etwas (g = 0,30), und zwar mehr, wenn sie dem Lernen des Inhalts dienten, als wenn sie nur das Spielerlebnis aufpeppten. [4]

### 1.2 Vorbilder und ihre Lehren

| Spiel | Was es gut macht | Was schiefging |
|---|---|---|
| **while True: learn()** (Luden.io) | Sehr nah an unserer Idee: Man nimmt Aufträge an, verdrahtet sichtbare Bausteine, rüstet seinen Arbeitsplatz auf, Humor mit Katze. Sehr positive Bewertungen. [5][6] | Spieler bemängeln, man lerne über Machine Learning so viel wie in «Civilization» über Geschichte: Die Rätsel bilden die echten Konzepte zu wenig ab. Der Start-up-Teil wirkt aufgesetzt, die Schwierigkeit steigt zu schnell. [6][7] |
| **Human Resource Machine** | Programmieren als kleine Büro-Rätsel, ohne Fachsprache, in kleinen Häppchen. [8] | Ab der Mitte verlangt das Spiel Dinge, die es nie erklärt hat. Anfänger bleiben stecken, weil Hilfen fehlen. [8][9] |
| **Zachtronics** (SpaceChem, Opus Magnum u. a.) | Gelöstes Rätsel neben ungelöstem zeigen. Information erst dann geben, wenn man sie braucht. Ganze Aufgaben statt Fleissarbeit. [10][11] | Der Gründer warnt: Lernen in ein Spiel hineinzuzwingen, zerstört Spass und Entscheidungsfreiheit. Die Tätigkeit selbst muss Spass machen. [12] |
| **Game Dev Tycoon** | Saubere, einfache Kernschleife (entwickeln, veröffentlichen, wachsen), von der Garage zum Studio, funktioniert sehr gut am Handy. [13] | – |
| **Gandalf** (Lakera) | Lehrt Prompt Injection, indem man selbst versucht, einer KI ein Passwort zu entlocken. Jede Stufe hat stärkere Abwehr. [14] | Braucht eine echte KI im Hintergrund, bei uns muss das simuliert werden. |

Aus einer Design-Analyse von Tycoon-Spielen (Einzelmeinung, kein Forschungsergebnis): Die erste Schleife muss sofort Erfolg liefern, und wer eine Ebene meistert, bekommt als Belohnung eine neue Ebene zum Meistern. [15]

### 1.3 Warum Spiele Spass machen

Nach der Selbstbestimmungstheorie machen Spiele dann Freude, wenn sie drei Bedürfnisse erfüllen: **Kompetenz** (ich kann etwas), **Autonomie** (ich entscheide selbst) und **Verbundenheit**. Studien zeigten, dass erlebte Kompetenz und Autonomie Spielfreude und den Wunsch weiterzuspielen vorhersagen. [16]

### Folgerung für unser Spiel

1. **Die Spielmechanik muss das Konzept selbst sein.** Wer einen Baustein falsch verdrahtet, muss genau den Fehler sehen, den eine echte KI machen würde. Das ist die wichtigste Abgrenzung zu while True: learn().
2. **Die Studio-Simulation darf keine Dekoration sein.** Geld, Kunden und Ausbau müssen mit dem Gelernten zusammenhängen (z. B. Tokenkosten als echtes Budget).
3. **Story kurz und aus dem Bauen heraus.** Der «KI-Quatsch» ist die Story. Keine langen Textstrecken.
4. **Schlichte, schematische Grafik** ist kein Kompromiss, sondern richtig.
5. **Keine Schwierigkeitssprünge.** Nichts verlangen, was nicht vorher eingeführt wurde. Immer eine Hilfe anbieten.
6. **Erster Erfolg in der ersten Minute.**

---

## 2. Wie Menschen am besten lernen und behalten

- **Sich abfragen und verteilt üben sind die zwei wirksamsten Techniken.** Eine viel zitierte Übersicht bewertete zehn Lerntechniken: Nur Selbsttests und zeitlich verteiltes Üben erhielten die Note «hoher Nutzen». Wiederlesen und Markieren bringen wenig. [17][18]
- **Mischen und Selbsterklären** erhielten die Note «mittlerer Nutzen». [18]
- **Rückmeldung zählt.** Selbsttests mit korrigierender Rückmeldung führen zum besten Lernerfolg. [18]
- **Vorgemachte Beispiele helfen Anfängern, dann langsam ausblenden.** Anfänger lernen aus durchgerechneten Beispielen besser als aus reinem Probieren. Danach blendet man die Schritte nach und nach aus («Fading»), bis die Person allein löst. [19][20]
- **Achtung Umkehr-Effekt:** Was Anfängern hilft, bremst Fortgeschrittene. Wer schon Vorwissen hat, lernt mit zu viel Anleitung schlechter. Am besten passt sich das Ausblenden dem Können an. [20][21]
- **Produktives Scheitern wirkt.** Eine Auswertung von 53 Studien (ETH Zürich) zeigt: Wer zuerst selbst an einem Problem knobelt und erst danach die Erklärung bekommt, versteht Konzepte besser als umgekehrt. Knapp die Hälfte der Teilnehmenden war 12 bis 18 Jahre alt. Voraussetzung ist etwas Vorwissen, und untersucht wurden nur Mathematik und Naturwissenschaften. [22]

### Folgerung für unser Spiel

1. Die Lernregeln (Abrufen, verteilte Wiederholung, Mischen, sofortiges Feedback) sind gut belegt und bleiben.
2. **Spannung zwischen zwei Regeln:** «Erst vorgemachte Lösung, dann Lücke, dann frei» und «Fehler sind der unterhaltsamste Teil» ziehen in verschiedene Richtungen. Lösung: Zuerst ein kurzer, gefahrloser Versuch, bei dem die KI Quatsch macht (weckt Neugier und zeigt die Lücke), dann die Erklärung, dann Beispiel, Lücke, frei (Entscheid E-006).
3. **Überspringen ermöglichen.** Erwachsene mit Vorwissen brauchen einen Schnelltest, um Bekanntes abzukürzen.
4. **Die Zahl «dreimal richtig» ist eine Setzung.** Dafür habe ich keinen direkten Beleg gefunden. Sie ist vernünftig, sollte aber als Datenwert einstellbar sein und im Test überprüft werden.

---

## 3. Aktueller Stand der Claude-Begriffe (geprüft an offiziellen Seiten)

### 3.1 Grundlagen

| Begriff | Offizieller Stand | Hinweis für das Spiel |
|---|---|---|
| **Token** | Kleinste Texteinheit eines Sprachmodells. Wie viele Zeichen ein Token umfasst, hängt von Modell und Sprache ab. Neuere Modelle zerlegen denselben Text in rund 30 % mehr Tokens als ältere. Faustregel in der Hilfe: etwa ¾ eines Wortes. [23][24] | Keine festen Zahlen lehren, nur das Prinzip. |
| **Context window** | Alles, worauf das Modell beim Antworten zurückgreifen kann, inklusive der Antwort selbst. Eine Art Arbeitsgedächtnis, nicht das Trainingswissen. Je nach Modell 200 000 bis 1 Million Tokens. [23][25] | Analogie «Schreibtisch» passt. |
| **Context rot** | Je voller das Kontextfenster, desto ungenauer wird das Modell. Mehr Kontext ist nicht automatisch besser. [25] | Ein guter «KI-Quatsch». |
| **Halluzination** | Das Modell erzeugt Text, der sachlich falsch ist oder dem gegebenen Kontext widerspricht. Gegenmittel: «Ich weiss es nicht» erlauben, wörtliche Zitate verlangen, Quellen angeben lassen. [26] | |
| **Prompting** | Klar und direkt sein. Offizielles Bild: Claude wie eine brillante, aber neue Mitarbeiterin behandeln, die den Zusammenhang nicht kennt. Dazu Beispiele und Rollen (System-Prompt). [27][28] | Diese Analogie können wir übernehmen. |
| **Schritt-für-Schritt-Denken** | Für neuere Modelle wird empfohlen, allgemein zum gründlichen Nachdenken aufzufordern statt Schritte vorzuschreiben. Bei den neuesten Modellen steuert man das Nachdenken über eine Aufwand-Stufe («effort»). [27][29] | Lernziel umformulieren: «Der KI Zeit zum Nachdenken geben». |

### 3.2 KI handelt

| Begriff | Offizieller Stand |
|---|---|
| **Tool** | Eine Handlung, die Claude ausführen kann (Datei lesen, Befehl ausführen, im Web suchen). Ohne Tools kann Claude nur Text antworten. [30][31] |
| **Agentic loop** | Offiziell drei Phasen: Kontext sammeln, handeln, Ergebnis prüfen, und das wiederholt, bis die Aufgabe erledigt ist. Der Mensch kann jederzeit unterbrechen. [30][31] |
| **Agentic harness** | Die Hülle um das Modell, die Tools, Kontextverwaltung und Ausführung bereitstellt. Claude Code ist die Hülle, Claude das Modell darin. [30][31] |
| **Subagent** | Ein spezialisierter Helfer mit eigenem Kontextfenster, der nur eine Zusammenfassung zurückgibt. [31][32] |
| **Verification loop** | Man gibt Claude eine Prüfung, die es selbst ausführen kann (z. B. einen Test). Gilt offiziell als wichtigster Einzeltipp. [31][33][34] |
| **Permission modes** | Sechs Stufen von «alles einzeln bestätigen» (Manual) über «Plan» und «Auto» bis «alle Prüfungen überspringen». Neue Sitzungen starten in aktuellen Versionen im Auto-Modus, in dem ein zweites Modell riskante Aktionen prüft. [35][33] |
| **Plan mode** | Claude erkundet und schlägt einen Plan vor, ändert aber nichts, bis man zustimmt. Empfohlener Ablauf: erkunden, planen, umsetzen, committen. [33][35] |

### 3.3 Anbindung und Erweiterung

| Begriff | Offizieller Stand |
|---|---|
| **MCP** | Offener Standard, über den KI-Anwendungen mit Werkzeugen und Daten verbunden werden. Offizielles Bild: USB-C für KI. Der KI-Assistent ist der MCP-Client, der Dienst stellt einen MCP-Server bereit. [36][37] |
| **Connector** | So heissen MCP-Verbindungen in Claude. Ein Connector verbindet Claude mit einer App (z. B. Kalender, Dokumente), damit Claude dort lesen und handeln kann. Claude erhält dabei nur die Rechte der jeweiligen Person. Es gibt Web-Connectors und lokale Desktop-Erweiterungen. [36][38][39] |
| **Skill** | Schriftliche Anleitung (Datei SKILL.md), die Claude nur lädt, wenn die Aufgabe sie braucht. Folgt einem offenen Standard. [40][39] |
| **Plugin** | Ein Paket, das Skills, Subagenten, Hooks und MCP-Server als eine Einheit installierbar macht. [41][39] |
| **Hook** | Ein Skript, das bei bestimmten Ereignissen automatisch läuft, z. B. nach jeder Dateiänderung. [42] |
| **CLAUDE.md** | Textdatei mit dauerhaften Anweisungen, die zu Beginn jeder Sitzung geladen wird. Empfehlung: unter 200 Zeilen halten. [42][31] |
| **Claude Code** | Agentisches Programmierwerkzeug. Verfügbar im Terminal, als Desktop-App, in Entwicklungsumgebungen und im Browser. [30][43] |
| **API-Schlüssel** | Wie eine Kreditkartennummer zu behandeln: Wer ihn hat, verursacht Kosten auf dem Konto. Nie teilen, nie in den Code schreiben, Ausgabenlimit setzen. [44] |

### 3.4 Zwei Befunde mit Folgen für die Architektur

**a) API-Schlüssel im Browser.** Anthropic rät, die Claude-API vom eigenen Server aus aufzurufen und nicht aus Code, der im Browser der Nutzer läuft, weil ein Schlüssel im Seitencode für jeden lesbar ist. Direkte Aufrufe aus dem Browser sind nur mit einer ausdrücklich als «gefährlich» benannten Einstellung möglich. [45][46]
→ Für den optionalen Echt-Modus heisst das: Entweder trägt jede Person ihren eigenen Schlüssel ein, der nur auf ihrem Gerät bleibt (Risiko liegt bei ihr und muss erklärt werden), oder wir brauchen einen eigenen kleinen Server. Vorschlag in `ARCHITEKTUR.md`, Abschnitt 8.

**b) Altersgrenze 18 Jahre.** Claude als Verbraucherprodukt ist nur für Personen ab 18 Jahren. Wer mit der API ein Produkt für Minderjährige baut, muss zusätzliche Schutzmassnahmen erfüllen, etwa Altersprüfung, Inhaltsfilter und Überwachung. [47][48]
→ Das kollidiert mit unserer Zielgruppe ab 12 Jahren. Der Echt-Modus kann für Jugendliche so nicht angeboten werden (Entscheid E-005). Der simulierte Modus ist nicht betroffen.

---

## 4. Was im ersten Master-Prompt fehlte oder angepasst wurde

| Nr. | Befund | Umsetzung |
|---|---|---|
| 1 | **Altersgrenze 18+** für echte Claude-Nutzung, Zielgruppe ist ab 12. | Echt-Modus nur für Erwachsene (E-005). |
| 2 | **Agentenschleife** hiess «planen, handeln, prüfen». Offiziell: Kontext sammeln, handeln, prüfen. | Wortlaut angepasst. Planen ist ein eigenes Konzept. |
| 3 | **Fehlende Begriffe:** Hook, Permission modes, Plan mode, Verification loop, Agentic harness, Context rot, Compaction (automatisches Zusammenfassen bei vollem Kontext). | Im Lehrplan als Kern- oder Lexikon-Begriff. |
| 4 | **«Schritt-für-Schritt-Denken»** ist als Technik überholt. | Umformuliert (siehe 3.1). |
| 5 | **Reihenfolge Beispiel vor Eigenversuch** widerspricht dem Befund zum produktiven Scheitern. | Fünf Schritte (E-006). |
| 6 | **Kein Überspringen** für Leute mit Vorwissen. | Schnelltest pro Kapitel. |
| 7 | **Produktdetails veralten schnell** (Tokenzahlen, Modi, Modellnamen). | Eigene Datendatei `fakten.json` mit Prüfdatum und Quelle. Im Spiel Prinzipien lehren, keine Zahlen. |
| 8 | **Story-Risiko und Grafik:** Forschung spricht für schlichte Darstellung und sparsame Story. | Leitlinien B7 und B8. |
| 9 | **Abgrenzung zu while True: learn()** fehlte. | Leitlinie B1: Mechanik bildet das echte Verhalten ab. |
| 10 | **Erfolgsmessung fehlte.** | Vorher-Nachher-Fragen und Testrunden (`GAME_DESIGN.md`, Abschnitt 14). |
| 11 | **Barrierefreiheit** war nicht erwähnt. | Leitlinie C6. |
| 12 | **Name «Claude» im Spiel:** Darf ein fremdes Spiel den Markennamen verwenden? | Nicht recherchiert. Vor einer Veröffentlichung klären. Für den Eigengebrauch unkritisch. |

Bestätigt wurde der Verzicht auf manipulative Mechaniken: Eine Studie fand in vier von fünf Apps für kleine Kinder manipulative Gestaltung, darunter künstlichen Zeitdruck und Lockmittel für längeres Spielen. [49]

---

## 5. Was unsicher oder unfertig ist

- Die Studienergebnisse stammen aus Zusammenfassungen und Kurzfassungen, nicht aus der vollständigen Lektüre der Originalarbeiten.
- Die Aussage zu Tycoon-Spielen [15] und die Analyse zu Human Resource Machine [9] sind Einzelmeinungen von Autoren, keine Forschung.
- Die Forschung zum produktiven Scheitern betrifft Mathematik und Naturwissenschaften. Ob sie sich auf KI-Wissen überträgt, ist eine Annahme.
- Preise pro Token habe ich nicht geprüft. Sie ändern sich häufig und gehören in die Datendatei aus Punkt 7.
- Deutschsprachige Konkurrenzangebote und die Schweizer Rechtslage (Datenschutz bei Minderjährigen) sind nicht recherchiert.
- Die Prinzipien von Richard Mayer zum Lernen mit Bild und Wort sind hier nicht einzeln belegt. Sie stützen die Regel «Bild und Wort zusammen», eine genaue Prüfung steht aus.
- Die Claude-Dokumentation ändert sich laufend. Alle Angaben in Abschnitt 3 haben den Stand 11. November 2026.

---

## Quellen

**Lernspiele und Vorbilder**
1. Wouters u. a. (2013), A Meta-Analysis of the Cognitive and Motivational Effects of Serious Games: https://ocw.metu.edu.tr/mod/resource/view.php?id=5403
2. Clark, Tanner-Smith, Killingsworth (2016), Digital Games, Design, and Learning: https://pmc.ncbi.nlm.nih.gov/articles/PMC4748544
3. Joan Ganz Cooney Center, Can Typical Educational Games Support Learning Within Curriculum?: https://joanganzcooneycenter.org/?p=16779
4. Gui u. a. (2023), Effectiveness of digital educational game and game design in STEM learning: https://doaj.org/article/a86dd0a9b0a443f5806e4501267ccafc
5. while True: learn() auf Steam: https://store.steampowered.com/app/619150
6. TheSixthAxis, while True: Learn() Review: https://www.thesixthaxis.com/2019/03/11/while-true-learn-review/
7. Steam-Diskussion «Feedback and confusion»: https://steamcommunity.com/app/619150/discussions/0/2248929785819448565
8. Destructoid, Review: Human Resource Machine: https://destructoid.com/reviews/review-human-resource-machine
9. SUPERJUMP, Integrating Learning with Gameplay in Human Resource Machine: https://www.superjumpmagazine.com/integrating-learning-with-gameplay-human-resource-machine/
10. PC Gamer, How developers build the tutorials you skip: https://pcgamer.com/how-developers-build-the-tutorials-you-skip
11. Case Studies in Game-Based Complex Learning: https://www.academia.edu/75467374/Case_Studies_in_Game_Based_Complex_Learning
12. Zach Barth, Talks at Google (Zusammenfassung): https://rosetta.to/u/talksatgoogle/zachtronics-10-years-of-terrible-games-zach-barth-talks-at-google
13. Pocket Gamer, Game Dev Tycoon review: https://www.pocketgamer.com/game-dev-tycoon/review/
14. Lakera, Gandalf: https://www.lakera.ai/blog/gandalf-agent-breaker
15. Polylusion Games, What makes a great tycoon game?: https://polylusion-games-site.pages.dev/blog/what-makes-great-tycoon-game
16. Ryan, Rigby, Przybylski (2006), The Motivational Pull of Video Games: https://www.rochester.edu/warner/lida/wp-content/uploads/2022/11/02bfe513dd59366750000000.pdf

**Lernforschung**
17. Association for Psychological Science, Which Study Strategies Make the Grade?: https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html
18. Texas Center for Learning Disabilities, Zusammenfassung Dunlosky u. a. (2013): https://texasldcenter.org/?p=346
19. Worked-example effect (Übersicht): https://en.wikipedia.org/wiki/Worked-example_effect
20. Moreno u. a. (2009), Optimizing Worked-Example Instruction: https://faculty.engineering.asu.edu/mre/wp-content/uploads/sites/31/2020/02/MoRO09.pdf
21. Expertise reversal effect (Übersicht): https://wiki.riteme.site/wiki/Expertise_reversal_effect
22. ETH Zürich / Phys.org, Those who fail productively are all the wiser (Sinha & Kapur 2021): https://phys.org/news/2021-09-productively-wiser.html

**Claude (offizielle Seiten)**
23. Glossar der Claude-Plattform: https://platform.claude.com/docs/en/about-claude/glossary
24. Claude Code Cheatsheet: https://support.claude.com/en/articles/14553413-claude-code-cheatsheet
25. Context windows: https://platform.claude.com/docs/en/build-with-claude/context-windows
26. Reduce hallucinations: https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations
27. Prompting best practices: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
28. Prompt engineering overview: https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview
29. Prompting Claude Opus 5.5: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5
30. How Claude Code works: https://code.claude.com/docs/en/how-claude-code-works
31. Claude Code Glossar: https://code.claude.com/docs/en/glossary
32. Create custom subagents: https://code.claude.com/docs/en/sub-agents
33. Best practices for Claude Code: https://code.claude.com/docs/en/best-practices
34. Claude Code power user tips: https://support.claude.com/en/articles/14554000-claude-code-power-user-tips
35. Choose a permission mode: https://code.claude.com/docs/en/permission-modes
36. What is Model Context Protocol?: https://claude.com/resources/articles/what-is-model-context-protocol
37. Get started with custom connectors using remote MCP: https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
38. Use connectors to extend Claude's capabilities: https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities
39. Connectors, skills, and plugins: https://claude.com/docs/extend/overview
40. Extend Claude with skills: https://code.claude.com/docs/en/skills
41. Plugins overview: https://code.claude.com/docs/en/plugins/overview
42. Extend Claude Code: https://code.claude.com/docs/en/features-overview
43. Claude Code Overview: https://code.claude.com/docs/en/overview
44. API key best practices: https://support.claude.com/en/articles/9767949-api-key-best-practices-keep-your-keys-safe-and-secure
45. Authentication: https://platform.claude.com/docs/en/manage-claude/authentication
46. TypeScript SDK, Browser usage: https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/typescript
47. Age assurance on Claude: https://support.claude.com/en/articles/15171100-age-assurance-on-claude
48. Anthropic, Policy (User wellbeing): https://www.anthropic.com/policy

**Kinder und manipulative Gestaltung**
49. Radesky u. a. (2022), Prevalence and Characteristics of Manipulative Design in Mobile Applications Used by Children: https://deceptive.design/articles/prevalence-and-characteristics-of-manipulative-design-in-mobile-applications-used-by-children
