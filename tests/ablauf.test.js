import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  neuerStand, starteAuftrag, ansicht, weiter, verbucheFrei, verbucheWiederholungsErgebnis, verbraucheTokens,
} from '../spiel/code/logik/ablauf.js';
import { erfolge } from '../spiel/code/logik/meisterschaft.js';

const lies = async (pfad) => JSON.parse(await readFile(new URL(`../spiel/inhalte/${pfad}`, import.meta.url), 'utf8'));
const regeln = await lies('regeln.json');
const auftrag = await lies('de/auftraege/baeckerei.json');

function bisFrei(stand) {
  let s = stand;
  while (ansicht(s, auftrag).art !== 'frei') s = weiter(s, auftrag);
  return s;
}

test('Ein neuer Auftrag beginnt mit Probieren, und das Aha schaltet das Lexikon frei', () => {
  let stand = starteAuftrag(neuerStand(), auftrag, regeln);
  const erste = ansicht(stand, auftrag);
  assert.equal(erste.art, 'probieren');
  assert.equal(erste.konzept, 'prompt');
  assert.deepEqual(erste.nurTeile, ['vage1', 'vage2']);
  assert.equal(stand.lexikon.includes('prompt'), false);

  stand = weiter(stand, auftrag);
  assert.equal(ansicht(stand, auftrag).art, 'aha');
  assert.equal(stand.lexikon.includes('prompt'), true);

  stand = weiter(stand, auftrag);
  assert.equal(ansicht(stand, auftrag).art, 'beispiel');
  stand = weiter(stand, auftrag);
  const luecke = ansicht(stand, auftrag);
  assert.equal(luecke.art, 'luecke');
  assert.deepEqual(luecke.vorgabe, ['ziel']);
});

test('Nicht gezählte Situationen kommen später nochmals, gezählte nicht', () => {
  let stand = bisFrei(starteAuftrag(neuerStand(), auftrag, regeln));
  assert.equal(ansicht(stand, auftrag).aufgabeId, 'p-c');

  // Gelöst, aber erst im zweiten Versuch: zählt nicht und wandert ans Ende.
  ({ stand } = verbucheFrei(stand, auftrag, regeln, { ok: true, zaehlt: false }));
  assert.equal(erfolge(stand.fortschritt.prompt), 0);
  assert.deepEqual(stand.lauf.reihe, ['p-d', 'p-e', 'p-f', 'p-c']);

  ({ stand } = verbucheFrei(stand, auftrag, regeln, { ok: true, zaehlt: true }));
  assert.equal(erfolge(stand.fortschritt.prompt), 1);
  assert.deepEqual(stand.lauf.reihe, ['p-e', 'p-f', 'p-c']);

  ({ stand } = verbucheFrei(stand, auftrag, regeln, { ok: false, zaehlt: false }));
  assert.deepEqual(stand.lauf.reihe, ['p-f', 'p-c', 'p-e']);
});

test('Nach drei gezählten Erfolgen ist die Runde gemeistert und die nächste beginnt', () => {
  let stand = bisFrei(starteAuftrag(neuerStand(), auftrag, regeln));
  let ereignis;
  for (let i = 0; i < 3; i += 1) {
    ({ stand, ereignis } = verbucheFrei(stand, auftrag, regeln, { ok: true, zaehlt: true }));
  }
  assert.equal(ereignis, 'rundeFertig');
  assert.equal(stand.rundenZaehler, 1);
  const naechste = ansicht(stand, auftrag);
  assert.equal(naechste.art, 'probieren');
  assert.equal(naechste.konzept, 'kontext');
});

test('Ganzer Auftrag: Wiederholungen kommen zur richtigen Zeit, am Ende ist alles erledigt', () => {
  let stand = starteAuftrag(neuerStand(), auftrag, regeln);
  const wiederholungen = [];
  let ereignis = 'weiter';
  let schritte = 0;

  while (ereignis !== 'auftragFertig') {
    schritte += 1;
    assert.ok(schritte < 200, 'Der Ablauf darf nicht hängen bleiben');
    const a = ansicht(stand, auftrag);
    if (a.art === 'wiederholung') {
      wiederholungen.push(`${a.konzept} vor Runde ${a.rundenNr}`);
      assert.ok(auftrag.aufgaben[a.aufgabeId], 'Wiederholung nennt eine echte Aufgabe');
      stand = verbucheWiederholungsErgebnis(stand, regeln, true);
    } else if (a.art === 'frei' || a.art === 'misch') {
      ({ stand, ereignis } = verbucheFrei(stand, auftrag, regeln, { ok: true, zaehlt: true }));
    } else {
      stand = weiter(stand, auftrag);
    }
  }

  // Prompt wurde in Runde 1 gemeistert: eine Runde Abstand, also vor Runde 3. Kontext vor Runde 4.
  assert.deepEqual(wiederholungen, ['prompt vor Runde 3', 'kontext vor Runde 4']);
  assert.deepEqual(stand.erledigt, ['baeckerei']);
  assert.equal(stand.lauf, null);
  assert.equal(stand.rundenZaehler, 4);
  assert.deepEqual(stand.lexikon, ['ki', 'prompt', 'kontext', 'beispiele']);
  assert.deepEqual(ansicht(stand, auftrag), { art: 'studio' });
});

test('Eine misslungene Wiederholung kommt schon nach der nächsten Runde wieder', () => {
  let stand = { ...neuerStand(), rundenZaehler: 2 };
  stand.fortschritt.prompt = { geloesteSituationen: ['p-c', 'p-d', 'p-e'], wiederholungsStufe: 1, faelligBei: 2 };
  stand.lauf = { auftrag: 'baeckerei', runde: 2, schritt: 'probieren', reihe: [], wiederholung: { konzept: 'prompt', aufgabe: 'p-f' } };
  stand = verbucheWiederholungsErgebnis(stand, regeln, false);
  assert.equal(stand.fortschritt.prompt.faelligBei, 3);
  assert.equal(stand.lauf.wiederholung, null);
});

test('In der Mischrunde bleibt eine Aufgabe, bis sie gelöst ist', () => {
  let stand = { ...neuerStand(), rundenZaehler: 3 };
  stand.lauf = { auftrag: 'baeckerei', runde: 3, schritt: 'frei', reihe: ['m-a', 'm-b'], wiederholung: null };
  let ereignis;
  ({ stand, ereignis } = verbucheFrei(stand, auftrag, regeln, { ok: false, zaehlt: false }));
  assert.deepEqual(stand.lauf.reihe, ['m-a', 'm-b']);
  ({ stand, ereignis } = verbucheFrei(stand, auftrag, regeln, { ok: true, zaehlt: true }));
  assert.equal(ereignis, 'weiter');
  ({ stand, ereignis } = verbucheFrei(stand, auftrag, regeln, { ok: true, zaehlt: true }));
  assert.equal(ereignis, 'auftragFertig');
});

const turnverein = await lies('de/auftraege/turnverein.json');
const dorfmuseum = await lies('de/auftraege/dorfmuseum.json');
const alle = [auftrag, turnverein, dorfmuseum];

function spieleDurch(start, aktueller) {
  let stand = starteAuftrag(start, aktueller, regeln, alle);
  const wiederholungen = [];
  let ereignis = 'weiter';
  let schritte = 0;
  while (ereignis !== 'auftragFertig') {
    schritte += 1;
    assert.ok(schritte < 200, 'Der Ablauf darf nicht hängen bleiben');
    const a = ansicht(stand, aktueller);
    if (a.art === 'wiederholung') {
      const quelle = alle.find((x) => x.id === a.aufgabeVon);
      assert.ok(quelle.aufgaben[a.aufgabeId], 'Wiederholung nennt eine echte Aufgabe');
      wiederholungen.push(`${a.konzept} aus ${a.aufgabeVon} vor Runde ${a.rundenNr}`);
      stand = verbucheWiederholungsErgebnis(stand, regeln, true);
    } else if (a.art === 'frei' || a.art === 'misch') {
      ({ stand, ereignis } = verbucheFrei(stand, aktueller, regeln, { ok: true, zaehlt: true }, alle));
    } else {
      stand = weiter(stand, aktueller);
    }
  }
  return { stand, wiederholungen };
}

test('Zwei Aufträge hintereinander: Gelerntes aus dem ersten kommt im zweiten wieder', () => {
  const erster = spieleDurch(neuerStand(), auftrag);
  assert.deepEqual(erster.wiederholungen, ['prompt aus baeckerei vor Runde 3', 'kontext aus baeckerei vor Runde 4']);

  const zweiter = spieleDurch(erster.stand, turnverein);
  assert.deepEqual(zweiter.wiederholungen, ['beispiele aus baeckerei vor Runde 1', 'prompt aus baeckerei vor Runde 2']);
  assert.deepEqual(zweiter.stand.erledigt, ['baeckerei', 'turnverein']);
  assert.deepEqual(zweiter.stand.lexikon, ['ki', 'prompt', 'kontext', 'beispiele', 'chatbot', 'rolle']);
  assert.equal(zweiter.stand.rundenZaehler, 6);
});

test('Ein erledigter Auftrag lässt sich nicht nochmals starten', () => {
  const { stand } = spieleDurch(neuerStand(), auftrag);
  assert.equal(starteAuftrag(stand, auftrag, regeln, alle), stand);
});

test('Drei Aufträge: Kapitel 2 baut auf Kapitel 1 auf und wiederholt es', () => {
  const erster = spieleDurch(neuerStand(), auftrag);
  const zweiter = spieleDurch(erster.stand, turnverein);
  const dritter = spieleDurch(zweiter.stand, dorfmuseum);
  assert.equal(dritter.wiederholungen.length, 3, 'vor jeder der drei Runden eine Wiederholung');
  assert.ok(dritter.wiederholungen.every((w) => !w.includes('dorfmuseum vor Runde 1')));
  assert.deepEqual(dritter.stand.erledigt, ['baeckerei', 'turnverein', 'dorfmuseum']);
  assert.ok(dritter.stand.lexikon.includes('halluzination') && dritter.stand.lexikon.includes('training'));
});

const dorfzeitung = await lies('de/auftraege/dorfzeitung.json');
alle.push(dorfzeitung);

test('Token-Budget: gilt für den ganzen Auftrag, Rest wird gespart', () => {
  let stand = starteAuftrag(neuerStand(), dorfzeitung, regeln, alle);
  assert.equal(stand.lauf.tokens, 6000);
  ({ stand } = verbraucheTokens(stand, dorfzeitung, 250));
  assert.equal(stand.lauf.tokens, 5750);

  // Das Budget wandert in die nächste Runde mit.
  stand = bisFreiIn(stand, dorfzeitung);
  for (let i = 0; i < 3; i += 1) ({ stand } = verbucheFrei(stand, dorfzeitung, regeln, { ok: true, zaehlt: true }, alle));
  assert.equal(stand.lauf.runde, 1);
  assert.equal(stand.lauf.tokens, 5750);
});

test('Token-Budget: Ist es leer, wird nachgefüllt, aber nichts gespart', () => {
  let stand = starteAuftrag(neuerStand(), dorfzeitung, regeln, alle);
  let nachgeschoben;
  ({ stand, nachgeschoben } = verbraucheTokens(stand, dorfzeitung, 7000));
  assert.equal(nachgeschoben, true);
  assert.equal(stand.lauf.tokens, 3000);
  const fertig = spieleDurchAb(stand, dorfzeitung);
  assert.equal(fertig.gespart.dorfzeitung, 0);
});

test('Aufträge ohne Budget kennen keine Tokens', () => {
  const stand = starteAuftrag(neuerStand(), auftrag, regeln, alle);
  assert.equal(stand.lauf.tokens, null);
  assert.equal(verbraucheTokens(stand, auftrag, 500).stand, stand);
  assert.deepEqual(spieleDurch(neuerStand(), auftrag).stand.gespart, {});
});

test('Vier Aufträge hintereinander: Sparen wird festgehalten', () => {
  let stand = neuerStand();
  for (const a of alle) ({ stand } = spieleDurch(stand, a));
  assert.deepEqual(stand.erledigt, ['baeckerei', 'turnverein', 'dorfmuseum', 'dorfzeitung']);
  assert.deepEqual(stand.gespart, { dorfzeitung: 6000 });
  assert.equal(stand.lexikon.length, 13);
});

function bisFreiIn(stand, a) {
  let s = stand;
  while (ansicht(s, a).art !== 'frei') {
    s = ansicht(s, a).art === 'wiederholung' ? verbucheWiederholungsErgebnis(s, regeln, true) : weiter(s, a);
  }
  return s;
}

function spieleDurchAb(start, a) {
  let stand = start;
  let ereignis = 'weiter';
  while (ereignis !== 'auftragFertig') {
    const sicht = ansicht(stand, a);
    if (sicht.art === 'wiederholung') stand = verbucheWiederholungsErgebnis(stand, regeln, true);
    else if (sicht.art === 'frei' || sicht.art === 'misch') ({ stand, ereignis } = verbucheFrei(stand, a, regeln, { ok: true, zaehlt: true }, alle));
    else stand = weiter(stand, a);
  }
  return stand;
}
