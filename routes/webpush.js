const express = require('express');
const router = express.Router();
const webpushService = require('../controllers/webpushService');

// Middleware para exigir login
function requireLogin(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Precisa estar logado' });
  next();
}

// Registrar subscription
router.post('/subscribe', requireLogin, async (req, res) => {
  await webpushService.saveSubscription(req.session.userId, req.body.subscription);
  res.json({ sucesso: true });
});

// Expor a chave pública para o frontend
router.get('/public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || 'SUA_CHAVE_PUBLICA_AQUI' });
});

module.exports = router;
