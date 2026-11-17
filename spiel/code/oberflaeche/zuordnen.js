// Die Übungsform «Verbinden»: Teile an das richtige Ziel stecken.
// Antippen: zuerst ein Teil, dann ein Ziel. Mit der Maus geht auch Ziehen. Ziehen ist nie nötig.
// Bietet dieselben Funktionen wie die Werkbank, damit der Rundenablauf alle Formen gleich behandelt.
import { el, fuelle } from './bausteine.js';
import { paare } from '../logik/bewertung.js';

export function baueZuordnen({ aufgabe, t, auswahl = [], gesperrt = false }) {
  let gesteckt = paare(auswahl); // Teil -> Ziel
  let aktiv = null; // gerade angetipptes Teil
  let zu = gesperrt;
  let markiert = null;
  const hinweisZumTeil = el('p', { klasse: 'teil-hinweis', role: 'status' });
  const flaeche = el('div', { klasse: 'zuordnen' });
  const teilText = new Map(aufgabe.teile.map((teil) => [teil.id, teil]));

  function stecke(teilId, zielId) {
    if (zu) return;
    gesteckt = new Map(gesteckt).set(teilId, zielId);
    aktiv = null;
    markiert = null;
    hinweisZumTeil.textContent = '';
    zeichne(teilId);
  }

  function chip(teil, ort) {
    const knopf = el('button', {
      type: 'button',
      klasse: `zuordnen-teil${aktiv === teil.id ? ' aktiv' : ''}${markiert === teil.id ? ' markiert' : ''}`,
      'aria-pressed': String(aktiv === teil.id),
      'aria-label': fuelle(ort ? t.zuordnenTeilIn : t.zuordnenTeil, { teil: teil.text, ziel: ort?.text ?? '' }),
      disabled: zu,
      draggable: zu ? null : 'true',
      ondragstart: (ereignis) => ereignis.dataTransfer?.setData('text/plain', teil.id),
      onclick: () => {
        aktiv = aktiv === teil.id ? null : teil.id;
        zeichne(teil.id);
      },
    },
    teil.symbol ? el('span', { klasse: 'bild-symbol', 'aria-hidden': 'true', text: teil.symbol }) : null,
    el('span', { text: teil.text }));
    return knopf;
  }

  // Zeichnet alles neu. Der Fokus bleibt beim zuletzt bewegten Teil, damit man mit der Tastatur weiterarbeiten kann.
  function zeichne(fokus = null) {
    const frei = aufgabe.teile.filter((teil) => !gesteckt.has(teil.id));
    const ablage = el('div', { klasse: 'zuordnen-ablage', 'aria-label': t.zuordnenAblage },
      frei.length > 0 ? frei.map((teil) => chip(teil, null)) : el('p', { klasse: 'klein', text: t.zuordnenAlleGesteckt }));
    const ziele = aufgabe.ziele.map((ziel) => {
      const drin = aufgabe.teile.filter((teil) => gesteckt.get(teil.id) === ziel.id);
      return el('div', {
        klasse: `zuordnen-ziel${aktiv ? ' bereit' : ''}`,
        ondragover: (ereignis) => ereignis.preventDefault(),
        ondrop: (ereignis) => {
          ereignis.preventDefault();
          const id = ereignis.dataTransfer?.getData('text/plain');
          if (teilText.has(id)) stecke(id, ziel.id);
        },
      },
      el('button', {
        type: 'button',
        klasse: 'zuordnen-ziel-knopf',
        disabled: zu || !aktiv,
        'aria-label': aktiv ? fuelle(t.zuordnenHierhin, { teil: teilText.get(aktiv).text, ziel: ziel.text }) : ziel.text,
        onclick: () => aktiv && stecke(aktiv, ziel.id),
      },
      ziel.symbol ? el('span', { klasse: 'zuordnen-ziel-symbol', 'aria-hidden': 'true', text: ziel.symbol }) : null,
      el('span', { klasse: 'zuordnen-ziel-text', text: ziel.text })),
      el('div', { klasse: 'zuordnen-drin' }, drin.map((teil) => chip(teil, ziel))));
    });
    flaeche.replaceChildren(ablage, el('div', { klasse: 'zuordnen-ziele' }, ziele));
    if (fokus) queueMicrotask(() => [...flaeche.querySelectorAll('.zuordnen-teil')].find((k) => k.textContent.includes(teilText.get(fokus).text))?.focus());
  }

  const knoten = el('section', { klasse: 'karte werkbank' },
    el('p', { klasse: 'etikett', text: t.frageEtikett }),
    el('p', { klasse: 'frage', text: aufgabe.frage }),
    el('p', { klasse: 'klein', text: t.zuordnenHilfe }),
    flaeche,
    hinweisZumTeil);

  zeichne();

  return {
    knoten,
    auswahl: () => [...gesteckt].map(([teil, ziel]) => `${teil}=${ziel}`),
    setze(ids) {
      gesteckt = paare(ids);
      aktiv = null;
      zeichne();
    },
    sperre() {
      zu = true;
      aktiv = null;
      zeichne();
    },
    markiere(id, text) {
      markiert = id;
      hinweisZumTeil.textContent = text;
      zeichne();
    },
  };
}
