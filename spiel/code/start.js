// Einstieg: holt Inhalte, Speicher und KI und schaltet zwischen den Ansichten um.
import { ladeInhalte } from './inhalte/lader.js';
import { erstelleSpeicher } from './speicher/speicher.js';
import { erstelleKi } from './ki/schnittstelle.js';
import { zeigeStudio } from './oberflaeche/studio.js';
import { zeigeRunde, zeigeZwischen } from './oberflaeche/runde.js';
import { zeigeLexikon, zeigeEinstellungen } from './oberflaeche/lexikon.js';
import { wendeSchriftAn } from './oberflaeche/schrift.js';

const ANSICHTEN = {
  studio: zeigeStudio,
  runde: zeigeRunde,
  zwischen: zeigeZwischen,
  lexikon: zeigeLexikon,
  einstellungen: zeigeEinstellungen,
};

async function start() {
  const wurzel = document.getElementById('app');
  try {
    const inhalte = await ladeInhalte('de');
    const speicher = erstelleSpeicher();
    const app = {
      inhalte,
      speicher,
      ki: erstelleKi('simuliert'),
      stand: speicher.laden(),
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
  } catch (fehler) {
    wurzel.replaceChildren();
    const meldung = document.createElement('p');
    meldung.className = 'fehler';
    meldung.textContent = `Das Spiel konnte nicht starten: ${fehler.message}`;
    wurzel.append(meldung);
  }
}

start();
