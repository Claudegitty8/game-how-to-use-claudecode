// Das Studio: Startbildschirm mit Auftrag, Meisterschaft und Auftragswand.
import { el, fuelle, knopf, kiwiFigur, punkte } from './bausteine.js';
import { starteAuftrag } from '../logik/ablauf.js';
import { gespartText } from './runde.js';
import { erfolge, neuerFortschritt } from '../logik/meisterschaft.js';
import { einrichtungKarte, umfrageKarte } from './extras.js';

function rundenName(runde, texte) {
  return runde.konzept ? texte.konzepte[runde.konzept].name : runde.titel;
}

export function zeigeStudio(wurzel, app, nav) {
  const { texte, regeln, auftraege } = app.inhalte;
  const t = texte.app;
  const { stand } = app;
  const auftrag = app.auftrag(); // laufender oder nächster Auftrag, null wenn alle erledigt sind
  const laeuft = Boolean(stand.lauf);
  const noetig = regeln.erfolgeFuerMeisterschaft;

  let gruss = t.kiwiNeu;
  if (!auftrag) gruss = t.kiwiFertig;
  else if (laeuft) gruss = t.kiwiLaeuft;
  else if (stand.erledigt.length > 0) gruss = t.kiwiNaechster;

  // --- Auftrag ---
  const auftragKarte = el('section', { klasse: 'karte auftrag' },
    el('p', { klasse: 'etikett', text: t.auftragEtikett }));

  if (!auftrag) {
    auftragKarte.append(el('p', { text: t.mehrFolgt }));
  } else {
    const aktuelle = laeuft ? stand.lauf.runde : -1;
    auftragKarte.append(
      el('h2', { text: auftrag.kunde }),
      el('p', { klasse: 'wunsch', text: `«${auftrag.wunsch}»` }),
      el('ol', { klasse: 'runden' }, auftrag.runden.map((runde, index) => el('li', {
        klasse: index < aktuelle ? 'geschafft' : index === aktuelle ? 'aktuell' : null,
        'aria-current': index === aktuelle ? 'step' : null,
        text: rundenName(runde, texte),
      }))),
      knopf(laeuft ? t.weiterBauen : t.auftragAnnehmen, () => {
        if (!laeuft) app.setze(starteAuftrag(app.stand, auftrag, regeln, auftraege));
        nav.zu('runde');
      }, 'los'),
      // Wer Vorwissen hat, kann vor dem Start abkürzen.
      !laeuft && auftrag.runden.some((runde) => runde.konzept)
        ? knopf(t.schnelltestKnopf, () => nav.zu('schnelltest'), 'knopf-zweit')
        : null,
    );
  }

  // --- Meisterschaft: alle Konzepte, die schon vorgekommen sind oder gerade dran sind ---
  const sichtbar = auftraege.filter((a) => stand.erledigt.includes(a.id) || a === auftrag);
  const konzepte = sichtbar.flatMap((a) => a.runden).filter((runde) => runde.konzept);
  const meisterschaft = el('section', { klasse: 'karte' },
    el('p', { klasse: 'etikett', text: t.meisterschaftEtikett }),
    el('ul', { klasse: 'meister-liste' }, konzepte.map((runde) => {
      const anzahl = Math.min(noetig, erfolge(stand.fortschritt[runde.konzept] ?? neuerFortschritt()));
      return el('li', {}, el('span', { text: texte.konzepte[runde.konzept].name }), punkte(anzahl, noetig, t.punkteLabel));
    })));

  // --- Auftragswand ---
  const fertige = auftraege.filter((a) => stand.erledigt.includes(a.id));
  const wand = el('section', { klasse: 'karte' },
    el('p', { klasse: 'etikett', text: t.wandEtikett }),
    fertige.length === 0
      ? el('p', { klasse: 'klein', text: t.wandLeer })
      : fertige.map((a) => el('div', { klasse: 'wand-eintrag' },
        el('strong', { text: a.kunde }),
        el('p', { text: `«${a.kundenstimme}»` }),
        a.tokenBudget ? el('p', { klasse: 'klein', text: gespartText(t, stand.gespart?.[a.id]) }) : null)));

  // Das Studio als kleines Bild: Der Raum wächst mit dem Kapitel, gekaufte Zierde steht mit drin.
  const kapitelText = texte.kapitel[(auftrag ?? auftraege.at(-1)).kapitel ?? 1];
  const zierde = (stand.einrichtung ?? []).map((id) => t.einrichtung[id]);
  const zeichen = [...(kapitelText.deko ?? '').split(' '), ...zierde.map((name) => name.split(' ')[0])].filter(Boolean);
  const studioBild = el('div', {
    klasse: 'studio-bild',
    role: 'img',
    'aria-label': fuelle(t.studioBild, { dinge: [kapitelText.ort ?? t.studioName, ...zierde.map((name) => name.split(' ').slice(1).join(' '))].join(', ') }),
  }, zeichen.map((einzel) => el('span', { 'aria-hidden': 'true', text: einzel })));

  // Karten, die es gerade nicht gibt (null), werden ausgelassen.
  wurzel.append(...[
    el('header', { klasse: 'kopf' },
      el('h1', { text: t.titel }),
      el('p', { text: texte.kapitel[(auftrag ?? auftraege.at(-1)).kapitel ?? 1].ort ?? t.studioName })),
    studioBild,
    el('div', { klasse: 'kiwi-zeile' }, kiwiFigur(t.kiwiName, !auftrag), el('p', { klasse: 'sprechblase', text: gruss })),
    auftragKarte,
    umfrageKarte(app, nav),
    meisterschaft,
    einrichtungKarte(app, nav),
    wand,
    el('div', { klasse: 'knopf-reihe' },
      knopf(fuelle(t.lexikonKnopf, { anzahl: stand.lexikon.length }), () => nav.zu('lexikon'), 'knopf-zweit'),
      knopf(t.einstellungenKnopf, () => nav.zu('einstellungen'), 'knopf-zweit')),
    el('footer', { klasse: 'fuss', text: t.fuss }),
  ].filter(Boolean));
}
