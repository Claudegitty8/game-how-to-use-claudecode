import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { erstelleKi } from '../spiel/code/ki/schnittstelle.js';
import { erstelleSpeicher } from '../spiel/code/speicher/speicher.js';
import { neuerStand } from '../spiel/code/logik/ablauf.js';
import { pruefeInhalte, pruefeAufgabe } from '../werkzeuge/pruefe-inhalte.mjs';

const auftrag = JSON.parse(await readFile(new URL('../spiel/inhalte/de/auftraege/baeckerei.json', import.meta.url), 'utf8'));
const { aufgaben } = auftrag;
const turnverein = JSON.parse(await readFile(new URL('../spiel/inhalte/de/auftraege/turnverein.json', import.meta.url), 'utf8'));
const alleAufgaben = { ...aufgaben, ...turnverein.aufgaben };

test('Simulierte KI macht Quatsch passend zur Lücke und erklärt ihn', async () => {
  const ki = erstelleKi('simuliert');
  const leer = await ki.antworte({ aufgabe: aufgaben['p-a'], auswahl: [] });
  assert.equal(leer.ok, false);
  assert.equal(leer.fehlbild, 'keinZiel');
  assert.ok(aufgaben['p-a'].fehlbilder.keinZiel.texte.includes(leer.text));
  assert.equal(leer.hinweis, aufgaben['p-a'].fehlbilder.keinZiel.hinweis);

  const vage = await ki.antworte({ aufgabe: aufgaben['p-a'], auswahl: ['ziel', 'form', 'vage1'] });
  assert.equal(vage.fehlbild, 'vage');
});

test('Simulierte KI bringt beim zweiten Versuch einen anderen Witz', async () => {
  const ki = erstelleKi('simuliert');
  const erster = await ki.antworte({ aufgabe: aufgaben['p-a'], auswahl: [], versuch: 0 });
  const zweiter = await ki.antworte({ aufgabe: aufgaben['p-a'], auswahl: [], versuch: 1 });
  assert.notEqual(erster.text, zweiter.text);
});

test('Mit nur einem Beispiel kopiert die simulierte KI genau dieses Beispiel', async () => {
  const antwort = await erstelleKi('simuliert').antworte({ aufgabe: aufgaben['b-a'], auswahl: ['b2'] });
  assert.equal(antwort.fehlbild, 'eins');
  assert.ok(antwort.text.includes('Brot in Not'));
  assert.equal(antwort.text.includes('{teil}'), false);
});

test('Jede Aufgabe liefert mit ihrer Lösung ein gutes Ergebnis', async () => {
  const ki = erstelleKi('simuliert');
  for (const [id, aufgabe] of Object.entries(alleAufgaben)) {
    const antwort = await ki.antworte({ aufgabe, auswahl: aufgabe.loesung });
    assert.equal(antwort.ok, true, `Aufgabe ${id}`);
    assert.equal(antwort.hinweis, null);
    assert.ok(antwort.tokens.eingabe > 0 && antwort.tokens.ausgabe > 0);
  }
});

test('Unbekannter KI-Modus wird klar abgelehnt', () => {
  assert.throws(() => erstelleKi('echt'), /gibt es noch nicht/);
});

test('Speicher funktioniert auch ohne Gerätespeicher', () => {
  const speicher = erstelleSpeicher(null);
  assert.deepEqual(speicher.laden(), neuerStand());
  assert.equal(speicher.speichern({ ...neuerStand(), rundenZaehler: 2 }), false);
  assert.equal(speicher.laden().rundenZaehler, 2);
  assert.deepEqual(speicher.loeschen(), neuerStand());
  assert.deepEqual(speicher.laden(), neuerStand());
});

test('Speicher übersteht kaputte Daten und verwirft alte Stände', () => {
  assert.deepEqual(erstelleSpeicher({ getItem: () => '{kaputt', setItem: () => {} }).laden(), neuerStand());
  assert.deepEqual(erstelleSpeicher({ getItem: () => '{"version":1,"besuche":3}', setItem: () => {} }).laden(), neuerStand());
});

test('Die Lerninhalte im Repository sind vollständig', async () => {
  assert.deepEqual(await pruefeInhalte(), []);
});

test('Die Inhaltsprüfung findet typische Fehler in einer Aufgabe', () => {
  const fehler = [];
  pruefeAufgabe({
    wunsch: 'w',
    grundprompt: 'x',
    erfolg: ['y'],
    teile: [{ id: 'ziel', art: 'prompt', text: 't' }],
    pruefungen: [{ wenn: { fehlt: ['ziel'] }, fehlbild: 'keinZiel' }],
    fehlbilder: { keinZiel: { texte: ['nur einer'] } },
    loesung: [],
  }, 'probe', fehler);
  // Zu wenige Varianten, kein Hinweis, Lösung besteht nicht.
  assert.equal(fehler.length, 3);
});
