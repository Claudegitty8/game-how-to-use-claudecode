// Setzt zusammen, was der Spieler gebaut hat.
//
// System-Prompt: Rolle und Dauerregeln. Er gilt für jede Nachricht.
// Prompt: Grundprompt, dann die gewählten Sätze, am Schluss die gewählten Beispiele.

// Alle Arten von Teilen, in der Reihenfolge, in der die Werkbank sie zeigt.
export const ARTEN = ['rolle', 'zettel', 'tool', 'stecker', 'karte', 'recht', 'prompt', 'feld', 'kontext', 'absicherung', 'beispiel'];

// Diese Teile gelten dauernd (System-Prompt oder CLAUDE.md). Sie stehen in einem eigenen Feld.
const DAUERND = ['rolle', 'zettel'];
// Diese Teile sind kein Text der Nachricht: Werkzeuge, Connectors, Skills und Rechte werden eingestellt, nicht geschrieben.
const EINSTELLUNGEN = ['tool', 'stecker', 'karte', 'recht'];

export function baueSystemPrompt(aufgabe, auswahl = []) {
  return aufgabe.teile
    .filter((teil) => DAUERND.includes(teil.art) && auswahl.includes(teil.id))
    .map((teil) => teil.text)
    .join(' ');
}

export function bauePrompt(aufgabe, auswahl = [], beispielVorsatz = '') {
  const gewaehlt = aufgabe.teile.filter((teil) => auswahl.includes(teil.id) && !DAUERND.includes(teil.art) && !EINSTELLUNGEN.includes(teil.art));
  const saetze = gewaehlt.filter((teil) => teil.art !== 'beispiel').map((teil) => teil.text);
  const beispiele = gewaehlt.filter((teil) => teil.art === 'beispiel').map((teil) => teil.text);
  const teile = [aufgabe.grundprompt, ...saetze];
  if (beispiele.length > 0) teile.push(`${beispielVorsatz} ${beispiele.join(', ')}`.trim());
  return teile.join(' ');
}

export function hatSystemPrompt(aufgabe) {
  return (aufgabe.teile ?? []).some((teil) => DAUERND.includes(teil.art));
}

// Geht es um die Datei CLAUDE.md statt um einen System-Prompt?
export function hatZettel(aufgabe) {
  return (aufgabe.teile ?? []).some((teil) => teil.art === 'zettel');
}

// Spiel-Tokens: ein Spielwert, damit Länge spürbar kostet. Das ist keine echte Token-Zählung.
export function schaetzeSpielTokens(text) {
  const woerter = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(woerter * 1.3));
}

// So viele Spiel-Tokens schickt der Spieler: Grundprompt plus alle angesteckten Teile.
// Grosse Dokumente tragen ihre Grösse als festen Wert (teil.tokens).
export function zaehleTokens(aufgabe, auswahl = []) {
  if (aufgabe.typ === 'wahl' || aufgabe.typ === 'reihe') return schaetzeSpielTokens(aufgabe.frage);
  return aufgabe.teile
    .filter((teil) => auswahl.includes(teil.id))
    .reduce((summe, teil) => summe + (teil.tokens ?? schaetzeSpielTokens(teil.text)), schaetzeSpielTokens(aufgabe.grundprompt));
}
