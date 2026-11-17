// Tests für die bebilderten, interaktiven Übungen und die Abkürzungen (Version 0.18).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { bewerte, hilfeTeil } from '../spiel/code/logik/bewertung.js';
import { findeAbkuerzungen, merkeAbkuerzungen } from '../spiel/code/logik/abkuerzungen.js';
import { neuerStand } from '../spiel/code/logik/ablauf.js';
import { wandleUm } from '../spiel/code/logik/extras.js';
import { erstelleKi } from '../spiel/code/ki/schnittstelle.js';
import { pruefeAufgabe } from '../werkzeuge/pruefe-inhalte.mjs';

const lies = async (pfad) => JSON.parse(await readFile(new URL(`../spiel/inhalte/${pfad}`, import.meta.url), 'utf8'));
const verbinden = (await lies('de/auftraege/blumenladen.json')).aufgaben['co-v'];
const schleife = (await lies('de/auftraege/jassclub.json')).aufgaben['ag-s'];
const suchbild = (await lies('de/auftraege/gemeinde.json')).aufgaben['pi-s'];
const gipfeli = (await lies('de/auftraege/baeckerei.json')).aufgaben['p-a'];
const abk = await lies('de/abkuerzungen.json');
const ki = erstelleKi('simuliert');

test('Verbinden: nur richtig, wenn jedes Teil am richtigen Ort steckt', () => {
  assert.equal(bewerte(verbinden, verbinden.loesung).ok, true);
  assert.equal(bewerte(verbinden, []).ok, false);
  const falsch = verbinden.loesung.map((paar) => (paar.startsWith('bank=') ? 'bank=lesen' : paar));
  const urteil = bewerte(verbinden, falsch);
  assert.equal(urteil.ok, false);
  assert.equal(urteil.fehlbild, 'bank');
  assert.deepEqual(hilfeTeil(verbinden, falsch), { id: 'bank', grund: 'zuordnung' });
});

test('Verbinden: Kiwi zeigt die Folge passend zum Ort, an dem das Teil steckt', async () => {
  const falsch = verbinden.loesung.map((paar) => (paar.startsWith('bank=') ? 'bank=entwurf' : paar));
  const antwort = await ki.antworte({ aufgabe: verbinden, auswahl: falsch });
  const bank = verbinden.teile.find((teil) => teil.id === 'bank');
  assert.equal(antwort.text, bank.folgen.entwurf);
  assert.equal(antwort.hinweis, bank.hinweis);
  const offen = await ki.antworte({ aufgabe: verbinden, auswahl: [] });
  assert.equal(offen.text, verbinden.teile[0].folgen.offen);
});

test('Schleife: Kiwi stolpert an der ersten falschen Station', async () => {
  assert.equal(bewerte(schleife, schleife.loesung).ok, true);
  const zweiteFalsch = ['schauen=datei', 'handeln=alles', 'pruefen=gefuehl'];
  const antwort = await ki.antworte({ aufgabe: schleife, auswahl: zweiteFalsch });
  assert.equal(antwort.ok, false);
  assert.equal(antwort.station, 'handeln');
  assert.equal(antwort.text, schleife.stationen[1].optionen.find((o) => o.id === 'alles').folge);
  assert.deepEqual(hilfeTeil(schleife, zweiteFalsch), { id: 'handeln', grund: 'station' });
  const leer = await ki.antworte({ aufgabe: schleife, auswahl: [] });
  assert.equal(leer.text, schleife.stationen[0].leer);
});

test('Stelle antippen: ein Bild mit Bereichen, nur die versteckte Anweisung ist richtig', () => {
  assert.equal(bewerte(suchbild, ['versteckt']).ok, true);
  assert.equal(bewerte(suchbild, ['tipp']).ok, false);
  const fehler = [];
  pruefeAufgabe({ ...suchbild, bild: { ...suchbild.bild, zeilen: [{ option: 'gibtsnicht' }] } }, 'test', fehler);
  assert.ok(fehler.some((f) => f.includes('unbekannten Bereich')));
});

test('Ergebnis als Bild: Das Bild passt zur gezeigten Variante, beim Erfolg kommt das Erfolgsbild', async () => {
  const erster = await ki.antworte({ aufgabe: gipfeli, auswahl: [], versuch: 0 });
  const zweiter = await ki.antworte({ aufgabe: gipfeli, auswahl: [], versuch: 1 });
  assert.equal(erster.bild, gipfeli.fehlbilder.keinZiel.bilder[0]);
  assert.equal(zweiter.bild, gipfeli.fehlbilder.keinZiel.bilder[1]);
  const gut = await ki.antworte({ aufgabe: gipfeli, auswahl: gipfeli.loesung });
  assert.equal(gut.bild, gipfeli.erfolgBild);
});

test('Prüfung: Verbinden ohne Folge für einen falschen Ort und Schleife mit falscher Lösung werden gemeldet', () => {
  const fehler = [];
  const ohneFolge = structuredClone(verbinden);
  delete ohneFolge.teile[0].folgen.nein;
  pruefeAufgabe(ohneFolge, 'test', fehler);
  assert.ok(fehler.some((f) => f.includes('Folge für «nein»')));
  const falscheLoesung = { ...schleife, loesung: ['schauen=farben'] };
  pruefeAufgabe(falscheLoesung, 'test', fehler);
  assert.ok(fehler.some((f) => f.includes('Lösung besteht nicht')));
});

test('Abkürzungen: werden gefunden, Hervorhebungen und lange Wörter nicht', () => {
  const funde = findeAbkuerzungen('Die KI ruft zwei APIs auf. Lies CLAUDE.md. Das ist NICHT gut. SCHLÜSSEL_HIER. Und XYZ.', abk);
  assert.deepEqual(funde.map((f) => [f.wort, f.schluessel]), [['KI', 'KI'], ['APIs', 'API'], ['CLAUDE.md', 'CLAUDE.md'], ['XYZ', null]]);
});

test('Abkürzungen: Die Langform kommt nur beim ersten Mal, der Stand merkt es sich auch über Updates', () => {
  let stand = merkeAbkuerzungen(neuerStand(), ['KI', 'API']);
  assert.deepEqual(stand.abkuerzungen, ['KI', 'API']);
  assert.equal(merkeAbkuerzungen(stand, ['KI']), stand);
  stand = merkeAbkuerzungen(stand, ['MCP', 'KI']);
  assert.deepEqual(stand.abkuerzungen, ['KI', 'API', 'MCP']);
  assert.deepEqual(wandleUm(JSON.parse(JSON.stringify(stand))).abkuerzungen, ['KI', 'API', 'MCP']);
});
