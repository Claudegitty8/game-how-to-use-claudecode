# Veröffentlichen auf GitHub Pages

Stand: 11. November 2026. Entscheid E-038. Diese Anleitung ist für den Besitzer. Claude veröffentlicht nichts ohne ausdrückliches Ja.

## Bevor du veröffentlichst

1. **Testrunde** mit echten Spielern machen (`TESTBOGEN.md`).
2. **Rechtliches** klären: Darf der Name «Claude» im Spiel vorkommen? Braucht es Impressum und Datenschutzhinweis? (Roadmap 6.10)
3. Wissen, was öffentlich wird: Mit einem Gratis-Konto muss das **ganze Repository öffentlich** sein, also auch alle Dokumente und der Verlauf. Geheimnisse sind keine darin. Wer das nicht will, braucht ein bezahltes GitHub-Abo. Dann bleibt das Repository privat und nur das Spiel ist öffentlich.

## Einrichten (einmalig, etwa fünf Minuten)

1. Auf github.com das Repository öffnen, dann **Settings**.
2. Nur bei Gratis-Konto: ganz unten bei **Danger Zone** auf **Change visibility** und **Public** wählen.
3. Links **Pages** wählen. Bei **Source** die Auswahl **GitHub Actions** treffen.

## Veröffentlichen (jedes Mal, wenn eine neue Fassung online soll)

1. Im Repository den Reiter **Actions** öffnen.
2. Links **Spiel veröffentlichen** wählen, dann rechts **Run workflow**.
3. Nach etwa einer Minute steht die Adresse des Spiels beim grünen Haken. Sie hat die Form `https://<dein-name>.github.io/<repository>/`.

Vor dem Veröffentlichen laufen automatisch alle Prüfungen. Bestehen sie nicht, bleibt die alte Fassung online.

## Wieder vom Netz nehmen

**Settings**, **Pages**, **Unpublish site**. Das Repository bleibt, wie es ist.

## Was erst dort funktioniert

Auf GitHub Pages läuft das Spiel nach dem ersten Laden auch ohne Internet, und man kann es auf den Startbildschirm legen. In der privaten Vorschau geht beides nicht.
