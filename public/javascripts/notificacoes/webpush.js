// Solicita permissão para notificações do navegador
if ('Notification' in window && navigator.serviceWorker) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      // Aqui você pode registrar o service worker e lidar com push real
      // Exemplo básico de notificação local:
      navigator.serviceWorker.register('/sw.js').then(() => {
        // Você pode enviar uma notificação de teste aqui
        // new Notification('Bem-vindo ao HugDown!');
      });
    }
  });
}

// Função para mostrar notificação local (exemplo)
function mostrarNotificacao(titulo, mensagem) {
  if (Notification.permission === 'granted') {
    new Notification(titulo, { body: mensagem });
  }
}

async function registerPush() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const registration = await navigator.serviceWorker.register('/sw.js');
    const { publicKey } = await fetch('/webpush/public-key').then(r => r.json());
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });
    await fetch('/webpush/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription })
    });
    console.log('[WEBPUSH] Subscription registrada!');
  }
}

// Utilitário para converter chave
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

// Chame registerPush() ao carregar a página se o usuário estiver logado
if (window.usuarioLogado) {
  registerPush();
}
