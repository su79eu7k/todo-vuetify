import Vue from 'vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App.vue'


const applicationServerPublicKey = 'PUBLIC KEY HERE'

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('/service-worker.js')
    .then(function(swReg) {
      console.log('Service Worker is registered', swReg);

      let swRegistration = swReg;

      swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
          let isSubscribed = !(subscription === null);

          if (isSubscribed) {
            console.log('Already subscribed.');

            // TODO This simple test must be installed in the app.
            const title = 'Push Codelab';
            const options = {
              body: 'Yay it works.',
              icon: 'images/icon.png',
              badge: 'images/badge.png'
            };
            swRegistration.showNotification(title, options);
          } else {
            const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
            swRegistration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: applicationServerKey
            })
              .then(function(subscription) {
                console.log('Just subscribed:', subscription);

                isSubscribed = true;
              })
              .catch(function(err) {
                console.log('Failed: ', err);
              });
          }
        })
        .catch(function(error) {
          console.error('Service Worker Error', error);
        });
    })
} else {
  console.warn('Push messaging is not supported');
}


Vue.config.productionTip = false;
Vue.use(Vuetify);

new Vue({
  render: h => h(App)
}).$mount('#app');
