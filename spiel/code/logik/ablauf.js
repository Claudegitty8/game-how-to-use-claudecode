// Spielablauf: Wo steht der Spieler, und was kommt als Nächstes?
// Reine Logik: Jede Funktion bekommt einen Spielstand und gibt einen neuen zurück.
import {
  neuerFortschritt, verbucheVersuch, istGemeistert, naechsterAbstand, verbucheWiederholung,
} from './meisterschaft.js';

export const SCHRITTE = ['probieren', 'aha', 'beispiel', 'luecke', 'frei'];
export const STAND_VERSION = 2;

export function neuerStand() {
  return {
    version: STAND_VERSION,
    lauf: null,            // der laufende Auftrag oder null
    erledigt: [],          // Kennungen erledigter Aufträge
    fortschritt: {},       // pro Konzept: gelöste Situationen, Wiederholungsstufe, Fälligkeit
    lexikon: ['ki'],       // freigeschaltete Lexikon-Einträge
    rundenZaehler: 0,      // Anzahl abgeschlossener Runden
    gespart: {},           // pro erledigtem Auftrag: gesparte Spiel-Tokens
    einrichtung: [],       // gekaufte Zierde fürs Studio
    umfrage: {},           // freiwillige Fragen: vorher und nachher, je Anzahl richtige
    daumen: {},            // pro Auftrag: hoch oder runter
    einstellungen: { schrift: 'normal' },
  };
}

// Sucht ein gemeistertes Konzept, dessen Wiederholung fällig ist. Gesucht wird in allen Aufträgen,
// damit Gelerntes aus früheren Aufträgen wiederkommt.
// Auch Konzepte, deren Runde über den Ausweg verlassen wurde (nachholen), kommen so wieder (E-047).
function faelligeWiederholung(stand, alle, regeln) {
  for (const auftrag of alle) for (const runde of auftrag.runden) {
    const fortschritt = runde.konzept && stand.fortschritt[runde.konzept];
    if (!fortschritt || (!istGemeistert(fortschritt, regeln) && !fortschritt.nachholen)) continue;
    if (fortschritt.faelligBei == null || fortschritt.faelligBei > stand.rundenZaehler) continue;
    // Am liebsten eine Situation, die der Spieler noch nie gelöst hat.
    const aufgabe = runde.frei.find((id) => !fortschritt.geloesteSituationen.includes(id)) ?? runde.frei[0];
    return { konzept: runde.konzept, aufgabe, auftrag: auftrag.id };
  }
  return null;
}

function betrittRunde(stand, auftrag, regeln, start, alle) {
  // Konzepte, die schon gemeistert sind (Schnelltest), werden übersprungen. Die Mischrunde am Schluss bleibt.
  let index = start;
  while (index < auftrag.runden.length - 1 && auftrag.runden[index].konzept
    && istGemeistert(stand.fortschritt[auftrag.runden[index].konzept] ?? neuerFortschritt(), regeln)) index += 1;
  const runde = auftrag.runden[index];
  // Das Token-Budget gilt für den ganzen Auftrag und wandert von Runde zu Runde mit.
  const budget = stand.lauf?.auftrag === auftrag.id
    ? { tokens: stand.lauf.tokens ?? null, nachgeschoben: Boolean(stand.lauf.nachgeschoben) }
    : { tokens: auftrag.tokenBudget ?? null, nachgeschoben: false };
  return {
    ...stand,
    lauf: {
      ...budget,
      auftrag: auftrag.id,
      runde: index,
      schritt: runde.art === 'misch' ? 'frei' : 'probieren',
      reihe: [...runde.frei],
      wiederholung: faelligeWiederholung(stand, alle ?? [auftrag], regeln),
    },
  };
}

export function starteAuftrag(stand, auftrag, regeln, alle) {
  if (stand.lauf || stand.erledigt.includes(auftrag.id)) return stand;
  // Manche Aufträge bringen Lexikon-Begriffe mit, die nicht abgeprüft werden.
  const neu = (auftrag.lexikon ?? []).filter((id) => !stand.lexikon.includes(id));
  return betrittRunde({ ...stand, lexikon: [...stand.lexikon, ...neu] }, auftrag, regeln, 0, alle);
}

// Beschreibt, was die Oberfläche gerade zeigen soll.
export function ansicht(stand, auftrag) {
  const lauf = stand.lauf;
  if (!lauf) return { art: 'studio' };
  const runde = auftrag.runden[lauf.runde];
  const basis = { runde, rundenNr: lauf.runde + 1, konzept: runde.konzept ?? null, aufgabeVon: auftrag.id };
  if (lauf.wiederholung) {
    return {
      ...basis,
      art: 'wiederholung',
      konzept: lauf.wiederholung.konzept,
      aufgabeId: lauf.wiederholung.aufgabe,
      aufgabeVon: lauf.wiederholung.auftrag ?? auftrag.id,
    };
  }
  if (lauf.schritt === 'aha') return { ...basis, art: 'aha' };
  if (lauf.schritt === 'frei') {
    const nochmal = Array.isArray(lauf.nochmal) ? lauf.nochmal : [];
    return {
      ...basis,
      art: runde.art === 'misch' ? 'misch' : 'frei',
      aufgabeId: lauf.reihe[0],
      // Diese Situation kam schon einmal und hat nicht gezählt.
      schonGesehen: runde.art !== 'misch' && nochmal.includes(lauf.reihe[0]),
    };
  }
  const schritt = runde[lauf.schritt];
  return {
    ...basis,
    art: lauf.schritt,
    aufgabeId: schritt.aufgabe,
    nurTeile: lauf.schritt === 'probieren' ? schritt.nurTeile ?? null : null,
    vorgabe: lauf.schritt === 'luecke' ? schritt.vorgabe ?? [] : [],
  };
}

// Geht von Probieren zu Aha, Beispiel, Lücke und Frei. Beim Aha wird der Lexikon-Eintrag freigeschaltet.
export function weiter(stand, auftrag) {
  const lauf = stand.lauf;
  const stelle = SCHRITTE.indexOf(lauf.schritt);
  if (lauf.wiederholung || stelle < 0 || stelle >= SCHRITTE.length - 1) return stand;
  const naechster = SCHRITTE[stelle + 1];
  const konzept = auftrag.runden[lauf.runde].konzept;
  const lexikon = naechster === 'aha' && !stand.lexikon.includes(konzept)
    ? [...stand.lexikon, konzept]
    : stand.lexikon;
  return { ...stand, lexikon, lauf: { ...lauf, schritt: naechster } };
}

function beendeRunde(stand, auftrag, regeln, alle) {
  const runde = auftrag.runden[stand.lauf.runde];
  const rundenZaehler = stand.rundenZaehler + 1;
  let fortschritt = stand.fortschritt;
  if (runde.konzept) {
    const eintrag = fortschritt[runde.konzept];
    fortschritt = {
      ...fortschritt,
      [runde.konzept]: { ...eintrag, faelligBei: rundenZaehler + naechsterAbstand(eintrag, regeln) },
    };
  }
  const basis = { ...stand, rundenZaehler, fortschritt };
  const naechste = stand.lauf.runde + 1;
  if (naechste >= auftrag.runden.length) {
    return {
      stand: {
        ...basis,
        lauf: null,
        erledigt: [...stand.erledigt, auftrag.id],
        // Wer nachfüllen musste, hat nichts gespart. Das ist die einzige Folge.
        gespart: stand.lauf.tokens == null
          ? stand.gespart ?? {}
          : { ...stand.gespart, [auftrag.id]: stand.lauf.nachgeschoben ? 0 : stand.lauf.tokens },
      },
      ereignis: 'auftragFertig',
    };
  }
  return { stand: betrittRunde(basis, auftrag, regeln, naechste, alle), ereignis: 'rundeFertig' };
}

// Verbucht eine freie Situation.
//   ok:     Die Lösung war am Ende richtig.
//   zaehlt: Sie war beim ersten Versuch und ohne Hilfe richtig (nur das zählt für die Meisterschaft).
export function verbucheFrei(stand, auftrag, regeln, { ok, zaehlt }, alle) {
  const lauf = stand.lauf;
  const runde = auftrag.runden[lauf.runde];
  const [aktuell, ...rest] = lauf.reihe;

  if (runde.art === 'misch') {
    // In der Mischrunde muss jede Aufgabe gelöst werden, beliebig viele Versuche.
    const reihe = ok ? rest : lauf.reihe;
    const neu = { ...stand, lauf: { ...lauf, reihe } };
    return reihe.length === 0 ? beendeRunde(neu, auftrag, regeln, alle) : { stand: neu, ereignis: 'weiter' };
  }

  const vorher = stand.fortschritt[runde.konzept] ?? neuerFortschritt();
  const nachher = verbucheVersuch(vorher, { situation: aktuell, richtig: ok && zaehlt });
  const gezaehlt = nachher !== vorher;
  // Nicht gezählte Situationen wandern ans Ende der Reihe und kommen später nochmals.
  const reihe = gezaehlt ? rest : [...rest, aktuell];
  // Für Hinweis und Ausweg (E-047): welche Situationen schon einmal nicht gezählt haben,
  // und wie viele Situationen seit dem letzten Erfolg nicht gezählt haben.
  const nochmalVorher = Array.isArray(lauf.nochmal) ? lauf.nochmal : [];
  const nochmal = gezaehlt
    ? nochmalVorher.filter((id) => id !== aktuell)
    : [...new Set([...nochmalVorher, aktuell])];
  const ohneFortschritt = gezaehlt ? 0 : (Number.isInteger(lauf.ohneFortschritt) ? lauf.ohneFortschritt : 0) + 1;
  const neu = {
    ...stand,
    fortschritt: { ...stand.fortschritt, [runde.konzept]: nachher },
    lauf: { ...lauf, reihe, nochmal, ohneFortschritt },
  };
  return istGemeistert(nachher, regeln) ? beendeRunde(neu, auftrag, regeln, alle) : { stand: neu, ereignis: 'weiter' };
}

// Ausweg (E-047): Wer in einer Konzept-Runde so viele Situationen nacheinander nicht zählen konnte,
// wie die Runde mal «durchgaengeBisAusweg» hat, darf weitergehen. Fehlt der Wert, gibt es keinen Ausweg.
export function auswegOffen(stand, auftrag, regeln) {
  const lauf = stand.lauf;
  if (!lauf || lauf.wiederholung || lauf.schritt !== 'frei') return false;
  const runde = auftrag.runden[lauf.runde];
  if (!runde?.konzept || !Number.isInteger(regeln.durchgaengeBisAusweg)) return false;
  const ohneFortschritt = Number.isInteger(lauf.ohneFortschritt) ? lauf.ohneFortschritt : 0;
  return ohneFortschritt >= regeln.durchgaengeBisAusweg * runde.frei.length;
}

// Verlässt die Runde über den Ausweg. Das Konzept ist nicht gemeistert, sondern wird nachgeholt:
// Es kommt als Wiederholung wieder, und jede richtige Wiederholung zählt für die Meisterschaft.
export function ueberspringeRunde(stand, auftrag, regeln, alle) {
  if (!auswegOffen(stand, auftrag, regeln)) return { stand, ereignis: 'weiter' };
  const { konzept } = auftrag.runden[stand.lauf.runde];
  const eintrag = { ...(stand.fortschritt[konzept] ?? neuerFortschritt()), nachholen: true, wiederholungsStufe: 0 };
  const ergebnis = beendeRunde({ ...stand, fortschritt: { ...stand.fortschritt, [konzept]: eintrag } }, auftrag, regeln, alle);
  return { ...ergebnis, ereignis: ergebnis.ereignis === 'rundeFertig' ? 'rundeVerschoben' : ergebnis.ereignis };
}

// Verbucht die Wiederholung eines früheren Konzepts. Gelungen: Abstand wächst. Misslungen: kommt früher wieder.
// Ein Konzept, das nachgeholt wird (E-047): Jede richtige Wiederholung zählt als gelöste Situation.
// Ist es damit gemeistert, gilt ab dann der normale Wiederholungsplan. Sonst kommt es nach der nächsten Runde wieder.
export function verbucheWiederholungsErgebnis(stand, regeln, richtig) {
  const { konzept, aufgabe } = stand.lauf.wiederholung;
  const alt = stand.fortschritt[konzept] ?? neuerFortschritt();
  if (alt.nachholen) {
    const gezaehlt = verbucheVersuch(alt, { situation: aufgabe, richtig });
    const { nachholen, ...ohne } = gezaehlt;
    const eintrag = istGemeistert(gezaehlt, regeln) ? { ...ohne, wiederholungsStufe: 0 } : gezaehlt;
    const abstand = eintrag.nachholen ? regeln.wiederholungsAbstaende[0] : naechsterAbstand(eintrag, regeln);
    return {
      ...stand,
      fortschritt: { ...stand.fortschritt, [konzept]: { ...eintrag, faelligBei: stand.rundenZaehler + (abstand ?? 1) } },
      lauf: { ...stand.lauf, wiederholung: null },
    };
  }
  const eintrag = verbucheWiederholung(alt, richtig);
  const abstand = naechsterAbstand(eintrag, regeln);
  return {
    ...stand,
    fortschritt: {
      ...stand.fortschritt,
      [konzept]: { ...eintrag, faelligBei: abstand == null ? null : stand.rundenZaehler + abstand },
    },
    lauf: { ...stand.lauf, wiederholung: null },
  };
}

// Zieht die Kosten eines Tests vom Token-Budget des Auftrags ab.
// Das Budget kann nie zur Sackgasse werden: Ist es leer, füllt die Kundschaft zur Hälfte nach.
export function verbraucheTokens(stand, auftrag, anzahl) {
  const lauf = stand.lauf;
  if (!lauf || lauf.tokens == null) return { stand, nachgeschoben: false };
  const rest = lauf.tokens - anzahl;
  if (rest > 0) return { stand: { ...stand, lauf: { ...lauf, tokens: rest } }, nachgeschoben: false };
  const nachfuellung = Math.ceil((auftrag.tokenBudget ?? 0) / 2);
  return { stand: { ...stand, lauf: { ...lauf, tokens: nachfuellung, nachgeschoben: true } }, nachgeschoben: true };
}
