import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { AUFTRAEGE } from '../spiel/code/inhalte/lader.js';
import { neuerStand, starteAuftrag, ansicht, verbucheFrei } from '../spiel/code/logik/ablauf.js';
import { istGemeistert } from '../spiel/code/logik/meisterschaft.js';
import {
  schnelltestAufgaben, verbucheSchnelltest, guthaben, kaufe, verbucheUmfrage, verbucheDaumen, istSpielstand,
} from '../spiel/code/logik/extras.js';

const lies = async (pfad) => JSON.parse(await readFile(new URL(`../spiel/inhalte/${pfad}`, import.meta.url), 'utf8'));
const regeln = await lies('regeln.json');
const alle = await Promise.all(AUFTRAEGE.map((id) => lies(`de/auftraege/${id}.json`)));
const baeckerei = alle[0];
const katalog = (await lies('einrichtung.json')).dinge;
const fragen = (await lies('de/umfrage.json')).fragen;

const alleRichtig = (auftrag) => schnelltestAufgaben(auftrag, regeln).map((e) => ({ ...e, richtig: true }));

test('Schnelltest: drei Aufgaben pro Konzept', () => {
  const reihe = schnelltestAufgaben(baeckerei, regeln);
  assert.equal(reihe.length, 9);
  assert.deepEqual([...new Set(reihe.map((e) => e.konzept))], ['prompt', 'kontext', 'beispiele']);
});

test('Schnelltest bestanden: Konzepte sind gemeistert, die Einführung wird übersprungen, das Lexikon gefüllt', () => {
  const { stand, bestanden } = verbucheSchnelltest(neuerStand(), baeckerei, regeln, alleRichtig(baeckerei));
  assert.deepEqual(bestanden, ['prompt', 'kontext', 'beispiele']);
  assert.ok(['prompt', 'kontext', 'beispiele'].every((id) => stand.lexikon.includes(id)));
  const gestartet = starteAuftrag(stand, baeckerei, regeln, alle);
  // Direkt in der Mischrunde: Die bleibt immer.
  assert.equal(ansicht(gestartet, baeckerei).art, 'misch');
  let aktuell = gestartet;
  let ereignis = 'weiter';
  while (ereignis !== 'auftragFertig') ({ stand: aktuell, ereignis } = verbucheFrei(aktuell, baeckerei, regeln, { ok: true, zaehlt: true }, alle));
  assert.deepEqual(aktuell.erledigt, ['baeckerei']);
});

test('Schnelltest teilweise bestanden: Nur das eine Konzept wird übersprungen, Scheitern kostet nichts', () => {
  const ergebnisse = alleRichtig(baeckerei).map((e) => (e.konzept === 'kontext' ? { ...e, richtig: false } : e));
  const { stand, bestanden } = verbucheSchnelltest(neuerStand(), baeckerei, regeln, ergebnisse);
  assert.deepEqual(bestanden, ['prompt', 'beispiele']);
  assert.equal(stand.fortschritt.kontext, undefined);
  const gestartet = starteAuftrag(stand, baeckerei, regeln, alle);
  assert.equal(ansicht(gestartet, baeckerei).konzept, 'kontext');
  assert.equal(ansicht(gestartet, baeckerei).art, 'probieren');
});

test('Das ganze Spiel lässt sich auch nur mit Schnelltests und Mischrunden durchspielen', () => {
  let stand = neuerStand();
  for (const auftrag of alle) {
    ({ stand } = verbucheSchnelltest(stand, auftrag, regeln, alleRichtig(auftrag)));
    stand = starteAuftrag(stand, auftrag, regeln, alle);
    let ereignis = 'weiter';
    let schritte = 0;
    while (ereignis !== 'auftragFertig') {
      schritte += 1;
      assert.ok(schritte < 50);
      const sicht = ansicht(stand, auftrag);
      if (sicht.art === 'wiederholung') stand = { ...stand, lauf: { ...stand.lauf, wiederholung: null } };
      else {
        assert.equal(sicht.art, 'misch', `${auftrag.id}: nur Mischrunden bleiben`);
        ({ stand, ereignis } = verbucheFrei(stand, auftrag, regeln, { ok: true, zaehlt: true }, alle));
      }
    }
  }
  assert.deepEqual(stand.erledigt, AUFTRAEGE);
  assert.ok(Object.values(stand.fortschritt).every((f) => istGemeistert(f, regeln)));
});

test('Einrichtung: Man kann nur ausgeben, was gespart ist, und jedes Ding nur einmal kaufen', () => {
  const arm = neuerStand();
  assert.equal(guthaben(arm, katalog), 0);
  assert.equal(kaufe(arm, 'pflanze', katalog), arm);
  const reich = { ...neuerStand(), gespart: { dorfzeitung: 3000, jassclub: 1000 } };
  assert.equal(guthaben(reich, katalog), 4000);
  const mitPflanze = kaufe(reich, 'pflanze', katalog);
  assert.deepEqual(mitPflanze.einrichtung, ['pflanze']);
  assert.equal(guthaben(mitPflanze, katalog), 2500);
  assert.equal(kaufe(mitPflanze, 'pflanze', katalog), mitPflanze);
  assert.equal(kaufe(mitPflanze, 'discokugel', katalog), mitPflanze);
  assert.equal(kaufe(mitPflanze, 'gibtesnicht', katalog), mitPflanze);
});

test('Freiwillige Fragen: Festgehalten wird nur die Anzahl richtiger Antworten', () => {
  const richtig = Object.fromEntries(fragen.map((f) => [f.id, f.optionen.find((o) => o.richtig).id]));
  let stand = verbucheUmfrage(neuerStand(), 'vorher', { [fragen[0].id]: 'weissnicht' }, fragen);
  assert.deepEqual(stand.umfrage.vorher, { richtig: 0, von: fragen.length });
  stand = verbucheUmfrage(stand, 'nachher', richtig, fragen);
  assert.deepEqual(stand.umfrage, { vorher: { richtig: 0, von: 6 }, nachher: { richtig: 6, von: 6 } });
});

test('Daumen und Prüfung eines Spielstands aus einer Datei', () => {
  const stand = verbucheDaumen(verbucheDaumen(neuerStand(), 'baeckerei', true), 'turnverein', false);
  assert.deepEqual(stand.daumen, { baeckerei: 'hoch', turnverein: 'runter' });
  assert.equal(istSpielstand(JSON.parse(JSON.stringify(stand))), true);
  assert.equal(istSpielstand(null), false);
  assert.equal(istSpielstand({ version: 1 }), false);
  assert.equal(istSpielstand({ ...stand, erledigt: 'alles' }), false);
  assert.equal(istSpielstand({ ...stand, version: 99 }), false);
});

// --- Übungsform «Sortieren» ---
const { bewerte, hilfeTeil } = await import('../spiel/code/logik/bewertung.js');
const { erstelleKi } = await import('../spiel/code/ki/schnittstelle.js');
const sortieren = alle.find((a) => a.id === 'jassclub').aufgaben['ag-g'];

test('Sortieren: Nur die genaue Reihenfolge ist richtig, die Hilfe zeigt den ersten falschen Platz', () => {
  assert.equal(bewerte(sortieren, sortieren.loesung).ok, true);
  assert.equal(bewerte(sortieren, sortieren.schritte.map((s) => s.id)).ok, false);
  assert.equal(bewerte(sortieren, sortieren.loesung.slice(0, 2)).ok, false);
  assert.deepEqual(hilfeTeil(sortieren, ['schauen', 'pruefen', 'handeln']), { id: 'handeln', grund: 'platz' });
  assert.equal(hilfeTeil(sortieren, sortieren.loesung), null);
});

test('Sortieren: Die simulierte KI zeigt, was bei falscher Reihenfolge passiert', async () => {
  const ki = erstelleKi('simuliert');
  const falsch = await ki.antworte({ aufgabe: sortieren, auswahl: ['pruefen', 'handeln', 'schauen'], versuch: 0 });
  assert.equal(falsch.ok, false);
  assert.equal(falsch.text, sortieren.daneben.texte[0]);
  assert.equal(falsch.hinweis, sortieren.daneben.hinweis);
  const zweiter = await ki.antworte({ aufgabe: sortieren, auswahl: ['pruefen', 'handeln', 'schauen'], versuch: 1 });
  assert.notEqual(zweiter.text, falsch.text);
  const richtig = await ki.antworte({ aufgabe: sortieren, auswahl: sortieren.loesung });
  assert.equal(richtig.ok, true);
  assert.equal(richtig.text, sortieren.kiwi);
});
