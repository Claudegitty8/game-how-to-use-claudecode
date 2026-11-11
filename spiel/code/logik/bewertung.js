// Bewertet eine gebaute Lösung anhand der Prüfungen einer Aufgabe.
// Reine Logik ohne Oberfläche, damit sie automatisch testbar ist.
//
// Eine Prüfung trifft zu, wenn
//   gewaehlt:   mindestens eines dieser Teile angesteckt ist (z. B. ein vages Teil),
//   fehlt:      mindestens eines dieser Teile nicht angesteckt ist,
//   aus + hoechstens: höchstens so viele Teile aus der Liste angesteckt sind.
// Die erste zutreffende Prüfung bestimmt das Fehlbild. Trifft keine zu, ist die Lösung gut.

function trifftZu(wenn, gewaehlt) {
  if (wenn.gewaehlt?.some((id) => gewaehlt.has(id))) return true;
  if (wenn.fehlt?.some((id) => !gewaehlt.has(id))) return true;
  if (wenn.aus && Number.isInteger(wenn.hoechstens)) {
    return wenn.aus.filter((id) => gewaehlt.has(id)).length <= wenn.hoechstens;
  }
  return false;
}

export function bewerte(aufgabe, auswahl = []) {
  const gewaehlt = new Set(auswahl);
  const treffer = aufgabe.pruefungen.find((pruefung) => trifftZu(pruefung.wenn, gewaehlt)) ?? null;
  return { ok: !treffer, fehlbild: treffer?.fehlbild ?? null, pruefung: treffer };
}

// Für Hilfestufe 2: auf welches Teil soll der Spieler schauen?
// Zuerst ein angestecktes Teil, das schadet. Sonst ein Teil der Lösung, das fehlt.
export function hilfeTeil(aufgabe, auswahl = []) {
  const gewaehlt = new Set(auswahl);
  const schaedlich = new Set(aufgabe.pruefungen.flatMap((pruefung) => pruefung.wenn.gewaehlt ?? []));
  const zuviel = auswahl.find((id) => schaedlich.has(id));
  if (zuviel) return { id: zuviel, grund: 'zuviel' };
  const fehlt = aufgabe.loesung.find((id) => !gewaehlt.has(id));
  return fehlt ? { id: fehlt, grund: 'fehlt' } : null;
}
