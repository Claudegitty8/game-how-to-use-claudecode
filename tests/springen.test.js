// Tests für das Springen zu einem Auftrag (E-043) und das Umwandeln alter Spielstände (E-044).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { AUFTRAEGE } from '../spiel/code/inhalte/lader.js';
import {
  neuerStand, starteAuftrag, ansicht, verbucheFrei, STAND_VERSION,
} from '../spiel/code/logik/ablauf.js';
import { istGemeistert } from '../spiel/code/logik/meisterschaft.js';
import {
  sprungStatus, springeZuAuftrag, wandleUm, pruefeLauf, istSpielstand,
} from '../spiel/code/logik/extras.js';
import { erstelleSpeicher } from '../spiel/code/speicher/speicher.js';

const lies = async (pfad) => JSON.parse(await readFile(new URL(`../spiel/inhalte/${pfad}`, import.meta.url), 'utf8'));
const regeln = await lies('regeln.json');
const alle = await Promise.all(AUFTRAEGE.map((id) => lies(`de/auftraege/${id}.json`)));
const konzepteVon = (auftrag) => auftrag.runden.filter((r) => r.konzept).map((r) => r.konzept);

// Ein kleiner Gerätespeicher zum Testen.
function testLager(anfang = {}) {
  const daten = { ...anfang };
  return {
    daten,
    getItem: (schluessel) => daten[schluessel] ?? null,
    setItem: (schluessel, wert) => { daten[schluessel] = String(wert); },
    removeItem: (schluessel) => { delete daten[schluessel]; },
  };
}

// --- Springen ---

test('Springen: Am Anfang ist der erste Auftrag dran, alle anderen sind Sprungziele', () => {
  const status = sprungStatus(neuerStand(), alle);
  assert.equal(status[0].status, 'dran');
  assert.ok(status.slice(1).every((s) => s.status === 'ziel'));
});

test('Springen: Alles davor gilt als erledigt und gemeistert, das Ziel ist dran', () => {
  const ziel = alle[4];
  const stand = springeZuAuftrag(neuerStand(), ziel.id, alle, regeln);
  assert.deepEqual(stand.erledigt, AUFTRAEGE.slice(0, 4));
  for (const auftrag of alle.slice(0, 4)) {
    for (const konzept of konzepteVon(auftrag)) {
      assert.ok(istGemeistert(stand.fortschritt[konzept], regeln), `${konzept} sollte gemeistert sein`);
      assert.ok(stand.lexikon.includes(konzept), `${konzept} sollte im Lexikon stehen`);
      // Übersprungenes kommt später als Wiederholung wieder.
      assert.equal(typeof stand.fortschritt[konzept].faelligBei, 'number');
    }
  }
  assert.equal(sprungStatus(stand, alle)[4].status, 'dran');
  // Konzepte des Ziels sind noch nicht gelernt: Der Auftrag beginnt ganz normal.
  for (const konzept of konzepteVon(ziel)) assert.equal(stand.fortschritt[konzept], undefined);
  const gestartet = starteAuftrag(stand, ziel, regeln, alle);
  assert.equal(gestartet.lauf.auftrag, ziel.id);
  assert.equal(gestartet.lauf.runde, 0);
});

test('Springen: Ein angefangener Auftrag wird beendet, Gelerntes bleibt erhalten', () => {
  let stand = starteAuftrag(neuerStand(), alle[0], regeln, alle);
  stand = { ...stand, lauf: { ...stand.lauf, schritt: 'frei' } };
  ({ stand } = verbucheFrei(stand, alle[0], regeln, { ok: true, zaehlt: true }, alle));
  const vorher = stand.fortschritt.prompt.geloesteSituationen[0];
  const danach = springeZuAuftrag(stand, alle[2].id, alle, regeln);
  assert.equal(danach.lauf, null);
  assert.ok(danach.fortschritt.prompt.geloesteSituationen.includes(vorher));
  assert.deepEqual(danach.erledigt, [alle[0].id, alle[1].id]);
});

test('Springen: Ein Lauf im Ziel oder Erledigtes bleibt unangetastet', () => {
  const stand = springeZuAuftrag(neuerStand(), alle[3].id, alle, regeln);
  const nochmals = springeZuAuftrag(stand, alle[3].id, alle, regeln);
  assert.equal(nochmals, stand, 'Zum Auftrag, der schon dran ist, wird nicht gesprungen');
  assert.equal(springeZuAuftrag(stand, alle[1].id, alle, regeln), stand, 'Rückwärts wird nicht gesprungen');
  assert.equal(springeZuAuftrag(stand, 'gibtsnicht', alle, regeln), stand);
});

test('Springen: Schon gemeisterte Konzepte behalten ihren Stand', () => {
  const gemeistert = { geloesteSituationen: ['x', 'y', 'z'], wiederholungsStufe: 2, faelligBei: 40 };
  const stand = springeZuAuftrag({ ...neuerStand(), fortschritt: { prompt: gemeistert } }, alle[1].id, alle, regeln);
  assert.deepEqual(stand.fortschritt.prompt, gemeistert);
});

test('Springen bis zum Schluss: Der letzte Auftrag lässt sich danach durchspielen', () => {
  const letzter = alle.at(-1);
  let stand = springeZuAuftrag(neuerStand(), letzter.id, alle, regeln);
  assert.equal(stand.erledigt.length, alle.length - 1);
  stand = starteAuftrag(stand, letzter, regeln, alle);
  let ereignis = 'weiter';
  let schritte = 0;
  while (ereignis !== 'auftragFertig' && schritte < 500) {
    schritte += 1;
    if (stand.lauf.wiederholung) {
      stand = { ...stand, lauf: { ...stand.lauf, wiederholung: null } };
      continue;
    }
    if (stand.lauf.schritt !== 'frei') {
      stand = { ...stand, lauf: { ...stand.lauf, schritt: 'frei' } };
      continue;
    }
    ({ stand, ereignis } = verbucheFrei(stand, letzter, regeln, { ok: true, zaehlt: true }, alle));
  }
  assert.equal(ereignis, 'auftragFertig');
  assert.equal(stand.erledigt.length, alle.length);
  assert.ok(sprungStatus(stand, alle).every((s) => s.status === 'erledigt'));
});

// --- Umwandeln ---

test('Umwandeln: Ein aktueller Stand bleibt, wie er ist', () => {
  const stand = springeZuAuftrag(neuerStand(), alle[2].id, alle, regeln);
  assert.deepEqual(wandleUm(JSON.parse(JSON.stringify(stand))), stand);
});

test('Umwandeln: Ein Stand aus einer anderen Version wird ergänzt statt verworfen', () => {
  const alt = {
    version: 1,
    erledigt: ['baeckerei', 'baeckerei', 7],
    fortschritt: { prompt: { geloesteSituationen: ['a', 'b', 'c'] }, kaputt: { foo: 1 } },
    lexikon: ['prompt'],
    rundenZaehler: 5,
    lauf: { auftrag: 'turnverein', runde: 0 },
  };
  const neu = wandleUm(alt);
  assert.equal(neu.version, STAND_VERSION);
  assert.deepEqual(neu.erledigt, ['baeckerei']);
  assert.deepEqual(neu.fortschritt, { prompt: { geloesteSituationen: ['a', 'b', 'c'], wiederholungsStufe: 0 } });
  assert.ok(neu.lexikon.includes('ki') && neu.lexikon.includes('prompt'));
  assert.equal(neu.rundenZaehler, 5);
  assert.equal(neu.lauf, null, 'Ein Lauf aus einer anderen Version beginnt neu');
  assert.deepEqual(neu.einrichtung, []);
  assert.equal(istSpielstand(neu), true);
});

test('Umwandeln: Was nicht wie ein Spielstand aussieht, ergibt null', () => {
  for (const wert of [null, 5, 'text', [], { version: 1, besuche: 3 }]) assert.equal(wandleUm(wert), null);
});

test('Laufender Auftrag: Passt er nach einem Update nicht mehr, beginnt er neu', () => {
  const stand = starteAuftrag(neuerStand(), alle[0], regeln, alle);
  assert.equal(pruefeLauf(stand, alle), stand);
  assert.equal(pruefeLauf({ ...stand, lauf: { ...stand.lauf, runde: 99 } }, alle).lauf, null);
  assert.equal(pruefeLauf({ ...stand, lauf: { ...stand.lauf, auftrag: 'weg' } }, alle).lauf, null);
  assert.equal(pruefeLauf({ ...stand, lauf: { ...stand.lauf, reihe: ['gibtsnicht'] } }, alle).lauf, null);
  assert.equal(pruefeLauf({ ...stand, lauf: { ...stand.lauf, schritt: 'unbekannt' } }, alle).lauf, null);
  const mitWiederholung = { ...stand, lauf: { ...stand.lauf, wiederholung: { konzept: 'prompt', aufgabe: 'weg', auftrag: 'baeckerei' } } };
  assert.equal(pruefeLauf(mitWiederholung, alle).lauf, null);
  assert.equal(ansicht(pruefeLauf(stand, alle), alle[0]).art, 'probieren');
});

// --- Speicher ---

test('Speicher: Ein alter Stand wird umgewandelt und das Original gesichert', () => {
  const roh = JSON.stringify({ version: 1, erledigt: ['baeckerei'], fortschritt: {}, rundenZaehler: 4 });
  const lager = testLager({ 'ki-studio-stand': roh });
  const stand = erstelleSpeicher(lager).laden();
  assert.deepEqual(stand.erledigt, ['baeckerei']);
  assert.equal(stand.rundenZaehler, 4);
  assert.equal(lager.daten['ki-studio-stand-alt'], roh);
});

test('Speicher: Der Stand vor einem Sprung lässt sich zurückholen und wird beim Löschen entfernt', () => {
  const lager = testLager();
  const speicher = erstelleSpeicher(lager);
  assert.equal(speicher.vorSprung(), null);
  const vorher = starteAuftrag(neuerStand(), alle[0], regeln, alle);
  speicher.merkeVorSprung(vorher);
  speicher.speichern(springeZuAuftrag(vorher, alle[3].id, alle, regeln));
  assert.deepEqual(speicher.vorSprung(), vorher);
  // Auch nach dem Neuladen der Seite noch da.
  assert.deepEqual(erstelleSpeicher(lager).vorSprung(), vorher);
  speicher.vergissVorSprung();
  assert.equal(speicher.vorSprung(), null);
  speicher.merkeVorSprung(vorher);
  speicher.loeschen();
  assert.equal(speicher.vorSprung(), null);
});

test('Speicher: Ohne Gerätespeicher klappt das Zurückholen bis zum Neuladen', () => {
  const speicher = erstelleSpeicher(null);
  const vorher = neuerStand();
  speicher.merkeVorSprung(vorher);
  assert.deepEqual(speicher.vorSprung(), vorher);
});
