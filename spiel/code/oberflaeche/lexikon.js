// Lexikon und Einstellungen: zwei einfache Nebenansichten.
import { el, fuelle, knopf, punkte, leiste } from './bausteine.js';
import { erfolge, neuerFortschritt } from '../logik/meisterschaft.js';
import { wendeSchriftAn } from './schrift.js';
import { istSpielstand } from '../logik/extras.js';

export function zeigeLexikon(wurzel, app, nav) {
  const { texte, lexikon, lehrplan, regeln } = app.inhalte;
  const t = texte.app;
  const noetig = regeln.erfolgeFuerMeisterschaft;
  const offen = lehrplan.konzepte.filter((konzept) => !app.stand.lexikon.includes(konzept.id)).length;

  function zeile(etikett, text) {
    return text ? el('p', {}, el('strong', { text: `${etikett}: ` }), el('span', { text })) : null;
  }

  wurzel.append(
    leiste(t, nav, t.lexikonTitel),
    ...app.stand.lexikon.map((id) => {
      const eintrag = lexikon[id];
      const kern = eintrag.kern ? texte.konzepte[eintrag.kern] : null;
      const anzahl = eintrag.kern
        ? Math.min(noetig, erfolge(app.stand.fortschritt[eintrag.kern] ?? neuerFortschritt()))
        : 0;
      return el('details', { klasse: 'karte eintrag' },
        el('summary', {}, el('span', { text: eintrag.begriff }), kern ? punkte(anzahl, noetig, t.punkteLabel) : null),
        el('p', { text: eintrag.erklaerung }),
        zeile(t.lexEnglisch, eintrag.englisch),
        zeile(t.lexAnalogie, kern?.analogie),
        zeile(t.lexQuatsch, eintrag.quatsch),
        zeile(t.lexGenauer, eintrag.genauer));
    }),
    el('p', { klasse: 'klein', text: fuelle(t.lexikonOffen, { anzahl: offen }) }),
  );
}

export function zeigeEinstellungen(wurzel, app, nav) {
  const t = app.inhalte.texte.app;

  const schriftKnoepfe = Object.entries(t.schrift).map(([wert, name]) => el('button', {
    type: 'button',
    klasse: 'baustein',
    'aria-pressed': String(app.stand.einstellungen.schrift === wert),
    text: name,
    onclick: () => {
      app.setze({ ...app.stand, einstellungen: { ...app.stand.einstellungen, schrift: wert } });
      wendeSchriftAn(wert);
      nav.zu('einstellungen');
    },
  }));

  // Eigene Rückfrage statt Browser-Dialog: funktioniert überall gleich.
  const rueckfrage = el('div', { klasse: 'rueckfrage', hidden: true },
    el('p', { text: t.loeschenFrage }),
    el('div', { klasse: 'knopf-reihe' },
      knopf(t.loeschenJa, () => {
        app.stand = app.speicher.loeschen();
        wendeSchriftAn(app.stand.einstellungen.schrift);
        nav.zu('studio');
      }, 'knopf-warn'),
      knopf(t.loeschenNein, () => { rueckfrage.hidden = true; }, 'knopf-zweit')));

  // Spielstand als Datei sichern und wieder laden. Die Datei bleibt beim Spieler.
  const dateiStatus = el('p', { klasse: 'klein', role: 'status' });
  const sichern = knopf(t.standSichern, () => {
    const adresse = URL.createObjectURL(new Blob([JSON.stringify(app.stand, null, 2)], { type: 'application/json' }));
    const link = el('a', { href: adresse, download: 'ki-studio-spielstand.json' });
    link.click();
    setTimeout(() => URL.revokeObjectURL(adresse), 1000);
  }, 'knopf-zweit');
  const dateiWahl = el('input', {
    type: 'file',
    accept: 'application/json,.json',
    hidden: true,
    onchange: async () => {
      try {
        const stand = JSON.parse(await dateiWahl.files[0].text());
        if (!istSpielstand(stand)) throw new Error('kein Spielstand');
        app.setze(stand);
        wendeSchriftAn(stand.einstellungen.schrift ?? 'normal');
        dateiStatus.textContent = t.standGeladen;
      } catch {
        dateiStatus.textContent = t.standUngueltig;
      }
    },
  });
  const laden = knopf(t.standLaden, () => dateiWahl.click(), 'knopf-zweit');

  wurzel.append(
    leiste(t, nav, t.einstellungenTitel),
    el('section', { klasse: 'karte' },
      el('p', { klasse: 'etikett', text: t.schriftEtikett }),
      el('div', { klasse: 'bausteine' }, schriftKnoepfe)),
    el('section', { klasse: 'karte' },
      el('p', { klasse: 'etikett', text: t.standEtikett }),
      el('p', { text: app.speicher.dauerhaft ? t.standInfo : t.standInfoAus }),
      el('p', { klasse: 'klein', text: t.offlineInfo }),
      el('div', { klasse: 'knopf-reihe' }, sichern, laden),
      dateiWahl,
      dateiStatus,
      knopf(t.loeschen, () => { rueckfrage.hidden = false; }, 'knopf-zweit'),
      rueckfrage),
    el('section', { klasse: 'karte' },
      el('p', { klasse: 'etikett', text: t.kiEtikett }),
      el('p', { text: t.kiInfo })),
  );
}
