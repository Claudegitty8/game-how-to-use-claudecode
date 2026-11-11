import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  neuerFortschritt, verbucheVersuch, erfolge, istGemeistert,
  darfStarten, naechsterAbstand, verbucheWiederholung,
} from '../spiel/code/logik/meisterschaft.js';
import { bewerte, hilfeTeil } from '../spiel/code/logik/bewertung.js';
import { bauePrompt, baueSystemPrompt } from '../spiel/code/logik/prompt.js';

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

const aufgabe = {
  grundprompt: 'Erfinde Namen.',
  teile: [
    { id: 'ziel', art: 'prompt', text: 'Für ein Spiel.' },
    { id: 'vage', art: 'prompt', text: 'Mach es cool.' },
    { id: 'b1', art: 'beispiel', text: '«Eins»' },
    { id: 'b2', art: 'beispiel', text: '«Zwei»' },
  ],
  pruefungen: [
    { wenn: { gewaehlt: ['vage'] }, fehlbild: 'vage' },
    { wenn: { fehlt: ['ziel'] }, fehlbild: 'keinZiel' },
    { wenn: { aus: ['b1', 'b2'], hoechstens: 0 }, fehlbild: 'keins' },
    { wenn: { aus: ['b1', 'b2'], hoechstens: 1 }, fehlbild: 'eins' },
  ],
  loesung: ['ziel', 'b1', 'b2'],
};

test('Bewertung: Die erste zutreffende Prüfung bestimmt das Fehlbild', () => {
  assert.equal(bewerte(aufgabe, []).fehlbild, 'keinZiel');
  assert.equal(bewerte(aufgabe, ['vage']).fehlbild, 'vage');
  assert.equal(bewerte(aufgabe, ['ziel']).fehlbild, 'keins');
  assert.equal(bewerte(aufgabe, ['ziel', 'b2']).fehlbild, 'eins');
  assert.equal(bewerte(aufgabe, ['ziel', 'b1', 'b2']).ok, true);
});

test('Hilfe zeigt zuerst auf ein schädliches Teil, sonst auf ein fehlendes', () => {
  assert.deepEqual(hilfeTeil(aufgabe, ['vage', 'ziel']), { id: 'vage', grund: 'zuviel' });
  assert.deepEqual(hilfeTeil(aufgabe, ['ziel', 'b2']), { id: 'b1', grund: 'fehlt' });
  assert.equal(hilfeTeil(aufgabe, ['ziel', 'b1', 'b2']), null);
});

test('Der Prompt wird in fester Reihenfolge zusammengesetzt', () => {
  assert.equal(bauePrompt(aufgabe, ['b2', 'ziel', 'b1'], 'Beispiele:'), 'Erfinde Namen. Für ein Spiel. Beispiele: «Eins», «Zwei»');
  assert.equal(bauePrompt(aufgabe, []), 'Erfinde Namen.');
});

test('Rolle und Dauerregeln stehen im System-Prompt, nicht im Prompt', () => {
  const mitRolle = {
    grundprompt: 'Wann ist Training?',
    teile: [
      { id: 'rolle', art: 'rolle', text: 'Du bist Turni.' },
      { id: 'regel', art: 'rolle', text: 'Antworte kurz.' },
      { id: 'wer', art: 'kontext', text: 'Es fragt ein Kind.' },
    ],
  };
  assert.equal(baueSystemPrompt(mitRolle, ['regel', 'rolle', 'wer']), 'Du bist Turni. Antworte kurz.');
  assert.equal(bauePrompt(mitRolle, ['regel', 'rolle', 'wer']), 'Wann ist Training? Es fragt ein Kind.');
  assert.equal(baueSystemPrompt(mitRolle, []), '');
});
