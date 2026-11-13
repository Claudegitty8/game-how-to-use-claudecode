// Einstieg: holt Inhalte, Speicher und KI und schaltet zwischen den Ansichten um.
import { ladeInhalte } from './inhalte/lader.js';
import { erstelleSpeicher } from './speicher/speicher.js';
import { erstelleKi } from './ki/schnittstelle.js';
import { zeigeStudio } from './oberflaeche/studio.js';
import { zeigeRunde, zeigeZwischen } from './oberflaeche/runde.js';
import { zeigeLexikon, zeigeEinstellungen } from './oberflaeche/lexikon.js';
import { zeigeSchnelltest, zeigeUmfrage } from './oberflaeche/extras.js';
import { wendeSchriftAn } from './oberflaeche/schrift.js';
import { pruefeLauf } from './logik/extras.js';

const ANSICHTEN = {
  studio: zeigeStudio,
  runde: zeigeRunde,
  zwischen: zeigeZwischen,
  lexikon: zeigeLexikon,
  einstellungen: zeigeEinstellungen,
  schnelltest: zeigeSchnelltest,
  umfrage: zeigeUmfrage,
};

// Ohne Internet spielen: Ein kleiner Helfer im Browser (Service Worker) legt alle Dateien auf dem Gerät ab.
// Wo das nicht erlaubt ist, läuft das Spiel normal weiter, nur eben mit Internet.
const ABLAGE = 'ki-studio-ablage';
async function richteOfflineEin() {
  try {
    if (!('serviceWorker' in navigator) || !('caches' in globalThis)) return;
    await navigator.serviceWorker.register(new URL('../sw.js', import.meta.url));
    const geladen = performance.getEntriesByType('resource')
      .map((eintrag) => eintrag.name)
      .filter((adresse) => adresse.startsWith(location.origin));
    const ablage = await caches.open(ABLAGE);
    await ablage.addAll([...new Set([location.href.split('#')[0], ...geladen])]);
  } catch {
    // Kein Offline-Betrieb auf diesem Gerät oder an diesem Ort. Das Spiel selbst ist davon nicht betroffen.
  }
}

async function start() {
  const wurzel = document.getElementById('app');
  try {
    const inhalte = await ladeInhalte('de');
    const speicher = erstelleSpeicher();
    const app = {
      inhalte,
      speicher,
      ki: erstelleKi('simuliert'),
      // Passt ein angefangener Auftrag nach einem Update nicht mehr zu den Inhalten, beginnt er neu.
      stand: pruefeLauf(speicher.laden(), inhalte.auftraege),
      // Jede Änderung am Spielstand wird sofort gespeichert.
      setze(stand) {
        this.stand = stand;
        speicher.speichern(stand);
      },
      // Der laufende Auftrag, sonst der nächste offene. Sind alle erledigt: null.
      auftrag() {
        const { lauf, erledigt } = this.stand;
        if (lauf) return inhalte.auftraege.find((a) => a.id === lauf.auftrag);
        return inhalte.auftraege.find((a) => !erledigt.includes(a.id)) ?? null;
      },
    };
    const nav = {
      zu(name, daten) {
        wurzel.replaceChildren();
        ANSICHTEN[name](wurzel, app, nav, daten);
        window.scrollTo(0, 0);
        wurzel.focus({ preventScroll: true });
      },
    };
    wendeSchriftAn(app.stand.einstellungen.schrift);
    nav.zu('studio');
    richteOfflineEin();
  } catch (fehler) {
    wurzel.replaceChildren();
    const meldung = document.createElement('p');
    meldung.className = 'fehler';
    meldung.textContent = `Das Spiel konnte nicht starten: ${fehler.message}`;
    wurzel.append(meldung);
  }
}

start();
