// Zusätze rund um den Kern: Schnelltest, Studio-Einrichtung, freiwillige Fragen, Daumen, Spielstand prüfen.
// Reine Logik: Jede Funktion bekommt einen Spielstand und gibt einen neuen zurück.
import { neuerFortschritt, verbucheVersuch, istGemeistert, naechsterAbstand } from './meisterschaft.js';
import { STAND_VERSION } from './ablauf.js';

// --- Schnelltest: «Das kann ich schon» ---

// Pro Konzept des Auftrags so viele freie Situationen, wie es für die Meisterschaft braucht.
export function schnelltestAufgaben(auftrag, regeln) {
  return auftrag.runden
    .filter((runde) => runde.konzept)
    .flatMap((runde) => runde.frei.slice(0, regeln.erfolgeFuerMeisterschaft).map((aufgabe) => ({ konzept: runde.konzept, aufgabe })));
}

// ergebnisse: Liste aus { konzept, aufgabe, richtig }. Nur wer bei einem Konzept alles richtig hat,
// bekommt es als gemeistert gutgeschrieben. Alles andere bleibt, wie es war: Scheitern kostet nichts.
export function verbucheSchnelltest(stand, auftrag, regeln, ergebnisse) {
  let { fortschritt, lexikon } = stand;
  const bestanden = [];
  for (const runde of auftrag.runden.filter((r) => r.konzept)) {
    const eigene = ergebnisse.filter((e) => e.konzept === runde.konzept);
    if (eigene.length < regeln.erfolgeFuerMeisterschaft || eigene.some((e) => !e.richtig)) continue;
    let eintrag = fortschritt[runde.konzept] ?? neuerFortschritt();
    for (const e of eigene) eintrag = verbucheVersuch(eintrag, { situation: e.aufgabe, richtig: true });
    if (!istGemeistert(eintrag, regeln)) continue;
    // Auch Übersprungenes kommt später als Wiederholung wieder.
    eintrag = { ...eintrag, faelligBei: stand.rundenZaehler + naechsterAbstand(eintrag, regeln) };
    fortschritt = { ...fortschritt, [runde.konzept]: eintrag };
    if (!lexikon.includes(runde.konzept)) lexikon = [...lexikon, runde.konzept];
    bestanden.push(runde.konzept);
  }
  return { stand: { ...stand, fortschritt, lexikon }, bestanden };
}

// --- Studio einrichten: gesparte Spiel-Tokens ausgeben. Reine Zierde. ---

export function guthaben(stand, katalog) {
  const gespart = Object.values(stand.gespart ?? {}).reduce((summe, wert) => summe + wert, 0);
  const ausgegeben = (stand.einrichtung ?? [])
    .reduce((summe, id) => summe + (katalog.find((ding) => ding.id === id)?.preis ?? 0), 0);
  return gespart - ausgegeben;
}

export function kaufe(stand, id, katalog) {
  const ding = katalog.find((eintrag) => eintrag.id === id);
  const schonDa = (stand.einrichtung ?? []).includes(id);
  if (!ding || schonDa || ding.preis > guthaben(stand, katalog)) return stand;
  return { ...stand, einrichtung: [...(stand.einrichtung ?? []), id] };
}

// --- Freiwillige Fragen vor und nach dem Spiel ---

// antworten: { frageId: optionId }. Festgehalten wird nur, wie viele richtig waren.
export function verbucheUmfrage(stand, wann, antworten, fragen) {
  const richtig = fragen.filter((frage) => frage.optionen.find((o) => o.id === antworten[frage.id])?.richtig).length;
  return { ...stand, umfrage: { ...(stand.umfrage ?? {}), [wann]: { richtig, von: fragen.length } } };
}

// --- Ein Daumen pro Auftrag ---

export function verbucheDaumen(stand, auftragId, hoch) {
  return { ...stand, daumen: { ...(stand.daumen ?? {}), [auftragId]: hoch ? 'hoch' : 'runter' } };
}

// --- Spielstand aus einer Datei: nur annehmen, was wie ein Spielstand aussieht ---

export function istSpielstand(wert) {
  return Boolean(wert) && typeof wert === 'object'
    && wert.version === STAND_VERSION
    && Array.isArray(wert.erledigt) && wert.erledigt.every((id) => typeof id === 'string')
    && Array.isArray(wert.lexikon)
    && typeof wert.fortschritt === 'object' && wert.fortschritt !== null
    && Number.isInteger(wert.rundenZaehler)
    && typeof wert.einstellungen === 'object' && wert.einstellungen !== null
    && (wert.lauf === null || typeof wert.lauf === 'object');
}
