// Lexikon und Einstellungen: zwei einfache Nebenansichten.
import { el, fuelle, knopf, punkte, leiste } from './bausteine.js';
import { erfolge, neuerFortschritt } from '../logik/meisterschaft.js';
import { wendeSchriftAn } from './schrift.js';
import { wandleUm, pruefeLauf, sprungStatus, springeZuAuftrag } from '../logik/extras.js';

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

export function zeigeEinstellungen(wurzel, app, nav, daten) {
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
        // Auch Dateien aus älteren Versionen werden angenommen und umgewandelt.
        const gelesen = wandleUm(JSON.parse(await dateiWahl.files[0].text()));
        if (!gelesen) throw new Error('kein Spielstand');
        const stand = pruefeLauf(gelesen, app.inhalte.auftraege);
        app.setze(stand);
        wendeSchriftAn(stand.einstellungen.schrift ?? 'normal');
        dateiStatus.textContent = t.standGeladen;
      } catch {
        dateiStatus.textContent = t.standUngueltig;
      }
    },
  });
  const laden = knopf(t.standLaden, () => dateiWahl.click(), 'knopf-zweit');

  // Auf iPhone und iPad löscht Safari den Stand nach einer Weile ohne Besuch. Als App auf dem Home-Bildschirm nicht.
  const apfelGeraet = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const alsApp = navigator.standalone === true || globalThis.matchMedia?.('(display-mode: standalone)').matches;
  const iphoneHinweis = apfelGeraet && !alsApp ? el('p', { klasse: 'klein', text: t.iphoneInfo }) : null;

  wurzel.append(
    leiste(t, nav, t.einstellungenTitel),
    el('section', { klasse: 'karte' },
      el('p', { klasse: 'etikett', text: t.schriftEtikett }),
      el('div', { klasse: 'bausteine' }, schriftKnoepfe)),
    el('section', { klasse: 'karte' },
      el('p', { klasse: 'etikett', text: t.standEtikett }),
      el('p', { text: app.speicher.dauerhaft ? t.standInfo : t.standInfoAus }),
      el('p', { klasse: 'klein', text: t.offlineInfo }),
      iphoneHinweis,
      el('div', { klasse: 'knopf-reihe' }, sichern, laden),
      dateiWahl,
      dateiStatus,
      knopf(t.loeschen, () => { rueckfrage.hidden = false; }, 'knopf-zweit'),
      rueckfrage),
    springen(app, nav, t, daten?.springen),
    el('section', { klasse: 'karte' },
      el('p', { klasse: 'etikett', text: t.kiEtikett }),
      el('p', { text: t.kiInfo })),
  );
}

// Zu einem späteren Auftrag springen, zum Beispiel nach einem Gerätewechsel (E-043).
// Vor jedem Sprung kommt eine Rückfrage. Der letzte Sprung lässt sich rückgängig machen.
// offen: Die Auftragsliste ist gleich aufgeklappt und im Blick (kommt vom Hinweis im Studio).
function springen(app, nav, t, offen = false) {
  const { auftraege, regeln } = app.inhalte;
  const status = sprungStatus(app.stand, auftraege);
  const hatZiele = status.some((s) => s.status === 'ziel');
  const vorher = app.speicher.vorSprung();
  const zusatz = { erledigt: t.sprungErledigt, dran: t.sprungDran, offen: t.sprungOffen };

  // Eine einzige Rückfrage, deren Inhalt je nach Knopf wechselt.
  const frage = el('p', {});
  const ja = knopf(t.sprungJa, null, 'knopf-warn');
  let aktion = null;
  ja.addEventListener('click', () => aktion?.());
  const rueckfrage = el('div', { klasse: 'rueckfrage', hidden: true, 'aria-live': 'polite' },
    frage,
    el('div', { klasse: 'knopf-reihe' }, ja,
      knopf(t.sprungNein, () => { rueckfrage.hidden = true; }, 'knopf-zweit')));

  // Die Rückfrage erscheint direkt beim Knopf, der sie ausgelöst hat. So sieht man sie auch am Handy.
  function frageNach(ort, text, jaText, wennJa) {
    ort.append(rueckfrage);
    frage.textContent = text;
    ja.textContent = jaText;
    aktion = wennJa;
    rueckfrage.hidden = false;
    ja.focus();
  }

  const liste = el('ol', { klasse: 'sprung-liste' }, status.map(({ id, status: art }, stelle) => {
    const auftrag = auftraege[stelle];
    const name = fuelle(t.sprungZiel, { nr: stelle + 1, kunde: auftrag.kunde });
    if (art !== 'ziel') {
      return el('li', {}, el('span', { klasse: 'sprung-fertig', text: `${name} (${zusatz[art]})` }));
    }
    const eintrag = el('li', {});
    eintrag.append(knopf(name, () => frageNach(
      eintrag,
      fuelle(t.sprungFrage, { kunde: auftrag.kunde }),
      t.sprungJa,
      () => {
        app.speicher.merkeVorSprung(app.stand);
        app.setze(springeZuAuftrag(app.stand, id, auftraege, regeln));
        nav.zu('studio', { gruss: fuelle(t.sprungGemacht, { kunde: auftrag.kunde }) });
      },
    ), 'knopf-zweit sprung-knopf'));
    return eintrag;
  }));

  const zurueckOrt = el('div', { klasse: 'sprung-zurueck' });
  const zurueck = vorher ? knopf(t.sprungZurueck, () => frageNach(zurueckOrt, t.sprungZurueckFrage, t.sprungZurueckJa, () => {
    app.speicher.vergissVorSprung();
    app.setze(pruefeLauf(vorher, auftraege));
    nav.zu('studio', { gruss: t.sprungZurueckGemacht });
  }), 'knopf-zweit') : null;
  if (zurueck) zurueckOrt.append(zurueck);

  const auswahl = hatZiele
    ? el('details', { klasse: 'eintrag sprung-auf', open: offen }, el('summary', { text: t.sprungWaehlen }), liste)
    : el('p', { klasse: 'klein', text: t.sprungNichts });
  const karte = el('section', { klasse: 'karte', id: 'springen' },
    el('p', { klasse: 'etikett', text: t.sprungEtikett }),
    el('p', { text: t.sprungInfo }),
    auswahl,
    zurueck ? zurueckOrt : null);
  if (offen) {
    // Erst nach dem Einfügen in die Seite lässt sich dorthin scrollen.
    requestAnimationFrame(() => {
      karte.scrollIntoView({ block: 'start' });
      (auswahl.querySelector('summary') ?? auswahl).focus?.({ preventScroll: true });
    });
  }
  return karte;
}
