import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  neuerFortschritt, verbucheVersuch, erfolge, istGemeistert,
  darfStarten, naechsterAbstand, verbucheWiederholung,
} from '../spiel/code/logik/meisterschaft.js';
import { bewerte } from '../spiel/code/logik/bewertung.js';

const regeln = { erfolgeFuerMeisterschaft: 3, wiederholungsAbstaende: [1, 3, 7] };

function loese(fortschritt, ...situationen) {
  return situationen.reduce((f, situation) => verbucheVersuch(f, { situation, richtig: true }), fortschritt);
}

test('Meisterschaft braucht drei Erfolge in verschiedenen Situationen', () => {
  let f = loese(neuerFortschritt(), 'a', 'b');
  assert.equal(istGemeistert(f, regeln), false);
  f = loese(f, 'c');
  assert.equal(istGemeistert(f, regeln), true);
});

test('Dieselbe Situation zählt nur einmal', () => {
  const f = loese(neuerFortschritt(), 'a', 'a', 'a');
  assert.equal(erfolge(f), 1);
});

test('Falsche Lösungen und Lösungen mit Hilfe zählen nicht, kosten aber nichts', () => {
  let f = loese(neuerFortschritt(), 'a');
  f = verbucheVersuch(f, { situation: 'b', richtig: false });
  f = verbucheVersuch(f, { situation: 'c', richtig: true, mitHilfe: true });
  assert.equal(erfolge(f), 1);
});

test('Ein Konzept startet erst, wenn seine Voraussetzungen gemeistert sind', () => {
  const kontext = { id: 'kontext', braucht: ['prompt'] };
  assert.equal(darfStarten(kontext, {}, regeln), false);
  assert.equal(darfStarten(kontext, { prompt: loese(neuerFortschritt(), 'a', 'b') }, regeln), false);
  assert.equal(darfStarten(kontext, { prompt: loese(neuerFortschritt(), 'a', 'b', 'c') }, regeln), true);
});

test('Wiederholungen kommen in wachsenden Abständen und bei Misserfolg früher', () => {
  let f = neuerFortschritt();
  assert.equal(naechsterAbstand(f, regeln), 1);
  f = verbucheWiederholung(f, true);
  assert.equal(naechsterAbstand(f, regeln), 3);
  f = verbucheWiederholung(f, true);
  assert.equal(naechsterAbstand(f, regeln), 7);
  f = verbucheWiederholung(f, false);
  assert.equal(naechsterAbstand(f, regeln), 3);
  f = verbucheWiederholung(verbucheWiederholung(f, true), true);
  assert.equal(naechsterAbstand(f, regeln), null);
});

test('Bewertung nennt die wichtigste fehlende Zutat', () => {
  const aufgabe = { zutaten: [{ id: 'ziel' }, { id: 'zielgruppe' }, { id: 'extra', noetig: false }] };
  assert.deepEqual(bewerte(aufgabe, []), { ok: false, fehlend: ['ziel', 'zielgruppe'], wichtigsteLuecke: 'ziel' });
  assert.equal(bewerte(aufgabe, ['ziel']).wichtigsteLuecke, 'zielgruppe');
  assert.equal(bewerte(aufgabe, ['ziel', 'zielgruppe']).ok, true);
});
