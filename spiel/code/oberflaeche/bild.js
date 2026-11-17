// Selbst gezeichnete Bilder aus HTML und CSS: ein Handy-Bildschirm, eine Webseite, Code oder eine Mail.
// Keine Bilddateien, keine fremden Grafiken. Das Bild beschreibt sich selbst für Vorlesehilfen.
import { el } from './bausteine.js';

// bild: { art: 'handy' | 'webseite' | 'code' | 'mail', titel, zeilen: [{ text, symbol?, art?, option? }] }
// Eine Zeile mit «option» ist ein Platz für einen antippbaren Bereich (Übung «Stelle antippen»).
// bereich(id) liefert dafür den Knopf. Ohne bereich ist das Bild nur zum Anschauen.
export function zeichneBild(bild, { beschreibung = '', bereich = null } = {}) {
  const zeilen = (bild.zeilen ?? []).map((zeile) => {
    if (zeile.option && bereich) return bereich(zeile.option);
    return el('div', { klasse: `bild-zeile ${zeile.art ? `bild-${zeile.art}` : ''}`.trim() },
      zeile.symbol ? el('span', { klasse: 'bild-symbol', 'aria-hidden': 'true', text: zeile.symbol }) : null,
      el('span', { text: zeile.text }));
  });
  return el('figure', { klasse: `bild bild-art-${bild.art ?? 'handy'}`, 'aria-label': beschreibung || bild.titel || null },
    el('div', { klasse: 'bild-kopf' },
      el('span', { klasse: 'bild-punkte', 'aria-hidden': 'true' }),
      el('span', { klasse: 'bild-titel', text: bild.titel ?? '' })),
    el('div', { klasse: 'bild-inhalt' }, zeilen));
}
