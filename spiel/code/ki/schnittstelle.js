// Die eine Schnittstelle für beide KI-Modi (simuliert und später echt).
//
// Vertrag: ki.antworte(anfrage) liefert ein Promise mit
//   { text, ok, luecke, tokens: { eingabe, ausgabe }, modus }
// anfrage = { aufgabe, auswahl, versuch }
//
// Der Lernfortschritt hängt nie vom Modus ab: Bewertet wird immer in logik/.
import { erstelleSimulierteKi } from './simuliert.js';

export function erstelleKi(modus = 'simuliert') {
  if (modus === 'simuliert') return erstelleSimulierteKi();
  throw new Error(`Den KI-Modus «${modus}» gibt es noch nicht.`);
}
