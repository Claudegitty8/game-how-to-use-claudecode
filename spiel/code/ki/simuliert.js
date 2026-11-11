// Simulierte KI «Kiwi»: antwortet nach festen Regeln aus den Lerninhalten.
// Braucht kein Konto, kostet nichts und läuft ohne Internet.
import { bewerte } from '../logik/bewertung.js';

// Spielwert für das Token-Budget. Das ist keine echte Token-Zählung.
export function schaetzeSpielTokens(text) {
  const woerter = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(woerter * 1.3));
}

export function erstelleSimulierteKi() {
  return {
    modus: 'simuliert',
    async antworte({ aufgabe, auswahl = [], versuch = 0 }) {
      const urteil = bewerte(aufgabe, auswahl);
      const varianten = urteil.ok ? aufgabe.erfolg : aufgabe.fehlbilder[urteil.wichtigsteLuecke];
      const text = varianten[versuch % varianten.length];
      const eingabe = [
        aufgabe.grundprompt,
        ...aufgabe.zutaten.filter((z) => auswahl.includes(z.id)).map((z) => z.text),
      ].join(' ');
      return {
        text,
        ok: urteil.ok,
        luecke: urteil.wichtigsteLuecke,
        tokens: { eingabe: schaetzeSpielTokens(eingabe), ausgabe: schaetzeSpielTokens(text) },
        modus: 'simuliert',
      };
    },
  };
}
