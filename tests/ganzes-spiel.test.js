import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { AUFTRAEGE } from '../spiel/code/inhalte/lader.js';
import {
  neuerStand, starteAuftrag, ansicht, weiter, verbucheFrei, verbucheWiederholungsErgebnis,
} from '../spiel/code/logik/ablauf.js';
import { istGemeistert } from '../spiel/code/logik/meisterschaft.js';
import { bauePrompt, baueSystemPrompt, hatZettel, zaehleTokens } from '../spiel/code/logik/prompt.js';
import { bewerte } from '../spiel/code/logik/bewertung.js';
import { erstelleKi } from '../spiel/code/ki/schnittstelle.js';

const lies = async (pfad) => JSON.parse(await readFile(new URL(`../spiel/inhalte/${pfad}`, import.meta.url), 'utf8'));
const regeln = await lies('regeln.json');
const lehrplan = await lies('lehrplan.json');
const lexikon = await lies('de/lexikon.json');
const alle = await Promise.all(AUFTRAEGE.map((id) => lies(`de/auftraege/${id}.json`)));

test('Das ganze Spiel lässt sich von Anfang bis Ende durchspielen', () => {
  let stand = neuerStand();
  for (const auftrag of alle) {
    stand = starteAuftrag(stand, auftrag, regeln, alle);
    let ereignis = 'weiter';
    let schritte = 0;
    while (ereignis !== 'auftragFertig') {
      schritte += 1;
      assert.ok(schritte < 300, `Der Ablauf in «${auftrag.id}» darf nicht hängen bleiben`);
      const sicht = ansicht(stand, auftrag);
      if (sicht.art === 'wiederholung') {
        const quelle = alle.find((x) => x.id === sicht.aufgabeVon);
        assert.ok(quelle.aufgaben[sicht.aufgabeId], 'Wiederholung nennt eine echte Aufgabe');
        stand = verbucheWiederholungsErgebnis(stand, regeln, true);
      } else if (sicht.art === 'frei' || sicht.art === 'misch') {
        ({ stand, ereignis } = verbucheFrei(stand, auftrag, regeln, { ok: true, zaehlt: true }, alle));
      } else {
        stand = weiter(stand, auftrag);
      }
    }
  }
  assert.deepEqual(stand.erledigt, AUFTRAEGE);
  // Alle 24 Kernkonzepte des Lehrplans sind gemeistert.
  for (const konzept of lehrplan.konzepte) {
    assert.ok(istGemeistert(stand.fortschritt[konzept.id], regeln), `«${konzept.id}» ist gemeistert`);
  }
  // Am Ende ist das ganze Lexikon freigeschaltet.
  assert.deepEqual([...stand.lexikon].sort(), Object.keys(lexikon).sort());
});

test('Jedes Kernkonzept hat genau eine Konzept-Runde, in der Reihenfolge des Lehrplans', () => {
  const reihenfolge = alle.flatMap((auftrag) => auftrag.runden.filter((r) => r.art === 'konzept').map((r) => r.konzept));
  assert.deepEqual(reihenfolge, lehrplan.konzepte.map((k) => k.id));
});

test('Jeder Wunsch kommt im ganzen Spiel nur einmal vor', () => {
  const wuensche = alle.flatMap((auftrag) => Object.values(auftrag.aufgaben).map((a) => a.wunsch));
  assert.equal(new Set(wuensche).size, wuensche.length);
});

test('Werkzeuge, Connectors, Skills und Rechte sind Einstellungen und stehen nicht im Prompt', () => {
  const aufgabe = alle.find((a) => a.id === 'jassclub').aufgaben['to-a'];
  assert.equal(bauePrompt(aufgabe, ['schreiben', 'fest']), `${aufgabe.grundprompt} Speichere es ganz sicher und für immer.`);
  assert.ok(zaehleTokens(aufgabe, ['schreiben']) > zaehleTokens(aufgabe, []), 'Auch Einstellungen brauchen Platz auf dem Tisch');
});

test('Der Zettel CLAUDE.md steht wie der System-Prompt in einem eigenen Feld', () => {
  const aufgabe = alle.find((a) => a.id === 'bibliothek').aufgaben['md-a'];
  assert.equal(hatZettel(aufgabe), true);
  assert.equal(baueSystemPrompt(aufgabe, ['zettel']), 'Namen und Texte auf Deutsch. Tests laufen mit npm test.');
  assert.equal(bauePrompt(aufgabe, ['zettel']), aufgabe.grundprompt);
  assert.equal(bewerte(aufgabe, ['merk']).fehlbild, 'fremd');
});

test('Die simulierte KI löst jede Aufgabe des Spiels mit der hinterlegten Lösung', async () => {
  const ki = erstelleKi('simuliert');
  for (const auftrag of alle) {
    for (const [id, aufgabe] of Object.entries(auftrag.aufgaben)) {
      const antwort = await ki.antworte({ aufgabe, auswahl: aufgabe.loesung, versuch: 0 });
      assert.equal(antwort.ok, true, `${auftrag.id} ${id}`);
      assert.ok(antwort.text.length > 0);
    }
  }
});
