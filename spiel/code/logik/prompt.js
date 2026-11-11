// Setzt den Prompt so zusammen, wie ihn der Spieler gebaut hat:
// Grundprompt, dann die gewählten Sätze, am Schluss die gewählten Beispiele.
export function bauePrompt(aufgabe, auswahl = [], beispielVorsatz = '') {
  const gewaehlt = aufgabe.teile.filter((teil) => auswahl.includes(teil.id));
  const saetze = gewaehlt.filter((teil) => teil.art !== 'beispiel').map((teil) => teil.text);
  const beispiele = gewaehlt.filter((teil) => teil.art === 'beispiel').map((teil) => teil.text);
  const teile = [aufgabe.grundprompt, ...saetze];
  if (beispiele.length > 0) teile.push(`${beispielVorsatz} ${beispiele.join(', ')}`.trim());
  return teile.join(' ');
}
