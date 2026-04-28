const CACHE_NAME = 'sleep-v3'; // 変更時は v4, v5…と更新

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// インストール：新キャッシュ作成
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// アクティベート：古いキャッシュ削除＆即時反映
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    );
    await self.clients.claim(); // 即時制御
  })());
});

// フェッチ：キャッシュ優先（なければネット）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

// ★ アプリからの「更新して」指示を受ける
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting(); // 新SWを即有効化
  }
});