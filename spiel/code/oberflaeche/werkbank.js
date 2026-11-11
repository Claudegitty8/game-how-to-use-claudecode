// Die Werkbank: Hier steckt der Spieler seinen Prompt aus Textteilen zusammen.
// Sie kennt keine Spielregeln. Sie zeigt nur an und meldet die Auswahl.
import { el } from './bausteine.js';
import { bauePrompt } from '../logik/prompt.js';

const ARTEN = ['prompt', 'kontext', 'beispiel'];

export function baueWerkbank({ aufgabe, t, sichtbar = null, vorgabe = [], auswahl = [], gesperrt = false }) {
  const gewaehlt = new Set([...vorgabe, ...auswahl]);
  const fest = new Set(vorgabe);
  const knoepfe = new Map();
  let allesGesperrt = gesperrt;

  const vorschau = el('p', { klasse: 'prompt' });
  const hinweisZumTeil = el('p', { klasse: 'teil-hinweis', role: 'status' });

  function zeichne() {
    vorschau.textContent = bauePrompt(aufgabe, [...gewaehlt], t.beispielVorsatz);
    for (const [id, knoten] of knoepfe) {
      knoten.setAttribute('aria-pressed', String(gewaehlt.has(id)));
      knoten.disabled = allesGesperrt || fest.has(id);
    }
  }

  const teile = aufgabe.teile.filter((teil) => !sichtbar || sichtbar.includes(teil.id) || fest.has(teil.id));
  const gruppen = ARTEN.map((art) => {
    const derArt = teile.filter((teil) => teil.art === art);
    if (derArt.length === 0) return null;
    return el('div', { klasse: 'teil-gruppe' },
      el('p', { klasse: 'etikett', text: t.art[art] }),
      derArt.map((teil) => {
        const knoten = el('button', {
          type: 'button',
          klasse: 'baustein',
          onclick: () => {
            if (gewaehlt.has(teil.id)) gewaehlt.delete(teil.id);
            else gewaehlt.add(teil.id);
            knoten.classList.remove('markiert');
            hinweisZumTeil.textContent = '';
            zeichne();
          },
        }, el('span', { klasse: 'baustein-zeichen', 'aria-hidden': 'true', text: '+' }), el('span', { text: teil.text }));
        knoepfe.set(teil.id, knoten);
        return knoten;
      }));
  });

  const knoten = el('section', { klasse: 'karte werkbank' },
    el('p', { klasse: 'etikett', text: t.promptEtikett }),
    vorschau,
    teile.length > 0 && !gesperrt ? el('p', { klasse: 'klein', text: t.teileHilfe }) : null,
    gruppen,
    hinweisZumTeil);

  zeichne();

  return {
    knoten,
    auswahl: () => aufgabe.teile.filter((teil) => gewaehlt.has(teil.id)).map((teil) => teil.id),
    setze(ids) {
      gewaehlt.clear();
      for (const id of ids) gewaehlt.add(id);
      zeichne();
    },
    sperre() {
      allesGesperrt = true;
      zeichne();
    },
    markiere(id, text) {
      for (const k of knoepfe.values()) k.classList.remove('markiert');
      knoepfe.get(id)?.classList.add('markiert');
      hinweisZumTeil.textContent = text;
    },
  };
}
