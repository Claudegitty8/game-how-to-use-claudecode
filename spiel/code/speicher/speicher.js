// Spielstand: bleibt nur auf dem Gerät. Fällt der Gerätespeicher aus,
// läuft das Spiel mit einem Stand im Arbeitsspeicher weiter.
const SCHLUESSEL = 'ki-studio-stand-v1';

export function leererStand() {
  return { version: 1, besuche: 0, fortschritt: {} };
}

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
        const roh = lager?.getItem(SCHLUESSEL);
        return roh ? JSON.parse(roh) : leererStand();
      } catch {
        return leererStand();
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
  };
}
