// ...existing code...

async function registrarPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  // Registra o Service Worker
  const swReg = await navigator.serviceWorker.register('/sw.js');

  // Pede permissão para notificações
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return;

  // Busca a chave pública do backend
  const res = await fetch('/webpush/public-key');
  const { publicKey } = await res.json();

  // Faz a subscription
  const subscription = await swReg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  // Envia para o backend
  await fetch('/webpush/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription })
  });
}

// Utilitário para converter a chave
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Chame a função ao carregar a página
registrarPush();

// ...existing code...