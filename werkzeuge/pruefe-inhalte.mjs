// Prüft die Lerninhalte automatisch. Aufruf: npm run inhalte
// Gibt eine Liste von Fehlern zurück. Leere Liste = alles in Ordnung.
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { bewerte } from '../spiel/code/logik/bewertung.js';
import { ARTEN } from '../spiel/code/logik/prompt.js';

const STANDARD_ORDNER = fileURLToPath(new URL('../spiel/inhalte/', import.meta.url));
const MAX_WOERTER = 40; // Leitlinie B7: kein Textblock über 40 Wörter

async function lies(ordner, datei, fehler) {
  try {
    return JSON.parse(await readFile(path.join(ordner, datei), 'utf8'));
  } catch (grund) {
    fehler.push(`${datei}: nicht lesbar (${grund.message})`);
    return null;
  }
}

function istText(wert) {
  return typeof wert === 'string' && wert.trim().length > 0;
}

function zuLang(text) {
  return istText(text) && text.trim().split(/\s+/).length > MAX_WOERTER;
}

// Alle Teilmengen einer kleinen Liste (für «Probieren muss immer Quatsch ergeben»).
function teilmengen(liste) {
  return liste.reduce((mengen, eintrag) => [...mengen, ...mengen.map((menge) => [...menge, eintrag])], [[]]);
}

export async function pruefeInhalte(ordner = STANDARD_ORDNER, sprachen = ['de']) {
  const fehler = [];
  const regeln = await lies(ordner, 'regeln.json', fehler);
  const lehrplan = await lies(ordner, 'lehrplan.json', fehler);
  const fakten = await lies(ordner, 'fakten.json', fehler);

  if (regeln) {
    if (!Number.isInteger(regeln.erfolgeFuerMeisterschaft) || regeln.erfolgeFuerMeisterschaft < 1) {
      fehler.push('regeln.json: erfolgeFuerMeisterschaft muss eine ganze Zahl ab 1 sein');
    }
    const abstaende = regeln.wiederholungsAbstaende ?? [];
    if (abstaende.length === 0 || abstaende.some((a, i) => i > 0 && a <= abstaende[i - 1])) {
      fehler.push('regeln.json: wiederholungsAbstaende müssen wachsen');
    }
  }

  if (lehrplan) {
    const kapitelIds = new Set(lehrplan.kapitel.map((k) => k.id));
    const gesehen = new Set();
    let letztesKapitel = 0;
    for (const konzept of lehrplan.konzepte) {
      if (gesehen.has(konzept.id)) fehler.push(`lehrplan.json: Konzept «${konzept.id}» ist doppelt`);
      if (!kapitelIds.has(konzept.kapitel)) fehler.push(`lehrplan.json: «${konzept.id}» hat ein unbekanntes Kapitel`);
      if (konzept.kapitel < letztesKapitel) fehler.push(`lehrplan.json: «${konzept.id}» steht nicht in Kapitel-Reihenfolge`);
      for (const voraussetzung of konzept.braucht ?? []) {
        // Ein Konzept darf nur auf Konzepte bauen, die vorher eingeführt wurden.
        if (!gesehen.has(voraussetzung)) {
          fehler.push(`lehrplan.json: «${konzept.id}» braucht «${voraussetzung}», das nicht vorher kommt`);
        }
      }
      gesehen.add(konzept.id);
      letztesKapitel = konzept.kapitel;
    }

    for (const sprache of sprachen) {
      const texte = await lies(ordner, `${sprache}/texte.json`, fehler);
      const lexikon = await lies(ordner, `${sprache}/lexikon.json`, fehler);
      if (!texte || !lexikon) continue;

      for (const kapitel of lehrplan.kapitel) {
        const eintrag = texte.kapitel?.[kapitel.id];
        if (!istText(eintrag?.name) || !istText(eintrag?.thema)) {
          fehler.push(`${sprache}/texte.json: Kapitel ${kapitel.id} braucht name und thema`);
        }
      }
      for (const konzept of lehrplan.konzepte) {
        const eintrag = texte.konzepte?.[konzept.id];
        if (!istText(eintrag?.name) || !istText(eintrag?.analogie)) {
          fehler.push(`${sprache}/texte.json: Konzept «${konzept.id}» braucht name und analogie`);
        }
      }
      for (const [id, eintrag] of Object.entries(lexikon)) {
        const name = `${sprache}/lexikon.json «${id}»`;
        if (!istText(eintrag.begriff) || !istText(eintrag.erklaerung)) fehler.push(`${name}: braucht begriff und erklaerung`);
        if (eintrag.kern && !gesehen.has(eintrag.kern)) fehler.push(`${name}: unbekanntes Kernkonzept`);
        for (const feld of ['erklaerung', 'quatsch', 'genauer']) {
          if (zuLang(eintrag[feld])) fehler.push(`${name}: ${feld} hat mehr als ${MAX_WOERTER} Wörter`);
        }
      }

      // Zierde fürs Studio: Jedes Ding braucht einen Preis und einen Namen.
      const einrichtung = await lies(ordner, 'einrichtung.json', fehler);
      for (const ding of einrichtung?.dinge ?? []) {
        if (!(Number.isInteger(ding.preis) && ding.preis > 0)) fehler.push(`einrichtung.json: «${ding.id}» braucht einen Preis`);
        if (!istText(texte.app?.einrichtung?.[ding.id])) fehler.push(`${sprache}/texte.json: Name für «${ding.id}» fehlt`);
      }
      // Freiwillige Fragen: genau eine richtige Antwort pro Frage.
      const umfrage = await lies(ordner, `${sprache}/umfrage.json`, fehler);
      for (const frage of umfrage?.fragen ?? []) {
        const name = `${sprache}/umfrage.json «${frage.id}»`;
        if (!istText(frage.frage) || zuLang(frage.frage)) fehler.push(`${name}: frage fehlt oder ist zu lang`);
        if ((frage.optionen ?? []).filter((o) => o.richtig).length !== 1) fehler.push(`${name}: genau eine Antwort muss richtig sein`);
        if ((frage.optionen ?? []).some((o) => !istText(o.text))) fehler.push(`${name}: Antwort ohne text`);
      }

      let dateien = [];
      try {
        dateien = (await readdir(path.join(ordner, sprache, 'auftraege'))).filter((d) => d.endsWith('.json'));
      } catch {
        fehler.push(`${sprache}/auftraege: Ordner fehlt`);
      }
      for (const datei of dateien) {
        const name = `${sprache}/auftraege/${datei}`;
        const auftrag = await lies(ordner, name, fehler);
        if (auftrag) pruefeAuftrag(auftrag, name, { regeln, konzepte: gesehen, texte, lexikon }, fehler);
      }
    }
  }

  if (fakten) {
    for (const fakt of fakten.fakten ?? []) {
      if (!istText(fakt.id) || !istText(fakt.aussage)) fehler.push('fakten.json: Eintrag ohne id oder aussage');
      if (!/^https:\/\//.test(fakt.quelle ?? '')) fehler.push(`fakten.json: «${fakt.id}» braucht eine Quelle (https)`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fakt.geprueft ?? '')) fehler.push(`fakten.json: «${fakt.id}» braucht ein Prüfdatum (JJJJ-MM-TT)`);
    }
  }

  return fehler;
}

export function pruefeAuftrag(auftrag, name, { regeln, konzepte, texte, lexikon }, fehler) {
  for (const feld of ['id', 'kunde', 'wunsch', 'kundenstimme', 'ueberraschung']) {
    if (!istText(auftrag[feld])) fehler.push(`${name}: ${feld} fehlt`);
    if (zuLang(auftrag[feld])) fehler.push(`${name}: ${feld} hat mehr als ${MAX_WOERTER} Wörter`);
  }
  for (const id of auftrag.lexikon ?? []) {
    if (!lexikon[id]) fehler.push(`${name}: Lexikon-Eintrag «${id}» fehlt`);
  }
  const aufgaben = auftrag.aufgaben ?? {};
  const benutzt = new Set();
  const kennt = (id, wo) => {
    benutzt.add(id);
    if (!aufgaben[id]) fehler.push(`${name}: ${wo} verweist auf unbekannte Aufgabe «${id}»`);
    return aufgaben[id];
  };

  for (const runde of auftrag.runden ?? []) {
    const wo = `${name} Runde ${runde.id}`;
    const mindestens = runde.art === 'misch' ? 1 : (regeln?.erfolgeFuerMeisterschaft ?? 3) + 1;
    if ((runde.frei ?? []).length < mindestens) fehler.push(`${wo}: braucht mindestens ${mindestens} freie Situationen`);
    for (const id of runde.frei ?? []) kennt(id, wo);

    if (runde.art === 'misch') {
      if (!istText(runde.titel)) fehler.push(`${wo}: Mischrunde braucht einen titel`);
      continue;
    }
    // Jede Konzept-Runde hat alle fünf Schritte: Probieren, Aha, Beispiel, Lücke, Frei.
    if (!konzepte.has(runde.konzept)) fehler.push(`${wo}: unbekanntes Konzept «${runde.konzept}»`);
    const konzeptText = texte.konzepte?.[runde.konzept];
    const aha = konzeptText?.aha ?? [];
    if (aha.length < 1 || aha.length > 3) fehler.push(`${wo}: Aha braucht ein bis drei Sätze`);
    if (!istText(konzeptText?.tipp)) fehler.push(`${wo}: Konzept «${runde.konzept}» braucht einen tipp`);
    if (lexikon[runde.konzept]?.kern !== runde.konzept) fehler.push(`${wo}: Lexikon-Eintrag für «${runde.konzept}» fehlt`);

    const probieren = kennt(runde.probieren?.aufgabe, `${wo} Probieren`);
    if (probieren) {
      // Beim Probieren muss jede mögliche Auswahl Quatsch ergeben.
      for (const menge of teilmengen(runde.probieren.nurTeile ?? [])) {
        if (bewerte(probieren, menge).ok) fehler.push(`${wo}: Probieren lässt sich lösen (${menge.join(', ')})`);
      }
    }
    kennt(runde.beispiel?.aufgabe, `${wo} Beispiel`);
    const luecke = kennt(runde.luecke?.aufgabe, `${wo} Lücke`);
    if (luecke) {
      const vorgabe = runde.luecke.vorgabe ?? [];
      if (vorgabe.some((id) => !luecke.loesung?.includes(id))) fehler.push(`${wo}: Vorgabe der Lücke gehört nicht zur Lösung`);
      if (bewerte(luecke, vorgabe).ok) fehler.push(`${wo}: Die Lücke ist schon gelöst`);
    }
  }

  for (const [id, aufgabe] of Object.entries(aufgaben)) {
    if (!benutzt.has(id)) fehler.push(`${name}: Aufgabe «${id}» wird nirgends verwendet`);
    pruefeAufgabe(aufgabe, `${name} Aufgabe ${id}`, fehler);
  }
}

// Eine Aufgabe ist in Ordnung, wenn ihre Lösung besteht, ein leerer Prompt scheitert
// und jedes Fehlbild mehrere Varianten und einen erklärenden Hinweis hat.
export function pruefeAufgabe(aufgabe, name, fehler) {
  if (aufgabe.typ === 'wahl') {
    pruefeWahl(aufgabe, name, fehler);
    return;
  }
  if (aufgabe.typ === 'reihe') {
    pruefeReihe(aufgabe, name, fehler);
    return;
  }
  if (!istText(aufgabe.wunsch)) fehler.push(`${name}: wunsch fehlt`);
  if (!istText(aufgabe.grundprompt)) fehler.push(`${name}: grundprompt fehlt`);
  if (!Array.isArray(aufgabe.erfolg) || aufgabe.erfolg.length < 1) fehler.push(`${name}: mindestens ein Erfolgstext nötig`);

  const ids = new Set();
  for (const teil of aufgabe.teile ?? []) {
    if (ids.has(teil.id)) fehler.push(`${name}: Teil «${teil.id}» ist doppelt`);
    ids.add(teil.id);
    if (!istText(teil.text)) fehler.push(`${name}: Teil «${teil.id}» braucht einen text`);
    if (!ARTEN.includes(teil.art)) fehler.push(`${name}: Teil «${teil.id}» hat eine unbekannte art`);
    if ('ampel' in teil && !['gruen', 'gelb', 'rot'].includes(teil.ampel)) fehler.push(`${name}: Teil «${teil.id}» hat eine unbekannte ampel`);
  }

  const fehlbilder = aufgabe.fehlbilder ?? {};
  const erreichbar = new Set();
  for (const pruefung of aufgabe.pruefungen ?? []) {
    erreichbar.add(pruefung.fehlbild);
    if (!fehlbilder[pruefung.fehlbild]) fehler.push(`${name}: Fehlbild «${pruefung.fehlbild}» fehlt`);
    const genannt = [...(pruefung.wenn.gewaehlt ?? []), ...(pruefung.wenn.fehlt ?? []), ...(pruefung.wenn.aus ?? [])];
    if ('tokensUeber' in pruefung.wenn && !Number.isInteger(pruefung.wenn.tokensUeber)) fehler.push(`${name}: tokensUeber muss eine ganze Zahl sein`);
    for (const id of genannt) {
      if (!ids.has(id)) fehler.push(`${name}: Prüfung nennt unbekanntes Teil «${id}»`);
    }
  }
  for (const [id, fehlbild] of Object.entries(fehlbilder)) {
    if (!erreichbar.has(id)) fehler.push(`${name}: Fehlbild «${id}» wird von keiner Prüfung benutzt`);
    if ((fehlbild.texte ?? []).length < 2) fehler.push(`${name}: Fehlbild «${id}» braucht mindestens zwei Varianten`);
    if (!istText(fehlbild.hinweis)) fehler.push(`${name}: Fehlbild «${id}» braucht einen Hinweis`);
    if ('ausgabeTokens' in fehlbild && !(Number.isInteger(fehlbild.ausgabeTokens) && fehlbild.ausgabeTokens > 0)) fehler.push(`${name}: Fehlbild «${id}» hat ungültige ausgabeTokens`);
  }

  // Budget und Kontextfenster müssen zu den Prüfungen passen, sonst zeigt die Anzeige etwas anderes als die Bewertung.
  const grenzen = (aufgabe.pruefungen ?? []).map((pruefung) => pruefung.wenn.tokensUeber).filter(Number.isInteger);
  for (const feld of ['budget', 'fenster', 'eng']) {
    if (feld in aufgabe && !grenzen.includes(aufgabe[feld])) fehler.push(`${name}: ${feld} hat keine passende Prüfung tokensUeber`);
  }
  for (const teil of aufgabe.teile ?? []) {
    if ('tokens' in teil && !(Number.isInteger(teil.tokens) && teil.tokens > 0)) fehler.push(`${name}: Teil «${teil.id}» hat ungültige tokens`);
  }

  const loesung = aufgabe.loesung ?? [];
  if (loesung.some((id) => !ids.has(id))) fehler.push(`${name}: Lösung nennt ein unbekanntes Teil`);
  if (aufgabe.pruefungen) {
    if (!bewerte(aufgabe, loesung).ok) fehler.push(`${name}: Die Lösung besteht die eigenen Prüfungen nicht`);
    if (bewerte(aufgabe, []).ok) fehler.push(`${name}: Ein leerer Prompt gilt als richtig`);
  } else {
    fehler.push(`${name}: pruefungen fehlen`);
  }

  const texte = [
    aufgabe.wunsch, aufgabe.grundprompt, ...(aufgabe.erfolg ?? []),
    ...(aufgabe.teile ?? []).map((teil) => teil.text),
    ...Object.values(fehlbilder).flatMap((fehlbild) => [...(fehlbild.texte ?? []), fehlbild.hinweis]),
  ];
  if (texte.some(zuLang)) fehler.push(`${name}: Ein Text hat mehr als ${MAX_WOERTER} Wörter`);
}

// Übungsform «Sortieren»: mindestens drei Schritte, die Lösung nennt jeden genau einmal,
// und die gezeigte Anfangsreihenfolge ist noch nicht die Lösung.
function pruefeReihe(aufgabe, name, fehler) {
  for (const feld of ['wunsch', 'frage', 'kiwi']) {
    if (!istText(aufgabe[feld])) fehler.push(`${name}: ${feld} fehlt`);
  }
  const schritte = aufgabe.schritte ?? [];
  const ids = schritte.map((schritt) => schritt.id);
  if (schritte.length < 3) fehler.push(`${name}: mindestens drei Schritte nötig`);
  if (schritte.some((schritt) => !istText(schritt.text))) fehler.push(`${name}: Schritt ohne text`);
  const loesung = aufgabe.loesung ?? [];
  if (new Set(ids).size !== ids.length || loesung.length !== ids.length || [...loesung].sort().join() !== [...ids].sort().join()) {
    fehler.push(`${name}: Die Lösung muss jeden Schritt genau einmal nennen`);
  }
  if (bewerte(aufgabe, ids).ok) fehler.push(`${name}: Die Schritte stehen schon in der richtigen Reihenfolge`);
  if (!bewerte(aufgabe, loesung).ok) fehler.push(`${name}: Die Lösung besteht nicht`);
  if ((aufgabe.daneben?.texte ?? []).length < 2 || !istText(aufgabe.daneben?.hinweis)) fehler.push(`${name}: daneben braucht zwei Varianten und einen Hinweis`);
  const texte = [aufgabe.wunsch, aufgabe.frage, aufgabe.kiwi, ...schritte.map((s) => s.text), ...(aufgabe.daneben?.texte ?? []), aufgabe.daneben?.hinweis];
  if (texte.some(zuLang)) fehler.push(`${name}: Ein Text hat mehr als ${MAX_WOERTER} Wörter`);
}

// Übungsform «Vorhersagen»: genau eine richtige Antwort, jede Antwort mit Erklärung.
function pruefeWahl(aufgabe, name, fehler) {
  for (const feld of ['wunsch', 'frage', 'kiwi']) {
    if (!istText(aufgabe[feld])) fehler.push(`${name}: ${feld} fehlt`);
  }
  const optionen = aufgabe.optionen ?? [];
  if (optionen.length < 2) fehler.push(`${name}: mindestens zwei Antworten nötig`);
  const richtige = optionen.filter((option) => option.richtig);
  if (richtige.length !== 1) fehler.push(`${name}: genau eine Antwort muss richtig sein`);
  if (new Set(optionen.map((option) => option.id)).size !== optionen.length) fehler.push(`${name}: Antwort doppelt`);
  for (const option of optionen) {
    if (!istText(option.text) || !istText(option.hinweis)) fehler.push(`${name}: Antwort «${option.id}» braucht text und hinweis`);
  }
  if (aufgabe.loesung?.length !== 1 || aufgabe.loesung[0] !== richtige[0]?.id) fehler.push(`${name}: loesung muss die richtige Antwort nennen`);
  for (const anteil of aufgabe.anteile ?? []) {
    if (!istText(anteil.wort) || ![1, 2, 3].includes(anteil.stufe)) fehler.push(`${name}: anteile brauchen wort und stufe 1 bis 3`);
  }
  const texte = [aufgabe.wunsch, aufgabe.frage, aufgabe.kiwi, ...optionen.flatMap((option) => [option.text, option.hinweis])];
  if (texte.some(zuLang)) fehler.push(`${name}: Ein Text hat mehr als ${MAX_WOERTER} Wörter`);
}

// Direkter Aufruf von der Kommandozeile
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const fehler = await pruefeInhalte();
  if (fehler.length === 0) {
    console.log('Lerninhalte: alles in Ordnung.');
  } else {
    console.error(`Lerninhalte: ${fehler.length} Fehler gefunden.`);
    for (const zeile of fehler) console.error(` - ${zeile}`);
    process.exit(1);
  }
}
