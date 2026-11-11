// Simulierte KI «Kiwi»: antwortet nach festen Regeln aus den Lerninhalten.
// Braucht kein Konto, kostet nichts und läuft ohne Internet.
import { bewerte } from '../logik/bewertung.js';
import { bauePrompt, baueSystemPrompt } from '../logik/prompt.js';

// Spielwert für das Token-Budget. Das ist keine echte Token-Zählung.
export function schaetzeSpielTokens(text) {
  const woerter = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(woerter * 1.3));
}

// Manche Fehlbilder zitieren das eine gewählte Beispiel: Platzhalter {teil}.
function setzeTeilEin(text, aufgabe, auswahl, pruefung) {
  if (!text.includes('{teil}')) return text;
  const quelle = pruefung?.wenn.aus ?? [];
  const teil = aufgabe.teile.find((t) => quelle.includes(t.id) && auswahl.includes(t.id));
  const wort = (teil?.text ?? '').replace(/[«»]/g, '').replace(/[.!?]$/, '');
  return text.replaceAll('{teil}', wort);
}

export function erstelleSimulierteKi() {
  return {
    modus: 'simuliert',
    async antworte({ aufgabe, auswahl = [], versuch = 0 }) {
      const urteil = bewerte(aufgabe, auswahl);
      const fehlbild = urteil.ok ? null : aufgabe.fehlbilder[urteil.fehlbild];
      const varianten = urteil.ok ? aufgabe.erfolg : fehlbild.texte;
      const text = setzeTeilEin(varianten[versuch % varianten.length], aufgabe, auswahl, urteil.pruefung);
      return {
        text,
        ok: urteil.ok,
        fehlbild: urteil.fehlbild,
        hinweis: fehlbild?.hinweis ?? null,
        tokens: {
          eingabe: schaetzeSpielTokens(`${baueSystemPrompt(aufgabe, auswahl)} ${bauePrompt(aufgabe, auswahl)}`),
          ausgabe: schaetzeSpielTokens(text),
        },
        modus: 'simuliert',
      };
    },
  };
}
