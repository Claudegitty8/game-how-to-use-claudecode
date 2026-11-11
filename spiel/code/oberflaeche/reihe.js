// Die Übungsform «Sortieren»: Der Spieler bringt Schritte in die richtige Reihenfolge.
// Bietet dieselben Funktionen wie die Werkbank, damit der Rundenablauf alle Formen gleich behandelt.
import { el, fuelle } from './bausteine.js';

export function baueReihe({ aufgabe, t, gesperrt = false }) {
  let ordnung = aufgabe.schritte.map((schritt) => schritt.id);
  let zu = gesperrt;
  let markiert = null;
  const texte = new Map(aufgabe.schritte.map((schritt) => [schritt.id, schritt.text]));
  const liste = el('ol', { klasse: 'reihe' });
  const hinweisZumTeil = el('p', { klasse: 'teil-hinweis', role: 'status' });

  function schiebe(id, richtung) {
    const von = ordnung.indexOf(id);
    const nach = von + richtung;
    if (nach < 0 || nach >= ordnung.length) return;
    ordnung = ordnung.with(von, ordnung[nach]).with(nach, id);
    markiert = null;
    hinweisZumTeil.textContent = '';
    zeichne(id, richtung);
  }

  // Nach dem Verschieben bleibt der Fokus auf demselben Knopf, damit man mehrmals drücken kann.
  function zeichne(fokusId = null, richtung = 0) {
    liste.replaceChildren(...ordnung.map((id, index) => {
      const text = texte.get(id);
      const hoch = el('button', {
        type: 'button', klasse: 'reihe-knopf', disabled: zu || index === 0,
        'aria-label': fuelle(t.reiheHoch, { text }), text: '▲', onclick: () => schiebe(id, -1),
      });
      const runter = el('button', {
        type: 'button', klasse: 'reihe-knopf', disabled: zu || index === ordnung.length - 1,
        'aria-label': fuelle(t.reiheRunter, { text }), text: '▼', onclick: () => schiebe(id, 1),
      });
      const zeile = el('li', { klasse: id === markiert ? 'reihe-zeile markiert' : 'reihe-zeile' },
        el('span', { klasse: 'reihe-text', text }), el('span', { klasse: 'reihe-knoepfe' }, hoch, runter));
      if (id === fokusId) queueMicrotask(() => [richtung < 0 ? hoch : runter, hoch, runter].find((k) => !k.disabled)?.focus());
      return zeile;
    }));
  }

  const knoten = el('section', { klasse: 'karte werkbank' },
    el('p', { klasse: 'etikett', text: t.frageEtikett }),
    el('p', { klasse: 'frage', text: aufgabe.frage }),
    el('p', { klasse: 'klein', text: t.reiheHilfe }),
    liste,
    hinweisZumTeil);

  zeichne();

  return {
    knoten,
    auswahl: () => [...ordnung],
    setze(ids) {
      ordnung = [...ids];
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
  };
}
