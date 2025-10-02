const webpush = require('web-push');
const { Usuario } = require('../models');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

// Só configura VAPID se as chaves estiverem presentes
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails('mailto:seu-email@dominio.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  } catch (err) {
    console.error('[WEBPUSH] Falha ao configurar VAPID:', err);
  }
} else {
  console.warn('[WEBPUSH] Chaves VAPID não encontradas em env. Push notifications estarão desabilitadas.');
}

// Salve as subscriptions no banco
exports.saveSubscription = async (id_usuario, subscription) => {
  try {
    await Usuario.update({ subscription: JSON.stringify(subscription) }, { where: { id_usuario } });
  } catch (err) {
    console.error('[WEBPUSH] Erro ao salvar subscription:', err);
    throw err;
  }
};

// Envia push para um usuário (se houver subscription e chaves configuradas)
exports.sendPushToUser = async (id_usuario, notification) => {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    // Não tentamos enviar se chaves não estiverem configuradas
    return;
  }
  try {
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario || !usuario.subscription) return;
    const sub = JSON.parse(usuario.subscription);
    await webpush.sendNotification(sub, JSON.stringify(notification));
  } catch (err) {
    console.error('[WEBPUSH] Erro ao enviar push para usuário', id_usuario, err);
  }
};
