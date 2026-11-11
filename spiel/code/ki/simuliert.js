// Simulierte KI «Kiwi»: antwortet nach festen Regeln aus den Lerninhalten.
// Braucht kein Konto, kostet nichts und läuft ohne Internet.
import { bewerte } from '../logik/bewertung.js';
import { schaetzeSpielTokens, zaehleTokens } from '../logik/prompt.js';

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
      if (aufgabe.typ === 'wahl') {
        // Kiwi tut immer dasselbe. Der Hinweis erklärt, warum die gewählte Antwort stimmt oder nicht.
        return {
          text: aufgabe.kiwi,
          ok: urteil.ok,
          fehlbild: urteil.fehlbild,
          hinweis: urteil.option?.hinweis ?? null,
          tokens: { eingabe: schaetzeSpielTokens(aufgabe.frage), ausgabe: schaetzeSpielTokens(aufgabe.kiwi) },
          modus: 'simuliert',
        };
      }
      if (aufgabe.typ === 'reihe') {
        // Stimmt die Reihenfolge, läuft alles rund. Sonst zeigt Kiwi, was bei falscher Reihenfolge passiert.
        const text = urteil.ok ? aufgabe.kiwi : aufgabe.daneben.texte[versuch % aufgabe.daneben.texte.length];
        return {
          text,
          ok: urteil.ok,
          fehlbild: urteil.fehlbild,
          hinweis: urteil.ok ? null : aufgabe.daneben.hinweis,
          tokens: { eingabe: schaetzeSpielTokens(aufgabe.frage), ausgabe: schaetzeSpielTokens(text) },
          modus: 'simuliert',
        };
      }
      const fehlbild = urteil.ok ? null : aufgabe.fehlbilder[urteil.fehlbild];
      const varianten = urteil.ok ? aufgabe.erfolg : fehlbild.texte;
      const text = setzeTeilEin(varianten[versuch % varianten.length], aufgabe, auswahl, urteil.pruefung);
      return {
        text,
        ok: urteil.ok,
        fehlbild: urteil.fehlbild,
        hinweis: fehlbild?.hinweis ?? null,
        tokens: {
          eingabe: zaehleTokens(aufgabe, auswahl),
          // Lange Antworten werden im Text nur angedeutet. Ihr Preis steht beim Fehlbild.
          ausgabe: fehlbild?.ausgabeTokens ?? schaetzeSpielTokens(text),
        },
        modus: 'simuliert',
      };
    },
  };
}
