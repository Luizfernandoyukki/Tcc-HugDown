const cron = require('node-cron');
const notificacaoService = require('./controllers/notificacaoService');

// Roda a cada hora (ajuste o cron pattern conforme sua necessidade)
cron.schedule('0 * * * *', async () => {
  try {
    await notificacaoService.notificarEventosProximosJob();
    console.log('[CRON] Notificações de eventos próximos enviadas.');
  } catch (err) {
    console.error('[CRON] Erro ao enviar notificações de eventos próximos:', err);
  }
});
