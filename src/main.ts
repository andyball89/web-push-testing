import './style.css'
import { setupButton } from './button.ts'
import { updateSubUI, updateUI } from './helpers.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>

    <h1>Web Push Subscribe Test</h1>
    <div class="card">
      <button id="button" type="button">Subscribe</button>

    </div>

    <p id="serviceinfo"></p>
    <p id="subinfo"></p>
    <p id="info"></p>
  </div>
`

setupButton(document.querySelector<HTMLButtonElement>('#button')!)

function registerServiceWorker() {
  return new Promise((resolve, reject) => {


    const checkForActivePushSubscription = (registration: ServiceWorkerRegistration) => {
      registration.pushManager.getSubscription().then((subscription) => {

        if (subscription) {
          console.log('Subscription exists', subscription);
          updateSubUI(subscription);
          return subscription;
        }
        updateSubUI(null);
        console.log('No subscription exists');
        return null;
      });
    }

    console.log('Registering service worker...');

    navigator.serviceWorker.ready.then((registration) => {
      console.log('Service Worker is ready', registration);
      checkForActivePushSubscription(registration);
      resolve(registration);
    });

    navigator.serviceWorker.register('/service.js').then((registration) => {
      if (registration.active) {
        console.log('Service Worker is active');
        updateUI(registration);
        resolve(registration);
        return;
      }

      if (registration.installing) {
        registration.installing.addEventListener('statechange', function (e) {
          if ((e.target as ServiceWorker).state === 'activated') {
            console.log('Service Worker is active 2');
            updateUI(registration);
            resolve(registration);
          }
        });
      }

    }
    ).catch((error) => {
      console.error('Service Worker Error', error);
      reject(error);
    });
  });
}

window.addEventListener('load', () => registerServiceWorker());
