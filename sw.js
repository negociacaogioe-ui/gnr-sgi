/* SGI — Service Worker (Web Push + instalação PWA) */
const SGI_SW_VERSION = 'sgi-v1';

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Recebe o push mesmo com a app fechada / sem sessão iniciada
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (err) { data = { body: event.data && event.data.text() }; }
  const title = data.title || 'SGI — Novo Incidente';
  const options = {
    body: data.body || 'Foi aberto um novo incidente.',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: data.tag || 'sgi-incidente',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || '/gnr-sgi/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Abrir/focar a app ao tocar na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/gnr-sgi/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) { if (c.url.includes('/gnr-sgi/') && 'focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
