const webpush = require('web-push');
const { Usuario } = require('../models');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  'mailto:seu-email@dominio.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Salve as subscriptions no banco (adicione um campo subscription na tabela usuarios ou crie uma tabela subscriptions)
exports.saveSubscription = async (id_usuario, subscription) => {
  // Exemplo: salva no campo subscription do usuário (ajuste conforme seu modelo)
  await Usuario.update({ subscription: JSON.stringify(subscription) }, { where: { id_usuario } });
};

// Envia push para um usuário
exports.sendPushToUser = async (id_usuario, notification) => {
  const usuario = await Usuario.findByPk(id_usuario);
  if (!usuario || !usuario.subscription) return;
  try {
    await webpush.sendNotification(JSON.parse(usuario.subscription), JSON.stringify(notification));
  } catch (err) {
    console.error('[WEBPUSH] Erro ao enviar push:', err);
  }
};
