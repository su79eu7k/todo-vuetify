import Vue from 'vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App.vue'

import axios from 'axios'


Vue.prototype.$http = axios;
Vue.prototype.$eventHub = new Vue();

const applicationServerPublicKey = 'PUBLIC KEY HERE';


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

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server
  console.log(subscription)
}


if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(function(swReg) {
      let swRegistration = swReg;

      swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
          let isSubscribed = !(subscription === null);

          if (isSubscribed) {
            console.log('Already subscribed.');
            console.log(JSON.stringify(subscription));

            Vue.prototype.$eventHub.$emit('subscription', subscription)
          } else {
            swRegistration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlB64ToUint8Array(applicationServerPublicKey),
            })
              .then(function(subscription) {
                console.log('Just subscribed:', subscription);
                console.log(JSON.stringify(subscription));

                Vue.prototype.$eventHub.$emit('subscription', subscription);

                isSubscribed = true;
              })
              .catch(function(err) {
                console.log('Subscription failed: ', err);
              });
          }
        })
        .catch(function(err) {
          console.error('Service Worker Error.', err);
        });
    })
} else {
  console.warn('Push messaging is not supported.');
}

Vue.config.productionTip = false;
Vue.use(Vuetify);

new Vue({
  render: h => h(App),
}).$mount('#app');
