// Prüft die Lerninhalte automatisch. Aufruf: npm run inhalte
// Gibt eine Liste von Fehlern zurück. Leere Liste = alles in Ordnung.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const STANDARD_ORDNER = fileURLToPath(new URL('../spiel/inhalte/', import.meta.url));

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
      if (!texte) continue;
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

      const demo = await lies(ordner, `${sprache}/demo.json`, fehler);
      if (demo) pruefeAufgabe(demo, `${sprache}/demo.json`, fehler);
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

// Jede nötige Zutat braucht mehrere Fehlbilder und einen erklärenden Hinweis.
export function pruefeAufgabe(aufgabe, name, fehler) {
  if (!istText(aufgabe.grundprompt)) fehler.push(`${name}: grundprompt fehlt`);
  if (!Array.isArray(aufgabe.erfolg) || aufgabe.erfolg.length < 1) fehler.push(`${name}: mindestens ein Erfolgstext nötig`);
  for (const zutat of aufgabe.zutaten ?? []) {
    if (!istText(zutat.name) || !istText(zutat.text)) fehler.push(`${name}: Zutat «${zutat.id}» braucht name und text`);
    if (zutat.noetig === false) continue;
    if ((aufgabe.fehlbilder?.[zutat.id] ?? []).length < 2) {
      fehler.push(`${name}: Zutat «${zutat.id}» braucht mindestens zwei Fehlbilder`);
    }
    if (!istText(aufgabe.hinweise?.[zutat.id])) fehler.push(`${name}: Zutat «${zutat.id}» braucht einen Hinweis`);
  }
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
