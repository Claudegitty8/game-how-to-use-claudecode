// Meisterschaftsregel: Ein Konzept gilt als gelernt, wenn es in mehreren
// VERSCHIEDENEN Situationen OHNE Hilfe richtig angewendet wurde.
// Die Zahlen kommen aus spiel/inhalte/regeln.json.

export function neuerFortschritt() {
  return { geloesteSituationen: [], wiederholungsStufe: 0 };
}

export function verbucheVersuch(fortschritt, { situation, richtig, mitHilfe = false }) {
  const zaehlt = richtig && !mitHilfe && !fortschritt.geloesteSituationen.includes(situation);
  if (!zaehlt) return fortschritt;
  return { ...fortschritt, geloesteSituationen: [...fortschritt.geloesteSituationen, situation] };
}

export function erfolge(fortschritt) {
  return fortschritt.geloesteSituationen.length;
}

export function istGemeistert(fortschritt, regeln) {
  return erfolge(fortschritt) >= regeln.erfolgeFuerMeisterschaft;
}

// Ein Konzept darf erst starten, wenn alle Voraussetzungen gemeistert sind.
export function darfStarten(konzept, fortschritte, regeln) {
  return konzept.braucht.every((id) => fortschritte[id] && istGemeistert(fortschritte[id], regeln));
}

// Nach wie vielen Runden kommt die nächste Wiederholung? null = keine geplante mehr.
export function naechsterAbstand(fortschritt, regeln) {
  return regeln.wiederholungsAbstaende[fortschritt.wiederholungsStufe] ?? null;
}

// Gelungene Wiederholung: Abstand wächst. Misslungene: eine Stufe zurück, ohne Abzug.
export function verbucheWiederholung(fortschritt, richtig) {
  const stufe = richtig
    ? fortschritt.wiederholungsStufe + 1
    : Math.max(0, fortschritt.wiederholungsStufe - 1);
  return { ...fortschritt, wiederholungsStufe: stufe };
}
