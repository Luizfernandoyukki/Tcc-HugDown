// Service Worker para Web Push Notifications (desenvolvimento)

self.addEventListener('push', function(event) {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'Notificação', body: event.data.text() };
  }
  self.registration.showNotification(data.title || 'Notificação', {
    body: data.body || '',
    icon: data.icon || '/images/logo.png',
    data: data.url ? { url: data.url } : undefined
  });
});

// Permite clicar na notificação e abrir a URL relacionada (se houver)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});
