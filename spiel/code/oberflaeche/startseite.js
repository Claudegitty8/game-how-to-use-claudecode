// Startseite des Fundaments: zeigt, dass Inhalte, Speicher und KI zusammenspielen.
// Die Oberfläche enthält keine Spielregeln und keine festen Texte.

function el(tag, eigenschaften = {}, ...kinder) {
  const knoten = document.createElement(tag);
  for (const [name, wert] of Object.entries(eigenschaften)) {
    if (name === 'klasse') knoten.className = wert;
    else if (name === 'text') knoten.textContent = wert;
    else if (name.startsWith('on')) knoten.addEventListener(name.slice(2), wert);
    else knoten.setAttribute(name, wert);
  }
  knoten.append(...kinder.filter(Boolean));
  return knoten;
}

function fuelle(text, werte) {
  return text.replace(/\{(\w+)\}/g, (_, name) => String(werte[name] ?? ''));
}

export function zeigeStartseite(wurzel, { inhalte, speicher, ki }) {
  const { texte, lehrplan, demo } = inhalte;
  const t = texte.app;

  const stand = speicher.laden();
  stand.besuche += 1;
  const gespeichert = speicher.speichern(stand);

  const auswahl = new Set();
  let versuch = 0;

  // --- Auftrag ---
  const auftrag = el('section', { klasse: 'karte auftrag' },
    el('p', { klasse: 'etikett', text: t.auftragEtikett }),
    el('h2', { text: demo.kunde }),
    el('p', { klasse: 'wunsch', text: `«${demo.wunsch}»` }),
  );

  // --- Werkbank ---
  const promptVorschau = el('p', { klasse: 'prompt' });
  const bausteine = el('div', { klasse: 'bausteine' });

  function zeichnePrompt() {
    const teile = [demo.grundprompt, ...demo.zutaten.filter((z) => auswahl.has(z.id)).map((z) => z.text)];
    promptVorschau.textContent = teile.join(' ');
  }

  for (const zutat of demo.zutaten) {
    const knopf = el('button', {
      type: 'button',
      klasse: 'baustein',
      'aria-pressed': 'false',
      onclick: () => {
        if (auswahl.has(zutat.id)) auswahl.delete(zutat.id);
        else auswahl.add(zutat.id);
        knopf.setAttribute('aria-pressed', String(auswahl.has(zutat.id)));
        zeichnePrompt();
      },
    }, el('span', { klasse: 'baustein-zeichen', 'aria-hidden': 'true', text: '+' }), el('span', { text: zutat.name }));
    bausteine.append(knopf);
  }

  const ergebnisText = el('p', { klasse: 'sprechblase', text: t.kiwiBereit });
  const ergebnisHinweis = el('p', { klasse: 'hinweis' });
  const kiwi = el('div', { klasse: 'kiwi', role: 'img', 'aria-label': t.kiwiName },
    el('span', { klasse: 'auge' }), el('span', { klasse: 'auge' }));

  const los = el('button', {
    type: 'button',
    klasse: 'los',
    text: t.los,
    onclick: async () => {
      los.disabled = true;
      const antwort = await ki.antworte({ aufgabe: demo, auswahl: [...auswahl], versuch });
      versuch += 1;
      ergebnisText.textContent = antwort.text;
      ergebnisHinweis.textContent = antwort.ok ? t.gelungen : demo.hinweise[antwort.luecke];
      ergebnisHinweis.className = antwort.ok ? 'hinweis gut' : 'hinweis';
      kiwi.classList.toggle('froh', antwort.ok);
      los.disabled = false;
    },
  });

  const werkbank = el('section', { klasse: 'karte werkbank' },
    el('p', { klasse: 'etikett', text: t.werkbankEtikett }),
    promptVorschau,
    el('p', { klasse: 'klein', text: t.bausteinHilfe }),
    bausteine,
    los,
  );

  const ergebnis = el('section', { klasse: 'karte ergebnis' },
    el('div', { klasse: 'kiwi-zeile' }, kiwi, ergebnisText),
    ergebnisHinweis,
  );

  // --- Fundament-Check ---
  const pruefpunkte = [
    fuelle(t.checkInhalte, { konzepte: lehrplan.konzepte.length, kapitel: lehrplan.kapitel.length }),
    gespeichert ? fuelle(t.checkSpeicher, { besuche: stand.besuche }) : t.checkSpeicherAus,
    fuelle(t.checkKi, { modus: ki.modus }),
  ];
  const check = el('section', { klasse: 'karte' },
    el('p', { klasse: 'etikett', text: t.checkEtikett }),
    el('ul', { klasse: 'check' }, ...pruefpunkte.map((punkt) => el('li', { text: punkt }))),
  );

  // --- Kapitelübersicht ---
  const kapitelListe = el('ol', { klasse: 'kapitel' }, ...lehrplan.kapitel.map((kapitel) => {
    const text = texte.kapitel[kapitel.id];
    const anzahl = lehrplan.konzepte.filter((k) => k.kapitel === kapitel.id).length;
    return el('li', {},
      el('strong', { text: text.name }),
      el('span', { text: ` ${text.thema} · ${fuelle(t.konzeptAnzahl, { anzahl })}` }),
    );
  }));
  const plan = el('section', { klasse: 'karte' },
    el('p', { klasse: 'etikett', text: t.planEtikett }),
    kapitelListe,
  );

  zeichnePrompt();
  wurzel.replaceChildren(
    el('header', { klasse: 'kopf' },
      el('h1', { text: t.titel }),
      el('p', { text: t.untertitel }),
    ),
    auftrag, werkbank, ergebnis, check, plan,
    el('footer', { klasse: 'fuss', text: t.fuss }),
  );
}
