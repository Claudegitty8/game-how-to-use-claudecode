// Kleiner Server, um das Spiel auf dem eigenen Computer anzusehen.
// Aufruf: npm start, dann im Browser http://localhost:8080 öffnen.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const WURZEL = fileURLToPath(new URL('../spiel/', import.meta.url));
const PORT = Number(process.env.PORT ?? 8080);
const TYPEN = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
};

createServer(async (anfrage, antwort) => {
  const adresse = new URL(anfrage.url, 'http://localhost');
  const wunsch = decodeURIComponent(adresse.pathname);
  const datei = path.join(WURZEL, wunsch.endsWith('/') ? `${wunsch}index.html` : wunsch);
  // Nichts ausserhalb des Spielordners ausliefern.
  if (!datei.startsWith(WURZEL)) {
    antwort.writeHead(403).end('Nicht erlaubt');
    return;
  }
  try {
    const inhalt = await readFile(datei);
    antwort.writeHead(200, { 'Content-Type': TYPEN[path.extname(datei)] ?? 'application/octet-stream' });
    antwort.end(inhalt);
  } catch {
    antwort.writeHead(404).end('Nicht gefunden');
  }
}).listen(PORT, () => console.log(`KI-Studio läuft auf http://localhost:${PORT}`));
