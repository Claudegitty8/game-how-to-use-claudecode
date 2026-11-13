// Spielstand: bleibt nur auf dem Gerät. Fällt der Gerätespeicher aus,
// läuft das Spiel mit einem Stand im Arbeitsspeicher weiter.
import { neuerStand, STAND_VERSION } from '../logik/ablauf.js';
import { wandleUm } from '../logik/extras.js';

const SCHLUESSEL = 'ki-studio-stand';
// Kopie des Stands vor dem letzten Sprung, damit sich der Sprung rückgängig machen lässt (E-043).
const VOR_SPRUNG = 'ki-studio-stand-vor-sprung';
// Unveränderte Kopie eines Stands aus einer anderen Version, bevor er umgewandelt wird (E-044).
const ALT = 'ki-studio-stand-alt';

function holeLager() {
  try {
    const lager = globalThis.localStorage;
    lager.setItem('__probe', '1');
    lager.removeItem('__probe');
    return lager;
  } catch {
    return null;
  }
}

export function erstelleSpeicher(lager = holeLager()) {
  let imKopf = null;
  let vorSprungImKopf = null;

  function schreibe(schluessel, wert) {
    try {
      lager?.setItem(schluessel, wert);
      return Boolean(lager);
    } catch {
      return false;
    }
  }

  function entferne(schluessel) {
    try {
      lager?.removeItem(schluessel);
    } catch {
      // Nichts zu tun: Was im Arbeitsspeicher liegt, wird ohnehin zurückgesetzt.
    }
  }

  return {
    dauerhaft: Boolean(lager),
    laden() {
      if (imKopf) return structuredClone(imKopf);
      try {
        const roh = lager?.getItem(SCHLUESSEL) ?? null;
        const gelesen = JSON.parse(roh ?? 'null');
        if (!gelesen) return neuerStand();
        // Stände aus anderen Versionen werden umgewandelt statt verworfen. Das Original bleibt als Kopie liegen.
        if (gelesen.version !== STAND_VERSION) schreibe(ALT, roh);
        return wandleUm(gelesen) ?? neuerStand();
      } catch {
        return neuerStand();
      }
    },
    speichern(stand) {
      imKopf = structuredClone(stand);
      return schreibe(SCHLUESSEL, JSON.stringify(stand));
    },
    loeschen() {
      imKopf = null;
      vorSprungImKopf = null;
      entferne(SCHLUESSEL);
      entferne(VOR_SPRUNG);
      return neuerStand();
    },
    // --- Sprung rückgängig machen ---
    merkeVorSprung(stand) {
      vorSprungImKopf = structuredClone(stand);
      schreibe(VOR_SPRUNG, JSON.stringify(stand));
    },
    vorSprung() {
      if (vorSprungImKopf) return structuredClone(vorSprungImKopf);
      try {
        return wandleUm(JSON.parse(lager?.getItem(VOR_SPRUNG) ?? 'null'));
      } catch {
        return null;
      }
    },
    vergissVorSprung() {
      vorSprungImKopf = null;
      entferne(VOR_SPRUNG);
    },
  };
}
