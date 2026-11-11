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
  return aufgabe.teile.some((teil) => teil.art === 'rolle');
}
