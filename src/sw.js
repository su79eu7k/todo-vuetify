workbox.core.setCacheNameDetails({prefix: "todo-vuetify"});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// TODO Service Worker initiation improvement.

self.addEventListener('push', (event) => {
  const title = 'To do notification';
  const options = {
    body: event.data.text(),
    icon: '/img/icons/256.png',
    badge: '/img/icons/128.png',
    vibrate: [500, 500, 500]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
