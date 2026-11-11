// Zeigt den aktuellen Schritt einer Runde: Probieren, Aha, Beispiel, Lücke, Frei,
// Mischrunde oder Wiederholung. Die Regeln dazu stehen in logik/ablauf.js.
import { el, fuelle, knopf, kiwiFigur, punkte, leiste } from './bausteine.js';
import { baueUebung, istFrage } from './werkbank.js';
import { ansicht, weiter, verbucheFrei, verbucheWiederholungsErgebnis, verbraucheTokens, SCHRITTE } from '../logik/ablauf.js';
import { hilfeTeil } from '../logik/bewertung.js';
import { erfolge, neuerFortschritt } from '../logik/meisterschaft.js';
import { daumenKarte } from './extras.js';

function schrittReihe(t, aktuell) {
  return el('ol', { klasse: 'schritte' }, SCHRITTE.map((schritt) => el('li', {
    klasse: schritt === aktuell ? 'aktuell' : null,
    'aria-current': schritt === aktuell ? 'step' : null,
    text: t.schritt[schritt],
  })));
}

export function zeigeRunde(wurzel, app, nav) {
  const auftrag = app.auftrag();
  const a = auftrag ? ansicht(app.stand, auftrag) : { art: 'studio' };
  if (a.art === 'studio') {
    nav.zu('studio');
    return;
  }
  const t = app.inhalte.texte.app;
  const rundenText = fuelle(t.rundeEtikett, { nr: a.rundenNr, anzahl: auftrag.runden.length });
  const tokens = app.stand.lauf?.tokens;
  const titel = tokens == null ? rundenText : `${rundenText} · ${fuelle(t.budgetStand, { anzahl: tokens })}`;
  wurzel.append(leiste(t, nav, titel));
  if (a.art === 'aha') zeigeAha(wurzel, app, nav, a, auftrag);
  else zeigeAufgabe(wurzel, app, nav, a, auftrag);
}

function zeigeAha(wurzel, app, nav, a, auftrag) {
  const { texte, lexikon } = app.inhalte;
  const t = texte.app;
  const konzept = texte.konzepte[a.konzept];
  wurzel.append(
    schrittReihe(t, 'aha'),
    el('section', { klasse: 'karte aha' },
      el('p', { klasse: 'etikett', text: t.schritt.aha }),
      el('h2', { text: konzept.name }),
      konzept.aha.map((satz) => el('p', { text: satz })),
      konzept.stationen ? el('div', { klasse: 'stationen-bild' },
        el('ol', { klasse: 'stationen' }, konzept.stationen.map((station) => el('li', { text: station }))),
        el('p', { klasse: 'klein', text: t.stationenWieder })) : null,
      el('div', { klasse: 'merkbild' },
        el('p', { klasse: 'etikett', text: t.ahaAnalogie }),
        el('p', { text: konzept.analogie })),
      el('p', { klasse: 'klein', text: fuelle(t.ahaLexikon, { begriff: lexikon[a.konzept].begriff }) })),
    knopf(t.ahaWeiter, () => {
      app.setze(weiter(app.stand, auftrag));
      nav.zu('runde');
    }, 'los'),
  );
}

function zeigeAufgabe(wurzel, app, nav, a, auftrag) {
  const { texte, regeln } = app.inhalte;
  const t = texte.app;
  // Eine Wiederholung kann aus einem früheren Auftrag stammen.
  const quelle = app.inhalte.auftraege.find((x) => x.id === a.aufgabeVon) ?? auftrag;
  const aufgabe = quelle.aufgaben[a.aufgabeId];
  const art = a.art;
  const mitHilfeKnopf = art === 'luecke' || art === 'frei' || art === 'misch';
  const noetig = regeln.erfolgeFuerMeisterschaft;

  let versuche = 0;
  let fehlschlaege = 0;
  let hilfeStufe = 0;

  const istWahl = istFrage(aufgabe);
  const werkbank = baueUebung({
    aufgabe,
    t,
    sichtbar: a.nurTeile ?? null,
    zeigeTokens: app.stand.lauf?.tokens != null,
    vorgabe: a.vorgabe ?? [],
    auswahl: art === 'beispiel' ? aufgabe.loesung : [],
    gesperrt: art === 'beispiel',
  });

  // --- Kopf: Wo bin ich? ---
  const kopf = [];
  if (art === 'frei') {
    const stand = erfolge(app.stand.fortschritt[a.konzept] ?? neuerFortschritt());
    kopf.push(schrittReihe(t, 'frei'));
    kopf.push(el('p', { klasse: 'meister-zeile' },
      el('span', { text: texte.konzepte[a.konzept].name }), punkte(stand, noetig, t.punkteLabel)));
  } else if (art === 'misch') {
    const gesamt = a.runde.frei.length;
    const nr = gesamt - app.stand.lauf.reihe.length + 1;
    kopf.push(el('p', { klasse: 'etikett', text: `${t.schritt.misch} · ${fuelle(t.situationZaehler, { nr, anzahl: gesamt })}` }));
  } else if (art === 'wiederholung') {
    kopf.push(el('p', { klasse: 'etikett', text: `${t.schritt.wiederholung} ${texte.konzepte[a.konzept].name}` }));
  } else {
    kopf.push(schrittReihe(t, art));
  }
  kopf.push(el('p', { klasse: 'klein', text: (istWahl && t.schrittHilfeWahl[art]) || t.schrittHilfe[art] }));

  // --- Ergebnis ---
  const kiwi = kiwiFigur(t.kiwiName);
  const sprechblase = el('p', { klasse: 'sprechblase', text: t.kiwiBereit });
  const hinweis = el('p', { klasse: 'hinweis' });
  const status = el('p', { klasse: 'status' });
  const hilfeText = el('p', { klasse: 'hilfe-text' });
  const kosten = el('p', { klasse: 'klein kosten' });
  const budgetHinweis = el('p', { klasse: 'hinweis budget-hinweis' });
  const aktionen = el('div', { klasse: 'aktionen' });
  const ergebnis = el('section', { klasse: 'karte ergebnis', role: 'status' },
    el('div', { klasse: 'kiwi-zeile' }, kiwi, sprechblase), hinweis, status, kosten, budgetHinweis);

  function weiterSchritt() {
    app.setze(weiter(app.stand, auftrag));
    nav.zu('runde');
  }

  function schliesseAb(resultat) {
    const { stand, ereignis } = verbucheFrei(app.stand, auftrag, regeln, resultat, app.inhalte.auftraege);
    app.setze(stand);
    if (ereignis === 'weiter') nav.zu('runde');
    else nav.zu('zwischen', { ereignis, konzept: a.konzept, titel: a.runde?.titel, auftrag });
  }

  function fertig(...knoepfe) {
    werkbank.sperre();
    los.hidden = true;
    hilfeKnopf.hidden = true;
    aktionen.replaceChildren(...knoepfe);
  }

  const los = knopf(istWahl ? t.antworten : t.los, async () => {
    if (istWahl && werkbank.auswahl().length === 0) {
      status.textContent = t.waehleZuerst;
      return;
    }
    los.disabled = true;
    const antwort = await app.ki.antworte({ aufgabe, auswahl: werkbank.auswahl(), versuch: versuche });
    versuche += 1;
    if (!antwort.ok) fehlschlaege += 1;
    sprechblase.textContent = antwort.text;
    hinweis.textContent = antwort.ok ? antwort.hinweis ?? t.gelungen : antwort.hinweis;
    werkbank.nachTest?.();
    hinweis.className = antwort.ok ? 'hinweis gut' : 'hinweis';
    kiwi.classList.toggle('froh', antwort.ok);
    status.textContent = '';
    los.disabled = false;

    // Ab Kapitel 2 kostet jeder Test Tokens. Probieren und Beispiel sind immer gratis.
    let budgetLeer = false;
    if (art !== 'probieren' && art !== 'beispiel') {
      const eingabe = Math.min(antwort.tokens.eingabe, aufgabe.fenster ?? Infinity);
      const ergebnisBudget = verbraucheTokens(app.stand, auftrag, eingabe + antwort.tokens.ausgabe);
      app.setze(ergebnisBudget.stand);
      budgetLeer = ergebnisBudget.nachgeschoben;
      if (app.stand.lauf?.tokens != null) {
        kosten.textContent = fuelle(t.testKosten, { anzahl: eingabe + antwort.tokens.ausgabe, rest: app.stand.lauf.tokens });
      }
    }
    budgetHinweis.textContent = budgetLeer ? t.budgetLeer : '';

    if (art === 'probieren') {
      aktionen.replaceChildren(knopf(t.wasPassiert, weiterSchritt, 'los'));
    } else if (art === 'beispiel') {
      fertig(knopf(t.beispielWeiter, weiterSchritt, 'los'));
    } else if (art === 'luecke') {
      if (antwort.ok) fertig(knopf(t.weiter, weiterSchritt, 'los'));
    } else if (art === 'frei') {
      if (antwort.ok) {
        // Für die Meisterschaft zählt nur: beim ersten Versuch und ohne Hilfe ab Stufe 2.
        const zaehlt = versuche === 1 && hilfeStufe < 2;
        status.textContent = zaehlt ? t.gezaehlt : t.nichtGezaehlt;
        fertig(knopf(t.naechste, () => schliesseAb({ ok: true, zaehlt }), 'los'));
      } else {
        status.textContent = aufgabe.typ === 'reihe' ? t.nochmalReihe : istWahl ? t.nochmalWahl : t.nochmal;
        aktionen.replaceChildren(knopf(t.andere, () => schliesseAb({ ok: false, zaehlt: false }), 'knopf-zweit'));
      }
    } else if (art === 'misch') {
      if (antwort.ok) fertig(knopf(t.weiter, () => schliesseAb({ ok: true, zaehlt: true }), 'los'));
      else status.textContent = t.nochmalMisch;
    } else if (art === 'wiederholung') {
      status.textContent = antwort.ok ? t.wiederholungGut : t.wiederholungSchlecht;
      fertig(knopf(t.weiter, () => {
        app.setze(verbucheWiederholungsErgebnis(app.stand, regeln, antwort.ok));
        nav.zu('runde');
      }, 'los'));
    }

    // Wer zweimal scheitert, bekommt die erste Hilfe angeboten.
    if (mitHilfeKnopf && !antwort.ok && fehlschlaege >= 2 && hilfeStufe === 0) {
      hilfeText.textContent = t.hilfeAngebot;
    }
    ergebnis.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, 'los');

  // --- Drei Hilfestufen: Tipp, Teil zeigen, Lösung zeigen ---
  const hilfeKnopf = knopf(t.hilfe[0], () => {
    hilfeStufe += 1;
    if (hilfeStufe === 1) {
      hilfeText.textContent = art === 'misch' ? t.tippMisch : texte.konzepte[a.konzept].tipp;
    } else if (hilfeStufe === 2) {
      const teil = hilfeTeil(aufgabe, werkbank.auswahl());
      hilfeText.textContent = '';
      const text = { zuviel: t.hilfeZuviel, fehlt: t.hilfeFehlt, falsch: t.hilfeFalscheWahl, platz: t.hilfePlatz };
      if (teil) werkbank.markiere(teil.id, text[teil.grund]);
    } else {
      werkbank.setze(aufgabe.loesung);
      hilfeText.textContent = t.hilfeLoesung;
    }
    if (hilfeStufe >= t.hilfe.length) hilfeKnopf.hidden = true;
    else hilfeKnopf.textContent = t.hilfe[hilfeStufe];
  }, 'knopf-zweit');
  hilfeKnopf.hidden = !mitHilfeKnopf;

  wurzel.append(
    ...kopf,
    el('section', { klasse: 'karte auftrag' },
      el('p', { klasse: 'etikett', text: quelle.kunde }),
      el('p', { klasse: 'wunsch', text: `«${aufgabe.wunsch}»` })),
    werkbank.knoten,
    hilfeText,
    el('div', { klasse: 'knopf-reihe' }, los, hilfeKnopf),
    ergebnis,
    aktionen,
  );
}

export function gespartText(t, anzahl) {
  return anzahl > 0 ? fuelle(t.gespart, { anzahl }) : t.nichtGespart;
}

// Zwischenbild nach einer Runde oder nach dem ganzen Auftrag.
export function zeigeZwischen(wurzel, app, nav, { ereignis, konzept, titel, auftrag }) {
  const { texte, regeln } = app.inhalte;
  const t = texte.app;
  const zumStudio = knopf(t.zumStudio, () => nav.zu('studio'), 'los');

  if (ereignis === 'auftragFertig') {
    wurzel.append(
      el('section', { klasse: 'karte feier' },
        kiwiFigur(t.kiwiName, true),
        el('h2', { text: t.auftragFertigTitel }),
        el('p', { klasse: 'etikett', text: t.kundenstimmeEtikett }),
        el('p', { klasse: 'wunsch', text: `«${auftrag.kundenstimme}»` }),
        auftrag.tokenBudget ? el('p', { klasse: 'status', text: gespartText(t, app.stand.gespart?.[auftrag.id]) }) : null),
      el('section', { klasse: 'karte' },
        el('p', { klasse: 'etikett', text: t.ueberraschungEtikett }),
        el('p', { text: auftrag.ueberraschung })),
      daumenKarte(app, auftrag),
      zumStudio,
    );
    return;
  }

  // Eine Mischrunde mitten im Auftrag hat kein eigenes Konzept: Sie ist eine Etappe.
  if (!konzept) {
    wurzel.append(
      el('section', { klasse: 'karte feier' },
        kiwiFigur(t.kiwiName, true),
        el('h2', { text: fuelle(t.etappeFertigTitel, { titel: titel ?? '' }) }),
        el('p', { text: t.etappeFertigText }),
        el('p', { klasse: 'klein', text: t.pause })),
      zumStudio,
    );
    return;
  }

  const noetig = regeln.erfolgeFuerMeisterschaft;
  wurzel.append(
    el('section', { klasse: 'karte feier' },
      kiwiFigur(t.kiwiName, true),
      el('h2', { text: fuelle(t.rundeFertigTitel, { konzept: texte.konzepte[konzept].name }) }),
      punkte(noetig, noetig, t.punkteLabel),
      el('p', { text: t.rundeFertigText }),
      el('p', { klasse: 'klein', text: t.pause })),
    zumStudio,
  );
}
