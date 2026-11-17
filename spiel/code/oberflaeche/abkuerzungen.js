// Abkürzungen erklären: Jede Abkürzung im Text wird antippbar und zeigt unten eine kurze Erklärung.
// Beim allerersten Auftreten steht die Langform gleich dahinter, zum Beispiel «KI (künstliche Intelligenz)».
// In Knöpfen und aufklappbaren Titeln bleibt der Text unverändert, dort hilft der Titel beim Darüberfahren.
import { el, fuelle, knopf } from './bausteine.js';
import { findeAbkuerzungen, merkeAbkuerzungen } from '../logik/abkuerzungen.js';

const NICHT_ANFASSEN = 'button, summary, .abk, .abk-lang, .abk-erklaerung, script, style';

export function richteAbkuerzungenEin(wurzel, app) {
  const liste = app.inhalte.abkuerzungen;
  const t = app.inhalte.texte.app;

  // Die Erklärung erscheint unten am Bildschirm. Schliessen mit dem Knopf oder mit Escape.
  const erklaerText = el('p', {});
  const schliessen = knopf(t.abkSchliessen, () => { leiste.hidden = true; }, 'knopf-zweit');
  const leiste = el('div', { klasse: 'abk-erklaerung', role: 'status', hidden: true }, erklaerText, schliessen);
  document.body.append(leiste);
  document.addEventListener('keydown', (ereignis) => {
    if (ereignis.key === 'Escape') leiste.hidden = true;
  });

  function erklaere(schluessel) {
    const eintrag = liste.eintraege[schluessel];
    erklaerText.textContent = fuelle(t.abkErklaerung, { kurz: schluessel, ...eintrag });
    leiste.hidden = false;
  }

  function langform(schluessel) {
    return fuelle(t.abkLangform, liste.eintraege[schluessel]);
  }

  // Wandelt alle Textstellen mit Abkürzungen in antippbare Wörter um.
  function bearbeite() {
    const gesehen = new Set(app.stand.abkuerzungen ?? []);
    const neu = [];
    const lauf = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT);
    const knoten = [];
    while (lauf.nextNode()) knoten.push(lauf.currentNode);
    for (const text of knoten) {
      const eltern = text.parentElement;
      if (!eltern) continue;
      const funde = findeAbkuerzungen(text.data, liste).filter((fund) => fund.schluessel);
      if (funde.length === 0) continue;
      if (eltern.closest(NICHT_ANFASSEN)) {
        // In Knöpfen nichts umbauen, nur einen Titel ergänzen.
        if (!eltern.title) eltern.title = funde.map((fund) => `${fund.schluessel}: ${liste.eintraege[fund.schluessel].lang}`).join(' · ');
        continue;
      }
      const teile = [];
      let stelle = 0;
      for (const fund of funde) {
        teile.push(text.data.slice(stelle, fund.start));
        teile.push(el('button', {
          type: 'button',
          klasse: 'abk',
          'aria-label': fuelle(t.abkKnopf, { kurz: fund.wort, lang: liste.eintraege[fund.schluessel].lang }),
          text: fund.wort,
          onclick: () => erklaere(fund.schluessel),
        }));
        // Die Langform kommt nicht in Überschriften und nicht mitten in ein zusammengesetztes Wort («KI-Studio»).
        // Dann folgt sie beim nächsten freistehenden Auftreten.
        const mitten = text.data[fund.ende] === '-' || eltern.closest('h1, h2, h3, legend, .etikett, .leiste, footer');
        if (!mitten && !gesehen.has(fund.schluessel)) {
          gesehen.add(fund.schluessel);
          neu.push(fund.schluessel);
          teile.push(el('span', { klasse: 'abk-lang', text: langform(fund.schluessel) }));
        }
        stelle = fund.ende;
      }
      teile.push(text.data.slice(stelle));
      text.replaceWith(...teile.filter((teil) => teil !== ''));
    }
    if (neu.length > 0) app.setze(merkeAbkuerzungen(app.stand, neu));
  }

  // Auch Texte, die später erscheinen (zum Beispiel Kiwis Antwort), werden bearbeitet.
  let geplant = false;
  const beobachter = new MutationObserver(() => {
    if (geplant) return;
    geplant = true;
    queueMicrotask(() => {
      beobachter.disconnect();
      bearbeite();
      geplant = false;
      beobachter.observe(wurzel, { childList: true, subtree: true, characterData: true });
    });
  });
  beobachter.observe(wurzel, { childList: true, subtree: true, characterData: true });
  return { neuGezeichnet: () => { leiste.hidden = true; } };
}
