// Die Übungsform «Vorhersagen»: Der Spieler wählt eine von mehreren Antworten.
// Bietet dieselben Funktionen wie die Werkbank, damit der Rundenablauf beide gleich behandelt.
import { el } from './bausteine.js';
import { zeichneBild } from './bild.js';

// Mischt die Antworten, damit die richtige nicht immer am selben Platz steht.
// Die Reihenfolge hängt nur vom Text ab: Dieselbe Frage sieht jedes Mal gleich aus.
function gemischt(optionen, schluessel) {
  const zahl = (text) => [...text].reduce((summe, zeichen) => (summe * 31 + zeichen.codePointAt(0)) % 100003, 7);
  return [...optionen].sort((a, b) => zahl(schluessel + a.id) - zahl(schluessel + b.id));
}

export function baueWahl({ aufgabe, t, auswahl = [], gesperrt = false }) {
  let gewaehlt = auswahl[0] ?? null;
  let zu = gesperrt;
  const knoepfe = new Map();
  const hinweisZumTeil = el('p', { klasse: 'teil-hinweis', role: 'status' });

  function zeichne() {
    for (const [id, knoten] of knoepfe) {
      knoten.setAttribute('aria-pressed', String(id === gewaehlt));
      knoten.disabled = zu;
    }
  }

  // Mit Bild («Stelle antippen») bleiben die Bereiche an ihrem Platz im Bild. Sonst werden die Antworten gemischt.
  const reihenfolge = aufgabe.bild ? aufgabe.optionen : gemischt(aufgabe.optionen, aufgabe.frage);
  const optionen = reihenfolge.map((option) => {
    const knoten = el('button', {
      type: 'button',
      klasse: aufgabe.bild ? `baustein wahl bild-bereich ${option.art ? `bild-${option.art}` : ''}`.trim() : 'baustein wahl',
      onclick: () => {
        gewaehlt = option.id;
        knoten.classList.remove('markiert');
        hinweisZumTeil.textContent = '';
        zeichne();
      },
    }, el('span', { klasse: 'baustein-zeichen', 'aria-hidden': 'true' }), el('span', { text: option.text }));
    knoepfe.set(option.id, knoten);
    return knoten;
  });

  // Blick in Kiwis Kopf: Wie oft passt welches Wort? Erscheint erst nach der Antwort.
  const sichtfenster = el('div', { klasse: 'sichtfenster', hidden: true },
    el('p', { klasse: 'etikett', text: t.sichtfenster }),
    (aufgabe.anteile ?? []).map((anteil) => el('div', { klasse: 'anteil' },
      el('span', { klasse: 'anteil-wort', text: anteil.wort }),
      el('span', { klasse: 'anteil-bahn' }, el('span', { klasse: `anteil-balken stufe-${anteil.stufe}` })),
      el('span', { klasse: 'anteil-stufe', text: t.stufe[anteil.stufe] }))));

  // Token-Steine: zeigt nach der Antwort, wie ein Satz in Stücke zerfällt.
  const steine = el('div', { klasse: 'steine', hidden: true, role: 'img', 'aria-label': (aufgabe.steine ?? []).join('|') },
    (aufgabe.steine ?? []).map((stueck, index) => el('span', { klasse: `stein farbe-${index % 4}`, text: stueck.trim() })));

  // Das Bild mit den antippbaren Bereichen. Bereiche ohne festen Platz kommen ans Ende.
  function bildMitBereichen() {
    const platziert = new Set((aufgabe.bild.zeilen ?? []).map((zeile) => zeile.option).filter(Boolean));
    const index = new Map(reihenfolge.map((option, stelle) => [option.id, optionen[stelle]]));
    const bild = { ...aufgabe.bild, zeilen: [...aufgabe.bild.zeilen ?? [], ...reihenfolge.filter((o) => !platziert.has(o.id)).map((o) => ({ option: o.id }))] };
    return zeichneBild(bild, { bereich: (id) => index.get(id) });
  }

  const knoten = el('section', { klasse: 'karte werkbank' },
    el('p', { klasse: 'etikett', text: t.frageEtikett }),
    el('p', { klasse: 'frage', text: aufgabe.frage }),
    aufgabe.bild ? el('p', { klasse: 'klein', text: t.bildHilfe }) : null,
    aufgabe.bild ? bildMitBereichen() : el('div', { klasse: 'bausteine' }, optionen),
    hinweisZumTeil,
    steine,
    sichtfenster);

  zeichne();

  return {
    knoten,
    auswahl: () => (gewaehlt ? [gewaehlt] : []),
    setze(ids) {
      gewaehlt = ids[0] ?? null;
      zeichne();
    },
    sperre() {
      zu = true;
      zeichne();
    },
    markiere(id, text) {
      for (const k of knoepfe.values()) k.classList.remove('markiert');
      knoepfe.get(id)?.classList.add('markiert');
      hinweisZumTeil.textContent = text;
    },
    nachTest() {
      if ((aufgabe.anteile ?? []).length > 0) sichtfenster.hidden = false;
      if ((aufgabe.steine ?? []).length > 0) steine.hidden = false;
    },
  };
}
