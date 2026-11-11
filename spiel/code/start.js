// Einstieg: holt Inhalte, Speicher und KI und übergibt sie der Oberfläche.
import { ladeInhalte } from './inhalte/lader.js';
import { erstelleSpeicher } from './speicher/speicher.js';
import { erstelleKi } from './ki/schnittstelle.js';
import { zeigeStartseite } from './oberflaeche/startseite.js';

async function start() {
  const wurzel = document.getElementById('app');
  try {
    const inhalte = await ladeInhalte('de');
    const speicher = erstelleSpeicher();
    const ki = erstelleKi('simuliert');
    zeigeStartseite(wurzel, { inhalte, speicher, ki });
  } catch (fehler) {
    wurzel.replaceChildren();
    const meldung = document.createElement('p');
    meldung.className = 'fehler';
    meldung.textContent = `Das Spiel konnte nicht starten: ${fehler.message}`;
    wurzel.append(meldung);
  }
}

start();
