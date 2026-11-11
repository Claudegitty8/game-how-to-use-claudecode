import { zaehleTokens } from './prompt.js';

// Bewertet eine gebaute Lösung anhand der Prüfungen einer Aufgabe.
// Reine Logik ohne Oberfläche, damit sie automatisch testbar ist.
//
// Eine Prüfung trifft zu, wenn
//   gewaehlt:   mindestens eines dieser Teile angesteckt ist (z. B. ein vages Teil),
//   fehlt:      mindestens eines dieser Teile nicht angesteckt ist,
//   aus + hoechstens: höchstens so viele Teile aus der Liste angesteckt sind,
//   tokensUeber: der Prompt mehr Spiel-Tokens hat als die Zahl.
// Die erste zutreffende Prüfung bestimmt das Fehlbild. Trifft keine zu, ist die Lösung gut.

function trifftZu(wenn, gewaehlt, aufgabe) {
  // tokensUeber: Der gebaute Prompt ist grösser als erlaubt (Budget oder Kontextfenster).
  if (Number.isInteger(wenn.tokensUeber)) return zaehleTokens(aufgabe, [...gewaehlt]) > wenn.tokensUeber;
  if (wenn.gewaehlt?.some((id) => gewaehlt.has(id))) return true;
  if (wenn.fehlt?.some((id) => !gewaehlt.has(id))) return true;
  if (wenn.aus && Number.isInteger(wenn.hoechstens)) {
    return wenn.aus.filter((id) => gewaehlt.has(id)).length <= wenn.hoechstens;
  }
  return false;
}

// Übungsform «Vorhersagen»: genau eine Antwort ist richtig.
function bewerteWahl(aufgabe, auswahl) {
  const option = aufgabe.optionen.find((o) => o.id === auswahl[0]) ?? null;
  return { ok: Boolean(option?.richtig), fehlbild: option?.richtig ? null : option?.id ?? 'leer', pruefung: null, option };
}

export function bewerte(aufgabe, auswahl = []) {
  if (aufgabe.typ === 'wahl') return bewerteWahl(aufgabe, auswahl);
  const gewaehlt = new Set(auswahl);
  const treffer = aufgabe.pruefungen.find((pruefung) => trifftZu(pruefung.wenn, gewaehlt, aufgabe)) ?? null;
  return { ok: !treffer, fehlbild: treffer?.fehlbild ?? null, pruefung: treffer };
}

// Für Hilfestufe 2: auf welches Teil soll der Spieler schauen?
// Zuerst ein angestecktes Teil, das schadet. Sonst ein Teil der Lösung, das fehlt.
export function hilfeTeil(aufgabe, auswahl = []) {
  if (aufgabe.typ === 'wahl') {
    // Bei einer Wahl: eine falsche Antwort ausschliessen, am liebsten die gerade gewählte.
    const falsche = aufgabe.optionen.filter((o) => !o.richtig);
    const ziel = falsche.find((o) => o.id === auswahl[0]) ?? falsche[0];
    return ziel ? { id: ziel.id, grund: 'falsch' } : null;
  }
  const gewaehlt = new Set(auswahl);
  const schaedlich = new Set(aufgabe.pruefungen.flatMap((pruefung) => pruefung.wenn.gewaehlt ?? []));
  const zuviel = auswahl.find((id) => schaedlich.has(id));
  if (zuviel) return { id: zuviel, grund: 'zuviel' };
  const fehlt = aufgabe.loesung.find((id) => !gewaehlt.has(id));
  return fehlt ? { id: fehlt, grund: 'fehlt' } : null;
}
