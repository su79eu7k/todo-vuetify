workbox.core.setCacheNameDetails({prefix: "todo-vuetify"});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});


// TODO Service Worker initiation improvement.

self.addEventListener('push', (event) => {

  // TODO Push payload improvement.

  const title = 'Get Started With Workbox';
  const options = {
    body: event.data.text()
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
