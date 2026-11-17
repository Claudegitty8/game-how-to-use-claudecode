// Abkürzungen im Text finden. Reine Logik, damit Oberfläche und Inhaltsprüfung dieselbe Regel benutzen.
// Gesucht werden Wörter aus 2 bis 6 Grossbuchstaben (auch mit Mehrzahl-s wie «APIs») und Dateinamen wie «CLAUDE.md».

// Ränder mit Unicode-Buchstaben prüfen, damit «SCHLÜSSEL» nicht als «SCHLÜ» erkannt wird.
const MUSTER = /(?<![\p{L}\d_])([A-ZÄÖÜ]{2,6})(s?)(\.md)?(?![\p{L}\d_])/gu;

// Liefert alle Fundstellen: { start, ende, wort, schluessel }.
// schluessel ist der Eintrag in der Liste der Abkürzungen (ohne Mehrzahl-s), oder null, wenn er fehlt.
// Wörter aus der Liste «betonung» (zum Beispiel «NICHT») sind Hervorhebungen und werden übersprungen.
export function findeAbkuerzungen(text, { eintraege = {}, betonung = [] } = {}) {
  const funde = [];
  for (const treffer of String(text).matchAll(MUSTER)) {
    const [ganz, kern, , datei] = treffer;
    if (betonung.includes(kern)) continue;
    const schluessel = datei ? `${kern}${datei}` : kern;
    funde.push({ start: treffer.index, ende: treffer.index + ganz.length, wort: ganz, schluessel: eintraege[schluessel] ? schluessel : null });
  }
  return funde;
}

// Merkt sich, welche Abkürzungen der Spieler schon mit Langform gesehen hat. Gibt einen neuen Stand zurück.
export function merkeAbkuerzungen(stand, schluessel) {
  const bekannt = stand.abkuerzungen ?? [];
  const neu = schluessel.filter((id) => !bekannt.includes(id));
  return neu.length === 0 ? stand : { ...stand, abkuerzungen: [...bekannt, ...neu] };
}
