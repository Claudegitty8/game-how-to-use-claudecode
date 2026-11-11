// Lädt die Lerninhalte. Inhalte sind Daten (JSON), kein Programmcode.
const BASIS = new URL('../../inhalte/', import.meta.url);

async function ladeJson(pfad) {
  const antwort = await fetch(new URL(pfad, BASIS));
  if (!antwort.ok) throw new Error(`Inhalt fehlt: ${pfad}`);
  return antwort.json();
}

export async function ladeInhalte(sprache = 'de') {
  const [regeln, lehrplan, texte, demo] = await Promise.all([
    ladeJson('regeln.json'),
    ladeJson('lehrplan.json'),
    ladeJson(`${sprache}/texte.json`),
    ladeJson(`${sprache}/demo.json`),
  ]);
  return { regeln, lehrplan, texte, demo };
}
