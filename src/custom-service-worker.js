importScripts('./ngsw-worker.js');

(function () {
    'use strict';

    self.addEventListener('notificationclick', (event) => {
        console.log("This is custom service worker notificationclick method.");
        console.log('Notification details: ', event.notification);
        if (clients.openWindow && event.notification.data) {
            event.waitUntil(clients.openWindow("https://waveapp-f4960.firebaseapp.com/foro/" + event.notification.data.foro));
        }
    });
}
    ());