console.log("Service Worker Loaded...");

// notification.onclick = function(event) {

// 	console.log("Finally");
// 	window.open("https://www.geeksforgeeks.org", "_blank");

// }

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: "Hey! Did you make a transaction?",
    icon: "http://image.ibb.co/frYOFd/tmlogo.png",
    click_action: "https://www.google.com"
  });
});

// self.addEventListener('notificationclick', function(event) {
//     let url = 'https://www.google.com';
//     // event.notification.close(); // Android needs explicit close.
//     console.log("clicked");
//     event.waitUntil(
//         clients.matchAll({type: 'window'}).then( windowClients => {
//             // Check if there is already a window/tab open with the target URL
//             // for (var i = 0; i < windowClients.length; i++) {
//             //     var client = windowClients[i];
//             //     // If so, just focus it.
//             //     if (client.url === url && 'focus' in client) {
//             //         return client.focus();
//             //     }
//             // }
//             // If not, then open the target URL in a new window/tab.
//             if (clients.openWindow) {
//                 return clients.openWindow(url);
//             }
//         })
//     );
// });

