self.addEventListener('push', function (event) {
    const options = {
        body: event.data.text(),
        icon: '/path/to/icon.png',
        badge: '/path/to/badge.png',
        vibrate: [200, 100, 200],
        data: {
            url: event.data.url
        }
    };

    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    event.waitUntil(
        // clients.openWindow(event.notification.data.url)
    );
});

self.addEventListener('activate', async () => {
    console.log('Service worker has been activated - internal')
    // This will be called only once when the service worker is activated.
    try {
        const options = {}
        const subscription = await self.registration.pushManager.subscribe(options)
        console.log(JSON.stringify(subscription))
    } catch (err) {
        console.log('Error', err)
    }
})

self.addEventListener('pushsubscriptionchange', () => {
    console.log('Push subscription change - internal');
    // try {
    //     const options = {}
    //     const subscription = await self.registration.pushManager.subscribe(options)
    //     console.log(JSON.stringify(subscription))
    // } catch (err) {
    //     console.log('Error', err)
    // }

});

