// Tests für Hinweis und Ausweg, wenn freie Situationen immer wieder nicht zählen (E-047).
// Fehler aus Version 0.15: Wer nie ohne Hilfe löste, blieb für immer in derselben Runde.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { AUFTRAEGE } from '../spiel/code/inhalte/lader.js';
import {
  neuerStand, starteAuftrag, ansicht, weiter, verbucheFrei, verbucheWiederholungsErgebnis,
  auswegOffen, ueberspringeRunde,
} from '../spiel/code/logik/ablauf.js';
import { istGemeistert, erfolge } from '../spiel/code/logik/meisterschaft.js';
import { wandleUm, pruefeLauf, springeZuAuftrag } from '../spiel/code/logik/extras.js';

const lies = async (pfad) => JSON.parse(await readFile(new URL(`../spiel/inhalte/${pfad}`, import.meta.url), 'utf8'));
const regeln = await lies('regeln.json');
const alle = await Promise.all(AUFTRAEGE.map((id) => lies(`de/auftraege/${id}.json`)));
const baeckerei = alle[0];
const NICHT_GEZAEHLT = { ok: true, zaehlt: false };

// Bis zur ersten freien Situation von Runde 1.
function bisFrei(auftrag = baeckerei) {
  let stand = starteAuftrag(neuerStand(), auftrag, regeln, alle);
  while (ansicht(stand, auftrag).art !== 'frei') stand = weiter(stand, auftrag);
  return stand;
}

// Löst so viele freie Situationen nacheinander, ohne dass sie zählen.
function ohneZaehlen(stand, anzahl, auftrag = baeckerei) {
  for (let i = 0; i < anzahl; i += 1) ({ stand } = verbucheFrei(stand, auftrag, regeln, NICHT_GEZAEHLT, alle));
  return stand;
}

test('Ausweg: Eine Situation, die nicht gezählt hat, ist beim Wiederkommen als «schon gesehen» markiert', () => {
  let stand = bisFrei();
  assert.equal(ansicht(stand, baeckerei).schonGesehen, false);
  const erste = ansicht(stand, baeckerei).aufgabeId;
  stand = ohneZaehlen(stand, baeckerei.runden[0].frei.length);
  const sicht = ansicht(stand, baeckerei);
  assert.equal(sicht.aufgabeId, erste);
  assert.equal(sicht.schonGesehen, true);
  // Zählt sie diesmal, ist die Markierung weg und der Zähler zurück auf null.
  ({ stand } = verbucheFrei(stand, baeckerei, regeln, { ok: true, zaehlt: true }, alle));
  assert.ok(!stand.lauf.nochmal.includes(erste));
  assert.equal(stand.lauf.ohneFortschritt, 0);
});

test('Ausweg: erst nach zwei Durchgängen ohne Fortschritt, nicht vorher', () => {
  const runde = baeckerei.runden[0];
  const grenze = regeln.durchgaengeBisAusweg * runde.frei.length;
  let stand = bisFrei();
  assert.equal(auswegOffen(stand, baeckerei, regeln), false);
  stand = ohneZaehlen(stand, grenze - 1);
  assert.equal(auswegOffen(stand, baeckerei, regeln), false);
  // Ohne offenen Ausweg ändert «weitergehen» nichts.
  assert.equal(ueberspringeRunde(stand, baeckerei, regeln, alle).stand, stand);
  stand = ohneZaehlen(stand, 1);
  assert.equal(auswegOffen(stand, baeckerei, regeln), true);
});

test('Ausweg: Ein gezählter Erfolg setzt den Zähler zurück', () => {
  const grenze = regeln.durchgaengeBisAusweg * baeckerei.runden[0].frei.length;
  let stand = ohneZaehlen(bisFrei(), grenze - 1);
  ({ stand } = verbucheFrei(stand, baeckerei, regeln, { ok: true, zaehlt: true }, alle));
  stand = ohneZaehlen(stand, grenze - 1);
  assert.equal(auswegOffen(stand, baeckerei, regeln), false);
});

test('Ausweg: Weitergehen führt zur nächsten Runde, das Konzept wird nachgeholt', () => {
  const grenze = regeln.durchgaengeBisAusweg * baeckerei.runden[0].frei.length;
  const vorher = ohneZaehlen(bisFrei(), grenze);
  const { stand, ereignis } = ueberspringeRunde(vorher, baeckerei, regeln, alle);
  assert.equal(ereignis, 'rundeVerschoben');
  assert.equal(stand.lauf.runde, 1);
  assert.equal(stand.lauf.ohneFortschritt, undefined);
  assert.equal(stand.rundenZaehler, vorher.rundenZaehler + 1);
  const prompt = stand.fortschritt.prompt;
  assert.equal(prompt.nachholen, true);
  assert.equal(istGemeistert(prompt, regeln), false);
  assert.ok(stand.lexikon.includes('prompt'), 'Der Lexikon-Eintrag bleibt');
});

test('Ausweg: Das nachgeholte Konzept kommt als Wiederholung, bis es gemeistert ist', () => {
  const grenze = regeln.durchgaengeBisAusweg * baeckerei.runden[0].frei.length;
  let { stand } = ueberspringeRunde(ohneZaehlen(bisFrei(), grenze), baeckerei, regeln, alle);
  let ereignis = 'weiter';
  const wiederholt = [];
  let schritte = 0;
  while (ereignis !== 'auftragFertig') {
    schritte += 1;
    assert.ok(schritte < 200, 'Der Auftrag darf nicht hängen bleiben');
    const sicht = ansicht(stand, baeckerei);
    if (sicht.art === 'wiederholung') {
      wiederholt.push(sicht.konzept);
      stand = verbucheWiederholungsErgebnis(stand, regeln, true);
    } else if (sicht.art === 'frei' || sicht.art === 'misch') {
      ({ stand, ereignis } = verbucheFrei(stand, baeckerei, regeln, { ok: true, zaehlt: true }, alle));
    } else stand = weiter(stand, baeckerei);
  }
  assert.ok(wiederholt.includes('prompt'), 'Prompt kommt als Wiederholung');
  // Bis der Auftrag fertig ist, hat Prompt mindestens eine richtige Wiederholung bekommen.
  assert.ok(erfolge(stand.fortschritt.prompt) >= 1);
});

test('Ausweg: Richtige Wiederholungen zählen, bis das Konzept gemeistert ist', () => {
  const grenze = regeln.durchgaengeBisAusweg * baeckerei.runden[0].frei.length;
  let { stand } = ueberspringeRunde(ohneZaehlen(bisFrei(), grenze), baeckerei, regeln, alle);
  const frei = baeckerei.runden[0].frei;
  for (let i = 0; i < regeln.erfolgeFuerMeisterschaft; i += 1) {
    const vorher = stand.fortschritt.prompt;
    assert.equal(vorher.nachholen, true);
    stand = { ...stand, lauf: { ...stand.lauf, wiederholung: { konzept: 'prompt', aufgabe: frei[i], auftrag: 'baeckerei' } } };
    stand = verbucheWiederholungsErgebnis(stand, regeln, true);
    assert.equal(stand.lauf.wiederholung, null);
    // Kommt nach der nächsten Runde wieder.
    assert.equal(stand.fortschritt.prompt.faelligBei, stand.rundenZaehler + regeln.wiederholungsAbstaende[0]);
  }
  const prompt = stand.fortschritt.prompt;
  assert.ok(istGemeistert(prompt, regeln));
  assert.equal(prompt.nachholen, undefined, 'Gemeistert: nichts mehr nachzuholen');
  assert.equal(prompt.wiederholungsStufe, 0, 'Ab jetzt gilt der normale Wiederholungsplan');
});

test('Ausweg: Eine falsche Wiederholung zählt nicht, kostet aber nichts', () => {
  const grenze = regeln.durchgaengeBisAusweg * baeckerei.runden[0].frei.length;
  let { stand } = ueberspringeRunde(ohneZaehlen(bisFrei(), grenze), baeckerei, regeln, alle);
  const vorher = erfolge(stand.fortschritt.prompt);
  stand = { ...stand, lauf: { ...stand.lauf, wiederholung: { konzept: 'prompt', aufgabe: 'p-c', auftrag: 'baeckerei' } } };
  stand = verbucheWiederholungsErgebnis(stand, regeln, false);
  assert.equal(erfolge(stand.fortschritt.prompt), vorher);
  assert.equal(stand.fortschritt.prompt.nachholen, true);
});

test('Ausweg: Niemand bleibt hängen, auch wer nie ohne Hilfe löst', () => {
  let stand = neuerStand();
  for (const auftrag of alle) {
    stand = starteAuftrag(stand, auftrag, regeln, alle);
    let ereignis = 'weiter';
    let schritte = 0;
    while (ereignis !== 'auftragFertig') {
      schritte += 1;
      assert.ok(schritte < 400, `«${auftrag.id}» darf nicht hängen bleiben`);
      const sicht = ansicht(stand, auftrag);
      if (sicht.art === 'wiederholung') stand = verbucheWiederholungsErgebnis(stand, regeln, false);
      else if (sicht.art === 'frei') {
        ({ stand, ereignis } = auswegOffen(stand, auftrag, regeln)
          ? ueberspringeRunde(stand, auftrag, regeln, alle)
          : verbucheFrei(stand, auftrag, regeln, NICHT_GEZAEHLT, alle));
      } else if (sicht.art === 'misch') ({ stand, ereignis } = verbucheFrei(stand, auftrag, regeln, NICHT_GEZAEHLT, alle));
      else stand = weiter(stand, auftrag);
    }
  }
  assert.deepEqual(stand.erledigt, AUFTRAEGE);
});

test('Ausweg: Nachholen übersteht Speichern und Laden, der Lauf passt weiterhin', () => {
  const grenze = regeln.durchgaengeBisAusweg * baeckerei.runden[0].frei.length;
  const mitten = ohneZaehlen(bisFrei(), grenze);
  const geladen = pruefeLauf(wandleUm(JSON.parse(JSON.stringify(mitten))), alle);
  assert.equal(geladen.lauf.ohneFortschritt, grenze);
  assert.equal(auswegOffen(geladen, baeckerei, regeln), true);
  const { stand } = ueberspringeRunde(mitten, baeckerei, regeln, alle);
  const wieder = wandleUm(JSON.parse(JSON.stringify(stand)));
  assert.equal(wieder.fortschritt.prompt.nachholen, true);
});

test('Ausweg: Wer danach springt, hat das Konzept gemeistert und nichts mehr nachzuholen', () => {
  const grenze = regeln.durchgaengeBisAusweg * baeckerei.runden[0].frei.length;
  const { stand } = ueberspringeRunde(ohneZaehlen(bisFrei(), grenze), baeckerei, regeln, alle);
  const gesprungen = springeZuAuftrag(stand, alle[1].id, alle, regeln);
  assert.ok(istGemeistert(gesprungen.fortschritt.prompt, regeln));
  assert.equal(gesprungen.fortschritt.prompt.nachholen, undefined);
});

test('Ausweg: In Mischrunden und Wiederholungen gibt es keinen, dort kann man nicht hängen bleiben', () => {
  let stand = starteAuftrag(neuerStand(), baeckerei, regeln, alle);
  const misch = baeckerei.runden.length - 1;
  stand = { ...stand, lauf: { ...stand.lauf, runde: misch, schritt: 'frei', reihe: [...baeckerei.runden[misch].frei], ohneFortschritt: 99 } };
  assert.equal(auswegOffen(stand, baeckerei, regeln), false);
});
