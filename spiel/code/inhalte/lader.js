// Lädt die Lerninhalte. Inhalte sind Daten (JSON), kein Programmcode.
const BASIS = new URL('../../inhalte/', import.meta.url);

// Die Aufträge in Spielreihenfolge. Neue Aufträge werden hier eingetragen.
export const AUFTRAEGE = ['baeckerei'];

async function ladeJson(pfad) {
  const antwort = await fetch(new URL(pfad, BASIS));
  if (!antwort.ok) throw new Error(`Inhalt fehlt: ${pfad}`);
  return antwort.json();
}

export async function ladeInhalte(sprache = 'de') {
  const [regeln, lehrplan, texte, lexikon, ...auftraege] = await Promise.all([
    ladeJson('regeln.json'),
    ladeJson('lehrplan.json'),
    ladeJson(`${sprache}/texte.json`),
    ladeJson(`${sprache}/lexikon.json`),
    ...AUFTRAEGE.map((id) => ladeJson(`${sprache}/auftraege/${id}.json`)),
  ]);
  return { regeln, lehrplan, texte, lexikon, auftraege };
}
