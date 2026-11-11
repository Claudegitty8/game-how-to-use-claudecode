// Service Worker: sorgt dafür, dass das Spiel nach dem ersten Laden auch ohne Internet läuft.
// Mit Internet kommt immer die neuste Fassung. Ohne Internet die zuletzt abgelegte.
const ABLAGE = 'ki-studio-ablage';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (ereignis) => ereignis.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (ereignis) => {
  const anfrage = ereignis.request;
  if (anfrage.method !== 'GET' || new URL(anfrage.url).origin !== self.location.origin) return;
  ereignis.respondWith((async () => {
    const ablage = await caches.open(ABLAGE);
    try {
      const frisch = await fetch(anfrage);
      if (frisch.ok) ablage.put(anfrage, frisch.clone());
      return frisch;
    } catch (fehler) {
      const abgelegt = await ablage.match(anfrage, { ignoreSearch: true })
        ?? (anfrage.mode === 'navigate' ? await ablage.match(new URL('./index.html', self.registration.scope).href) : undefined);
      if (abgelegt) return abgelegt;
      throw fehler;
    }
  })());
});
