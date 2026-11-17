// Die Übungsform «Schleife steuern»: Kiwi läuft durch Stationen (Nachschauen, Handeln, Prüfen).
// An jeder Station wählst du, was Kiwi tut. Nach dem Test läuft Kiwi sichtbar los und bleibt an der ersten falschen Wahl stehen.
// Bietet dieselben Funktionen wie die Werkbank, damit der Rundenablauf alle Formen gleich behandelt.
import { el, fuelle, kiwiFigur } from './bausteine.js';
import { paare } from '../logik/bewertung.js';

export function baueSchleife({ aufgabe, t, auswahl = [], gesperrt = false }) {
  let gewaehlt = paare(auswahl);
  let zu = gesperrt;
  let markiert = null;
  const hinweisZumTeil = el('p', { klasse: 'teil-hinweis', role: 'status' });
  const stationen = aufgabe.stationen;

  // Der Kreis oben: Stationen mit Kiwi, der darauf läuft.
  const laeufer = el('span', { klasse: 'schleife-laeufer' }, kiwiFigur(t.kiwiName));
  const punkte = stationen.map((station, stelle) => el('li', { klasse: 'schleife-station' },
    el('span', { klasse: 'schleife-nr', 'aria-hidden': 'true', text: String(stelle + 1) }),
    el('span', { text: station.name })));
  const kreis = el('div', { klasse: 'schleife-bahn' },
    el('ol', { klasse: 'schleife-stationen', 'aria-label': t.schleifeEtikett }, punkte),
    el('p', { klasse: 'klein schleife-zurueck', 'aria-hidden': 'true', text: t.schleifeZurueck }),
    laeufer);

  function setzeLaeufer(stelle) {
    laeufer.className = `schleife-laeufer bei-${stelle}`;
  }

  const fragen = el('div', { klasse: 'schleife-fragen' });
  function zeichne() {
    fragen.replaceChildren(...stationen.map((station, stelle) => el('fieldset', { klasse: `schleife-frage${markiert === station.id ? ' markiert' : ''}` },
      el('legend', { text: fuelle(t.schleifeFrage, { nr: stelle + 1, name: station.name, frage: station.frage }) }),
      el('div', { klasse: 'bausteine' }, station.optionen.map((option) => el('button', {
        type: 'button',
        klasse: 'baustein wahl',
        'aria-pressed': String(gewaehlt.get(station.id) === option.id),
        disabled: zu,
        onclick: () => {
          gewaehlt = new Map(gewaehlt).set(station.id, option.id);
          markiert = null;
          hinweisZumTeil.textContent = '';
          zeichne();
        },
      }, el('span', { klasse: 'baustein-zeichen', 'aria-hidden': 'true' }), el('span', { text: option.text })))))));
  }

  const knoten = el('section', { klasse: 'karte werkbank' },
    el('p', { klasse: 'etikett', text: t.frageEtikett }),
    el('p', { klasse: 'frage', text: aufgabe.frage }),
    kreis,
    fragen,
    hinweisZumTeil);

  zeichne();
  setzeLaeufer(0);

  return {
    knoten,
    auswahl: () => [...gewaehlt].map(([station, option]) => `${station}=${option}`),
    setze(ids) {
      gewaehlt = paare(ids);
      zeichne();
    },
    sperre() {
      zu = true;
      zeichne();
    },
    markiere(id, text) {
      markiert = id;
      hinweisZumTeil.textContent = text;
      zeichne();
    },
    // Kiwi läuft von Station zu Station. Bei «Bewegung reduzieren» springt Kiwi direkt ans Ziel.
    nachTest(antwort) {
      const ende = antwort?.ok ? stationen.length : Math.max(0, stationen.findIndex((s) => s.id === antwort?.station));
      punkte.forEach((punkt) => punkt.classList.remove('gut', 'stolpert'));
      const ruhig = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const schritt = (stelle) => {
        setzeLaeufer(Math.min(stelle, stationen.length - 1));
        if (stelle < ende) punkte[stelle].classList.add('gut');
        if (stelle === ende && !antwort?.ok) punkte[stelle]?.classList.add('stolpert');
      };
      if (ruhig) {
        for (let stelle = 0; stelle <= ende; stelle += 1) schritt(stelle);
        return;
      }
      for (let stelle = 0; stelle <= ende; stelle += 1) setTimeout(() => schritt(stelle), stelle * 450);
    },
  };
}
