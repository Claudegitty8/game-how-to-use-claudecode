// Bewertet eine gebaute Lösung: Welche nötigen Zutaten fehlen?
// Reine Logik ohne Oberfläche, damit sie automatisch testbar ist.

export function bewerte(aufgabe, auswahl = []) {
  const gewaehlt = new Set(auswahl);
  const fehlend = aufgabe.zutaten
    .filter((zutat) => zutat.noetig !== false && !gewaehlt.has(zutat.id))
    .map((zutat) => zutat.id);
  return {
    ok: fehlend.length === 0,
    fehlend,
    // Die Reihenfolge der Zutaten in den Daten bestimmt die Wichtigkeit.
    wichtigsteLuecke: fehlend[0] ?? null,
  };
}
