const express = require('express');
const router = express.Router();
const { Notificacao } = require('../models');

// Middleware para exigir login
function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

// Listar notificações do usuário logado
router.get('/', requireLogin, async (req, res) => {
  const notificacoes = await Notificacao.findAll({
    where: { id_usuario: req.session.userId },
    order: [['data_criacao', 'DESC']]
  });
  res.render('notificacoes/index', { notificacoes });
});

// Marcar notificação como lida
router.post('/:id/ler', requireLogin, async (req, res) => {
  await Notificacao.update({ lida: true }, {
    where: { id_notificacao: req.params.id, id_usuario: req.session.userId }
  });
  res.redirect('/notificacoes');
});

router.post('/subscribe', async (req, res) => {
  // Salve a subscription no banco associada ao usuário logado
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Não autenticado' });
  // Salve req.body (subscription) no banco, relacionado ao userId
  // Exemplo: await Subscription.create({ id_usuario: userId, subscription: JSON.stringify(req.body) });
  res.json({ sucesso: true });
});

module.exports = router;