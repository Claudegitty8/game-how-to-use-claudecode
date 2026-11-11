import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { erstelleKi } from '../spiel/code/ki/schnittstelle.js';
import { erstelleSpeicher, leererStand } from '../spiel/code/speicher/speicher.js';
import { pruefeInhalte, pruefeAufgabe } from '../werkzeuge/pruefe-inhalte.mjs';

const demo = JSON.parse(await readFile(new URL('../spiel/inhalte/de/demo.json', import.meta.url), 'utf8'));

test('Simulierte KI macht Quatsch passend zur fehlenden Zutat', async () => {
  const ki = erstelleKi('simuliert');
  const ohneAlles = await ki.antworte({ aufgabe: demo, auswahl: [] });
  assert.equal(ohneAlles.ok, false);
  assert.equal(ohneAlles.luecke, 'ziel');
  assert.ok(demo.fehlbilder.ziel.includes(ohneAlles.text));

  const ohneZielgruppe = await ki.antworte({ aufgabe: demo, auswahl: ['ziel'] });
  assert.equal(ohneZielgruppe.luecke, 'zielgruppe');
});

test('Simulierte KI bringt beim zweiten Versuch einen anderen Witz', async () => {
  const ki = erstelleKi('simuliert');
  const erster = await ki.antworte({ aufgabe: demo, auswahl: [], versuch: 0 });
  const zweiter = await ki.antworte({ aufgabe: demo, auswahl: [], versuch: 1 });
  assert.notEqual(erster.text, zweiter.text);
});

test('Simulierte KI liefert bei vollständigem Prompt ein gutes Ergebnis', async () => {
  const antwort = await erstelleKi('simuliert').antworte({ aufgabe: demo, auswahl: ['ziel', 'zielgruppe'] });
  assert.equal(antwort.ok, true);
  assert.ok(antwort.tokens.eingabe > 0 && antwort.tokens.ausgabe > 0);
});

test('Unbekannter KI-Modus wird klar abgelehnt', () => {
  assert.throws(() => erstelleKi('echt'), /gibt es noch nicht/);
});

test('Speicher funktioniert auch ohne Gerätespeicher', () => {
  const speicher = erstelleSpeicher(null);
  assert.deepEqual(speicher.laden(), leererStand());
  assert.equal(speicher.speichern({ ...leererStand(), besuche: 2 }), false);
  assert.equal(speicher.laden().besuche, 2);
});

test('Speicher übersteht kaputte Daten', () => {
  const lager = { getItem: () => '{kaputt', setItem: () => {} };
  assert.deepEqual(erstelleSpeicher(lager).laden(), leererStand());
});

test('Die Lerninhalte im Repository sind vollständig', async () => {
  assert.deepEqual(await pruefeInhalte(), []);
});

test('Die Inhaltsprüfung findet fehlende Fehlbilder', () => {
  const fehler = [];
  pruefeAufgabe({ grundprompt: 'x', erfolg: ['y'], zutaten: [{ id: 'ziel', name: 'n', text: 't' }], fehlbilder: {}, hinweise: {} }, 'probe', fehler);
  assert.equal(fehler.length, 2);
});
