// Zusätze rund um den Kern: Schnelltest, Studio-Einrichtung, freiwillige Fragen, Daumen,
// Spielstand prüfen und umwandeln, zu einem Auftrag springen.
// Reine Logik: Jede Funktion bekommt einen Spielstand und gibt einen neuen zurück.
import { neuerFortschritt, verbucheVersuch, istGemeistert, naechsterAbstand } from './meisterschaft.js';
import { STAND_VERSION, SCHRITTE, neuerStand } from './ablauf.js';

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

// --- Spielstand umwandeln: alte oder fremde Stände werden ergänzt statt verworfen (E-044) ---

const istObjekt = (wert) => Boolean(wert) && typeof wert === 'object' && !Array.isArray(wert);
const nurTexte = (wert) => (Array.isArray(wert) ? wert.filter((eintrag) => typeof eintrag === 'string') : null);
const nurZahlen = (wert) => (istObjekt(wert)
  ? Object.fromEntries(Object.entries(wert).filter(([, zahl]) => Number.isFinite(zahl)))
  : {});

// Behält nur Fortschritt-Einträge, die wie einer aussehen.
function pruefeFortschritt(wert) {
  if (!istObjekt(wert)) return {};
  const sauber = {};
  for (const [konzept, eintrag] of Object.entries(wert)) {
    const geloest = nurTexte(eintrag?.geloesteSituationen);
    if (!geloest) continue;
    const stufe = Number.isInteger(eintrag.wiederholungsStufe) && eintrag.wiederholungsStufe >= 0 ? eintrag.wiederholungsStufe : 0;
    const faellig = Number.isFinite(eintrag.faelligBei) ? eintrag.faelligBei : null;
    sauber[konzept] = {
      geloesteSituationen: geloest,
      wiederholungsStufe: stufe,
      ...(faellig == null ? {} : { faelligBei: faellig }),
      // Über den Ausweg verlassen, wird als Wiederholung nachgeholt (E-047).
      ...(eintrag.nachholen === true ? { nachholen: true } : {}),
    };
  }
  return sauber;
}

// Macht aus einem gespeicherten oder geladenen Wert einen gültigen Spielstand der aktuellen Version.
// Gibt null zurück, wenn der Wert gar nicht wie ein Spielstand aussieht.
export function wandleUm(wert) {
  if (!istObjekt(wert) || (!Array.isArray(wert.erledigt) && !istObjekt(wert.fortschritt))) return null;
  const leer = neuerStand();
  return {
    ...leer,
    erledigt: [...new Set(nurTexte(wert.erledigt) ?? [])],
    fortschritt: pruefeFortschritt(wert.fortschritt),
    lexikon: [...new Set([...leer.lexikon, ...(nurTexte(wert.lexikon) ?? [])])],
    rundenZaehler: Number.isInteger(wert.rundenZaehler) && wert.rundenZaehler >= 0 ? wert.rundenZaehler : 0,
    gespart: nurZahlen(wert.gespart),
    einrichtung: [...new Set(nurTexte(wert.einrichtung) ?? [])],
    umfrage: istObjekt(wert.umfrage) ? wert.umfrage : {},
    daumen: istObjekt(wert.daumen) ? wert.daumen : {},
    einstellungen: { ...leer.einstellungen, ...(istObjekt(wert.einstellungen) ? wert.einstellungen : {}) },
    // Ein laufender Auftrag aus einer anderen Version passt vielleicht nicht mehr. Dann beginnt er neu.
    lauf: wert.version === STAND_VERSION && istObjekt(wert.lauf) ? wert.lauf : null,
  };
}

// Passt der laufende Auftrag noch zu den Inhalten? Nach einem Update können sich Runden oder Aufgaben ändern.
// Passt er nicht, beginnt der Auftrag neu. Gemeisterte Konzepte werden dabei übersprungen, es geht also wenig verloren.
export function pruefeLauf(stand, auftraege) {
  const lauf = stand.lauf;
  if (!lauf) return stand;
  const auftrag = auftraege.find((a) => a.id === lauf.auftrag);
  const runde = auftrag?.runden?.[lauf.runde];
  const aufgabeDa = (auftragId, aufgabeId) => Boolean(auftraege.find((a) => a.id === auftragId)?.aufgaben?.[aufgabeId]);
  const schrittDa = ['aha', 'frei'].includes(lauf.schritt) || aufgabeDa(lauf.auftrag, runde?.[lauf.schritt]?.aufgabe);
  const passt = Boolean(runde)
    && !stand.erledigt.includes(auftrag.id)
    && SCHRITTE.includes(lauf.schritt) && schrittDa
    && Array.isArray(lauf.reihe) && lauf.reihe.every((id) => runde.frei.includes(id))
    && (!lauf.wiederholung || aufgabeDa(lauf.wiederholung.auftrag ?? auftrag.id, lauf.wiederholung.aufgabe));
  return passt ? stand : { ...stand, lauf: null };
}

// --- Zu einem Auftrag springen (E-043) ---

// Zeigt für jeden Auftrag, ob er erledigt ist, gerade dran ist oder ein Sprungziel sein kann.
// «offen» heisst: nicht erledigt, liegt aber vor dem Auftrag, der dran ist. Das kommt im normalen Spiel nicht vor.
// Gesprungen wird nur vorwärts, zu einem Auftrag nach dem, der gerade dran ist.
export function sprungStatus(stand, auftraege) {
  const dran = stand.lauf?.auftrag ?? auftraege.find((a) => !stand.erledigt.includes(a.id))?.id ?? null;
  const stelleDran = auftraege.findIndex((a) => a.id === dran);
  return auftraege.map((auftrag, stelle) => {
    if (stand.erledigt.includes(auftrag.id)) return { id: auftrag.id, status: 'erledigt' };
    if (auftrag.id === dran) return { id: auftrag.id, status: 'dran' };
    return { id: auftrag.id, status: stelleDran >= 0 && stelle > stelleDran ? 'ziel' : 'offen' };
  });
}

// Alle Aufträge vor dem Ziel gelten danach als erledigt, ihre Konzepte als gemeistert.
// Wie beim Schnelltest kommen die übersprungenen Konzepte später als Wiederholung.
export function springeZuAuftrag(stand, zielId, auftraege, regeln) {
  const ziel = auftraege.findIndex((a) => a.id === zielId);
  if (ziel < 0 || sprungStatus(stand, auftraege)[ziel].status !== 'ziel') return stand;
  let { fortschritt, lexikon } = stand;
  const uebersprungen = [];
  for (const auftrag of auftraege.slice(0, ziel)) {
    if (stand.erledigt.includes(auftrag.id)) continue;
    uebersprungen.push(auftrag.id);
    for (const id of auftrag.lexikon ?? []) if (!lexikon.includes(id)) lexikon = [...lexikon, id];
    for (const runde of auftrag.runden.filter((r) => r.konzept)) {
      let eintrag = fortschritt[runde.konzept] ?? neuerFortschritt();
      if (!istGemeistert(eintrag, regeln)) {
        for (const situation of runde.frei) {
          if (istGemeistert(eintrag, regeln)) break;
          eintrag = verbucheVersuch(eintrag, { situation, richtig: true });
        }
        // Wer springt, holt nichts mehr nach: Das Konzept gilt als gemeistert (E-043, E-047).
        const { nachholen, ...ohne } = eintrag;
        eintrag = { ...ohne, faelligBei: stand.rundenZaehler + naechsterAbstand(ohne, regeln) };
      }
      fortschritt = { ...fortschritt, [runde.konzept]: eintrag };
      if (!lexikon.includes(runde.konzept)) lexikon = [...lexikon, runde.konzept];
    }
  }
  return {
    ...stand,
    // Ein angefangener Auftrag, der übersprungen wird, ist damit beendet.
    lauf: stand.lauf && uebersprungen.includes(stand.lauf.auftrag) ? null : stand.lauf,
    erledigt: [...stand.erledigt, ...uebersprungen],
    fortschritt,
    lexikon,
  };
}
