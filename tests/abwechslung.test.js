// Tests für mehr Abwechslung bei Wiederholung und Schnelltest (E-048).
// Fehler aus Version 0.16: Jede Wiederholung eines Konzepts brachte dieselbe Aufgabe,
// und der Schnelltest zeigte bei jedem Start dieselben Aufgaben.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { AUFTRAEGE } from '../spiel/code/inhalte/lader.js';
import {
  neuerStand, starteAuftrag, ansicht, weiter, verbucheFrei, verbucheWiederholungsErgebnis, waehleWiederholung,
} from '../spiel/code/logik/ablauf.js';
import {
  schnelltestAufgaben, starteSchnelltest, laufenderSchnelltest, verbucheSchnelltest, wandleUm, pruefeLauf,
} from '../spiel/code/logik/extras.js';

const lies = async (pfad) => JSON.parse(await readFile(new URL(`../spiel/inhalte/${pfad}`, import.meta.url), 'utf8'));
const regeln = await lies('regeln.json');
const alle = await Promise.all(AUFTRAEGE.map((id) => lies(`de/auftraege/${id}.json`)));
const baeckerei = alle[0];
const promptRunde = baeckerei.runden[0];

// Spielt das ganze Spiel und sammelt pro Konzept die Aufgaben der Wiederholungen.
// richtig(nr) entscheidet, ob die nr-te Wiederholung gelingt.
function sammleWiederholungen(richtig) {
  let stand = neuerStand();
  const gezeigt = {};
  let nr = 0;
  for (const auftrag of alle) {
    stand = starteAuftrag(stand, auftrag, regeln, alle);
    let ereignis = 'weiter';
    while (ereignis !== 'auftragFertig') {
      const sicht = ansicht(stand, auftrag);
      if (sicht.art === 'wiederholung') {
        (gezeigt[sicht.konzept] ??= []).push(sicht.aufgabeId);
        nr += 1;
        stand = verbucheWiederholungsErgebnis(stand, regeln, richtig(nr));
      } else if (sicht.art === 'frei' || sicht.art === 'misch') {
        ({ stand, ereignis } = verbucheFrei(stand, auftrag, regeln, { ok: true, zaehlt: true }, alle));
      } else stand = weiter(stand, auftrag);
    }
  }
  return gezeigt;
}

// --- Wiederholung ---

test('Wiederholung: Wer alles richtig hat, sieht bei keinem Konzept dieselbe Aufgabe zweimal', () => {
  const gezeigt = sammleWiederholungen(() => true);
  assert.ok(Object.keys(gezeigt).length > 0);
  for (const [konzept, liste] of Object.entries(gezeigt)) {
    assert.equal(new Set(liste).size, liste.length, `«${konzept}»: ${liste.join(', ')}`);
  }
});

test('Wiederholung: Auch mit Fehlern kommt nie dieselbe Aufgabe zweimal hintereinander', () => {
  for (const muster of [(nr) => nr % 2 === 0, (nr) => nr % 3 !== 0, () => false]) {
    const gezeigt = sammleWiederholungen(muster);
    for (const [konzept, liste] of Object.entries(gezeigt)) {
      for (let i = 1; i < liste.length; i += 1) {
        assert.notEqual(liste[i], liste[i - 1], `«${konzept}»: ${liste.join(', ')}`);
      }
    }
  }
});

test('Wiederholung: zuerst eine noch nie gelöste Situation, dann der Reihe nach die anderen', () => {
  let fortschritt = { geloesteSituationen: ['p-c', 'p-d', 'p-e'], wiederholungsStufe: 0 };
  const folge = [];
  for (let i = 0; i < 6; i += 1) {
    const aufgabe = waehleWiederholung(promptRunde, fortschritt);
    folge.push(aufgabe);
    fortschritt = { ...fortschritt, wiederholt: [...(fortschritt.wiederholt ?? []).filter((id) => id !== aufgabe), aufgabe] };
  }
  assert.equal(folge[0], 'p-f', 'Zuerst die nie gelöste Situation');
  // Die ersten fünf sind alle verschieden: vier freie Situationen und die Aufgabe aus der Lücke.
  assert.equal(new Set(folge.slice(0, 5)).size, 5);
  assert.ok(folge.includes(promptRunde.luecke.aufgabe));
  // Danach geht es mit der ältesten weiter, nicht mit der letzten.
  assert.equal(folge[5], folge[0]);
});

test('Wiederholung: Sind alle schon gekommen, geht es reihum, ohne dass zwei Aufgaben sich abwechseln', () => {
  let fortschritt = { geloesteSituationen: ['p-c', 'p-d', 'p-e'], wiederholungsStufe: 0 };
  const folge = [];
  for (let i = 0; i < 15; i += 1) {
    const aufgabe = waehleWiederholung(promptRunde, fortschritt);
    folge.push(aufgabe);
    fortschritt = { ...fortschritt, wiederholt: [...(fortschritt.wiederholt ?? []).filter((id) => id !== aufgabe), aufgabe] };
  }
  // In jedem Abschnitt von fünf Wiederholungen kommt jede Aufgabe genau einmal.
  for (let start = 0; start + 5 <= folge.length; start += 1) {
    assert.equal(new Set(folge.slice(start, start + 5)).size, 5, folge.join(', '));
  }
});

test('Wiederholung: Wer nachholt, bekommt nur Situationen, die noch nicht gezählt haben, aber abwechselnd', () => {
  const fortschritt = { geloesteSituationen: ['p-c'], wiederholungsStufe: 0, nachholen: true, wiederholt: ['p-d'] };
  const aufgabe = waehleWiederholung(promptRunde, fortschritt);
  assert.ok(['p-e', 'p-f'].includes(aufgabe), aufgabe);
  // Bleibt nur eine offene, kommt sie, auch wenn sie zuletzt kam.
  assert.equal(waehleWiederholung(promptRunde, { ...fortschritt, geloesteSituationen: ['p-c', 'p-d', 'p-e'], wiederholt: ['p-f'] }), 'p-f');
});

test('Wiederholung: Die gezeigte Aufgabe wird gemerkt, auch wenn sie misslingt', () => {
  let stand = neuerStand();
  stand = {
    ...stand,
    fortschritt: { prompt: { geloesteSituationen: ['p-c', 'p-d', 'p-e'], wiederholungsStufe: 1 } },
    lauf: { auftrag: 'baeckerei', runde: 1, schritt: 'probieren', reihe: [], wiederholung: { konzept: 'prompt', aufgabe: 'p-f', auftrag: 'baeckerei' } },
  };
  const danach = verbucheWiederholungsErgebnis(stand, regeln, false);
  assert.deepEqual(danach.fortschritt.prompt.wiederholt, ['p-f']);
  assert.notEqual(waehleWiederholung(promptRunde, danach.fortschritt.prompt), 'p-f');
});

test('Wiederholung: Die gemerkten Aufgaben überstehen Speichern und Laden, Unsinn wird verworfen', () => {
  const stand = { ...neuerStand(), fortschritt: { prompt: { geloesteSituationen: ['p-c'], wiederholungsStufe: 0, wiederholt: ['p-f', 7, 'p-b', 'p-f'] } } };
  const geladen = wandleUm(JSON.parse(JSON.stringify(stand)));
  assert.deepEqual(geladen.fortschritt.prompt.wiederholt, ['p-f', 'p-b']);
  const ohne = wandleUm({ ...neuerStand(), fortschritt: { prompt: { geloesteSituationen: [], wiederholt: 'kaputt' } } });
  assert.equal(ohne.fortschritt.prompt.wiederholt, undefined);
});

// --- Schnelltest ---

test('Schnelltest: Jeder neue Start bringt andere Aufgaben als der letzte', () => {
  for (const auftrag of alle.filter((a) => a.runden.some((r) => r.konzept))) {
    let stand = neuerStand();
    let vorher = null;
    for (let versuch = 1; versuch <= 4; versuch += 1) {
      stand = starteSchnelltest(stand, auftrag, regeln);
      assert.equal(stand.schnelltest[auftrag.id].versuche, versuch);
      const jetzt = laufenderSchnelltest(stand, auftrag, regeln);
      assert.equal(jetzt.length, schnelltestAufgaben(auftrag, regeln).length);
      if (vorher) assert.notDeepEqual(jetzt, vorher, `«${auftrag.id}», Start ${versuch}`);
      vorher = jetzt;
    }
  }
});

test('Schnelltest: Pro Konzept immer drei verschiedene Aufgaben aus der Runde', () => {
  for (const auftrag of alle) {
    for (let versuch = 0; versuch < 6; versuch += 1) {
      const aufgaben = schnelltestAufgaben(auftrag, regeln, versuch);
      for (const runde of auftrag.runden.filter((r) => r.konzept)) {
        const eigene = aufgaben.filter((e) => e.konzept === runde.konzept).map((e) => e.aufgabe);
        assert.equal(eigene.length, regeln.erfolgeFuerMeisterschaft);
        assert.equal(new Set(eigene).size, eigene.length);
        assert.ok(eigene.every((id) => runde.frei.includes(id)));
      }
    }
  }
});

test('Schnelltest: Die Runde danach beginnt mit einer Situation, die nicht im Test war', () => {
  for (const auftrag of alle.filter((a) => a.runden.some((r) => r.konzept))) {
    let stand = starteSchnelltest(neuerStand(), auftrag, regeln);
    const getestet = laufenderSchnelltest(stand, auftrag, regeln).map((e) => e.aufgabe);
    // Nicht bestanden: alles falsch.
    ({ stand } = verbucheSchnelltest(stand, auftrag, regeln, laufenderSchnelltest(stand, auftrag, regeln).map((e) => ({ ...e, richtig: false }))));
    stand = starteAuftrag(stand, auftrag, regeln, alle);
    while (ansicht(stand, auftrag).art !== 'frei') stand = weiter(stand, auftrag);
    assert.ok(!getestet.includes(stand.lauf.reihe[0]), `«${auftrag.id}» beginnt mit ${stand.lauf.reihe[0]}`);
    // Alle Situationen der Runde bleiben dabei, nur die Reihenfolge ändert sich.
    assert.deepEqual([...stand.lauf.reihe].sort(), [...auftrag.runden[stand.lauf.runde].frei].sort());
    assert.equal(pruefeLauf(stand, alle), stand, 'Der Lauf passt weiterhin');
  }
});

test('Schnelltest: Die Aufgaben bleiben während des Tests gleich und überstehen Speichern und Laden', () => {
  const stand = starteSchnelltest(starteSchnelltest(neuerStand(), baeckerei, regeln), baeckerei, regeln);
  const geladen = wandleUm(JSON.parse(JSON.stringify(stand)));
  assert.deepEqual(geladen.schnelltest, stand.schnelltest);
  assert.deepEqual(laufenderSchnelltest(geladen, baeckerei, regeln), laufenderSchnelltest(stand, baeckerei, regeln));
});

test('Schnelltest: Kaputte oder veraltete Einträge stören nicht', () => {
  const kaputt = wandleUm({ ...neuerStand(), schnelltest: { baeckerei: { versuche: 'x' }, turnverein: { versuche: 2, aufgaben: [{ konzept: 'rolle' }, 5] } } });
  assert.equal(kaputt.schnelltest.baeckerei, undefined);
  assert.deepEqual(kaputt.schnelltest.turnverein, { versuche: 2, aufgaben: [] });
  // Passt der gespeicherte Test nicht mehr zum Auftrag, gelten die Aufgaben vom ersten Versuch.
  const fremd = { ...neuerStand(), schnelltest: { baeckerei: { versuche: 1, aufgaben: [{ konzept: 'prompt', aufgabe: 'gibtsnicht' }] } } };
  assert.deepEqual(laufenderSchnelltest(fremd, baeckerei, regeln), schnelltestAufgaben(baeckerei, regeln));
  // Ein alter Stand ohne Schnelltest-Feld bekommt ein leeres.
  const { schnelltest, ...alt } = neuerStand();
  assert.deepEqual(wandleUm(alt).schnelltest, {});
});
