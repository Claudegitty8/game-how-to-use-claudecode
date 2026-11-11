// Setzt zusammen, was der Spieler gebaut hat.
//
// System-Prompt: Rolle und Dauerregeln. Er gilt für jede Nachricht.
// Prompt: Grundprompt, dann die gewählten Sätze, am Schluss die gewählten Beispiele.

export function baueSystemPrompt(aufgabe, auswahl = []) {
  return aufgabe.teile
    .filter((teil) => teil.art === 'rolle' && auswahl.includes(teil.id))
    .map((teil) => teil.text)
    .join(' ');
}

export function bauePrompt(aufgabe, auswahl = [], beispielVorsatz = '') {
  const gewaehlt = aufgabe.teile.filter((teil) => auswahl.includes(teil.id) && teil.art !== 'rolle');
  const saetze = gewaehlt.filter((teil) => teil.art !== 'beispiel').map((teil) => teil.text);
  const beispiele = gewaehlt.filter((teil) => teil.art === 'beispiel').map((teil) => teil.text);
  const teile = [aufgabe.grundprompt, ...saetze];
  if (beispiele.length > 0) teile.push(`${beispielVorsatz} ${beispiele.join(', ')}`.trim());
  return teile.join(' ');
}

export function hatSystemPrompt(aufgabe) {
  return (aufgabe.teile ?? []).some((teil) => teil.art === 'rolle');
}

// Spiel-Tokens: ein Spielwert, damit Länge spürbar kostet. Das ist keine echte Token-Zählung.
export function schaetzeSpielTokens(text) {
  const woerter = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(woerter * 1.3));
}

// So viele Spiel-Tokens schickt der Spieler: Grundprompt plus alle angesteckten Teile.
// Grosse Dokumente tragen ihre Grösse als festen Wert (teil.tokens).
export function zaehleTokens(aufgabe, auswahl = []) {
  if (aufgabe.typ === 'wahl') return schaetzeSpielTokens(aufgabe.frage);
  return aufgabe.teile
    .filter((teil) => auswahl.includes(teil.id))
    .reduce((summe, teil) => summe + (teil.tokens ?? schaetzeSpielTokens(teil.text)), schaetzeSpielTokens(aufgabe.grundprompt));
}
