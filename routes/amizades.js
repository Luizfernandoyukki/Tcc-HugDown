const express = require('express');
const router = express.Router();
const { Amizade } = require('../models');
const { criarNotificacao } = require('../controllers/notificacao');

// Middleware para exigir login
function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

// Enviar solicitação de amizade
router.post('/solicitar', requireLogin, async (req, res) => {
  const id_solicitante = req.session.userId;
  const id_destinatario = parseInt(req.body.id_destinatario, 10);
  if (!id_destinatario || id_destinatario === id_solicitante) {
    return res.redirect('back');
  }
  // Verifica se já existe amizade
  const existente = await Amizade.findOne({
    where: {
      id_solicitante,
      id_destinatario
    }
  });
  if (!existente) {
    await Amizade.create({
      id_solicitante,
      id_destinatario,
      status_amizade: 'pending'
    });
    // Notifica o destinatário
    await criarNotificacao({
      id_usuario: id_destinatario,
      tipo_notificacao: 'friendship',
      titulo: 'Novo pedido de amizade',
      mensagem: 'Você recebeu um novo pedido de amizade.'
    });
  }
  res.redirect('back');
});

// Aceitar amizade (exemplo, ajuste conforme sua lógica)
router.post('/:id/aceitar', requireLogin, async (req, res) => {
  const amizade = await Amizade.findByPk(req.params.id);
  if (amizade && amizade.id_destinatario === req.session.userId) {
    await amizade.update({ status_amizade: 'accepted' });
    // Notifica o solicitante
    await criarNotificacao({
      id_usuario: amizade.id_solicitante,
      tipo_notificacao: 'friendship',
      titulo: 'Pedido de amizade aceito',
      mensagem: 'Seu pedido de amizade foi aceito!'
    });
  }
  res.redirect('/notificacoes');
});

module.exports = router;