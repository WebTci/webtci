// سرویس‌ورکر پشتیبانی ماهریاب
// نسخه کش را با هر تغییر مهم در فایل‌های برنامه افزایش دهید
const CACHE_VERSION = 'mahiyab-v1';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const DATA_CACHE = `${CACHE_VERSION}-data`;

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './js/app.js',
  './js/supabase.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('mahiyab-') && key !== SHELL_CACHE && key !== DATA_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // فقط درخواست‌های GET قابل کش هستند؛ درخواست‌های ثبت (PUT/POST به گیت‌هاب) هرگز کش نمی‌شوند
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isDataRequest = url.hostname.endsWith('.supabase.co');

  if (isDataRequest) {
    // شبکه ابتدا، در صورت قطع اینترنت آخرین نسخه کش‌شده نمایش داده می‌شود
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(DATA_CACHE).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // فایل‌های خود برنامه: کش ابتدا برای سرعت و کارکرد آفلاین
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
