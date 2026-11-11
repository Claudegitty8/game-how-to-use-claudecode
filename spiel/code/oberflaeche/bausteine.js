// Kleine Helfer, aus denen alle Ansichten gebaut sind.

export function el(tag, eigenschaften = {}, ...kinder) {
  const knoten = document.createElement(tag);
  for (const [name, wert] of Object.entries(eigenschaften)) {
    if (wert == null || wert === false) continue;
    if (name === 'klasse') knoten.className = wert;
    else if (name === 'text') knoten.textContent = wert;
    else if (name.startsWith('on')) knoten.addEventListener(name.slice(2), wert);
    else knoten.setAttribute(name, wert === true ? '' : wert);
  }
  knoten.append(...kinder.flat().filter(Boolean));
  return knoten;
}

// Ersetzt Platzhalter wie {anzahl} in einem Text.
export function fuelle(text, werte) {
  return text.replace(/\{(\w+)\}/g, (_, name) => String(werte[name] ?? ''));
}

export function knopf(text, beiKlick, klasse = 'knopf') {
  return el('button', { type: 'button', klasse, text, onclick: beiKlick });
}

export function kiwiFigur(name, froh = false) {
  return el('div', { klasse: froh ? 'kiwi froh' : 'kiwi', role: 'img', 'aria-label': name },
    el('span', { klasse: 'auge' }), el('span', { klasse: 'auge' }));
}

// Meisterschaftsanzeige: gefüllte und leere Punkte, mit Text für Vorlesehilfen.
export function punkte(erfolge, noetig, beschriftung) {
  const reihe = el('span', { klasse: 'punkte', role: 'img', 'aria-label': fuelle(beschriftung, { erfolge, noetig }) });
  for (let i = 0; i < noetig; i += 1) {
    reihe.append(el('span', { klasse: i < erfolge ? 'punkt voll' : 'punkt' }));
  }
  return reihe;
}

export function leiste(t, nav, titel) {
  return el('nav', { klasse: 'leiste' },
    knopf(t.zurueck, () => nav.zu('studio'), 'knopf-leise'),
    el('span', { klasse: 'leiste-titel', text: titel }));
}
