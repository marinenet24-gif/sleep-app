const CACHE_NAME='sleep-v4';

const ASSETS=[
 './',
 './index.html',
 './manifest.json',
 'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate',e=>{
 e.waitUntil(
  caches.keys().then(keys=>{
    return Promise.all(
      keys.map(k=>k!==CACHE_NAME&&caches.delete(k))
    );
  }).then(()=>self.clients.claim())
 );
});

self.addEventListener('fetch',e=>{
 e.respondWith(
  caches.match(e.request).then(r=>r||fetch(e.request))
 );
});

self.addEventListener('message',e=>{
 if(e.data==='SKIP_WAITING') self.skipWaiting();
});