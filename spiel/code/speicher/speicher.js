// Spielstand: bleibt nur auf dem Gerät. Fällt der Gerätespeicher aus,
// läuft das Spiel mit einem Stand im Arbeitsspeicher weiter.
import { neuerStand, STAND_VERSION } from '../logik/ablauf.js';

const SCHLUESSEL = 'ki-studio-stand';

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
  return {
    dauerhaft: Boolean(lager),
    laden() {
      if (imKopf) return structuredClone(imKopf);
      try {
        const stand = JSON.parse(lager?.getItem(SCHLUESSEL) ?? 'null');
        // Stände aus älteren Versionen werden verworfen, bis es eine Umwandlung gibt.
        return stand?.version === STAND_VERSION ? stand : neuerStand();
      } catch {
        return neuerStand();
      }
    },
    speichern(stand) {
      imKopf = structuredClone(stand);
      try {
        lager?.setItem(SCHLUESSEL, JSON.stringify(stand));
        return Boolean(lager);
      } catch {
        return false;
      }
    },
    loeschen() {
      imKopf = null;
      try {
        lager?.removeItem(SCHLUESSEL);
      } catch {
        // Nichts zu tun: Der Stand im Arbeitsspeicher ist bereits weg.
      }
      return neuerStand();
    },
  };
}
