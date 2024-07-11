import { updateSubUI } from "./helpers";

const TESTING_APPLICATION_SERVER_KEY = "BIsas2cYhZcuEHjgS9qnJILm9p_pCX9ql1iuylDDE_HYM1lOHeHPAdmyh3iePgWAajQeAnffv1d-tIneNRce4S8";

export function setupButton(element: HTMLButtonElement) {
    element.addEventListener('click', doSubscribe);
}

function doSubscribe(e: MouseEvent) {
    // request permission to show notifications
    console.log('Requesting permission...');

    const subscribe = () => {

        console.log('Subscribing...');

        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(TESTING_APPLICATION_SERVER_KEY)
        };

        const sub = (registration: ServiceWorkerRegistration) => {
            registration?.pushManager.subscribe(subscribeOptions).then(function (subscription) {
                console.log('Push notifications are allowed.', subscription);
                updateSubUI(subscription);
                //  updateUI(subscription);
                return subscription;
            }).catch(function (error) {
                console.log('Error:', error);
                throw error;
            });
        }

        // check if permission is already granted
        if (Notification.permission !== 'granted') {
            console.error('Permission not yet granted, service start failed');
            return;
        }

        // get service worker registration
        navigator.serviceWorker.ready.then((registration) => {
            console.log('Service Worker is ready', registration);

            if (!registration) {
                console.error('Service Worker is not ready');
            }

            if (navigator.serviceWorker && window.PushManager && window.Notification) {
                console.log('Service Worker and Push is supported');
                // Request permission to send push notifications
                navigator.serviceWorker.getRegistration().then(function (registration) {
                    console.log('registration', registration);

                    registration?.pushManager.permissionState(subscribeOptions).then(function (permissionState) {
                        console.log('permissionsState', permissionState);

                        if (permissionState !== 'granted') {
                            console.error('Permission not yet granted', permissionState);
                            Notification.requestPermission().then(function (permission) {
                                if (permission === 'granted') {
                                    sub(registration);
                                }
                                else {
                                    alert('Permission denied');
                                }
                            });
                        }
                        else {
                            console.log('Permission already granted');
                        }

                        sub(registration);

                    }).catch((error) => {
                        console.error('Permission error', error);
                    });
                });
            }
        }).catch((error) => {
            console.error('Service Worker Error', error);
        });
    }

    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {

        // Check whether notification permissions have already been granted;
        // if so, create a notification
        const notification = new Notification("Hi there!");
        console.log('Permission already granted');
        subscribe();
        // …
    } else if (Notification.permission !== "denied") {

        console.log('Permission not yet granted');

        Notification.requestPermission().then((permission) => {

            // If the user accepts, let's create a notification
            if (permission === "granted") {
                const notification = new Notification("Hi there!");
                subscribe();
                // …
            }
            else {
                alert('Permission denied - status - ' + permission);
            }
        });

        //TODO:// The above promise does not appear to resolve in safari when the user has granted permission so using a timer hack to trigger 
        // the subscription to give us time to select an option.
        setTimeout(() => {
            subscribe();
        }, 6000);
    }
}

const urlBase64ToUint8Array = (base64String: string) => {
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