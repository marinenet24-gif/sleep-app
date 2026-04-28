const CACHE_NAME='sleep-v4';

self.addEventListener('install',e=>{
 e.waitUntil(
  caches.open(CACHE_NAME).then(c=>c.addAll([
    './',
    './index.html',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/chart.js'
  ]))
 );
});

self.addEventListener('activate',e=>{
 e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch',e=>{
 e.respondWith(
  caches.match(e.request).then(r=>r||fetch(e.request))
 );
});

// ===== 通知クリック =====
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('./index.html')
  );
});

// ===== 更新制御 =====
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});