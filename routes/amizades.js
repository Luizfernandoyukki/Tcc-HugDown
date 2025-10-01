const express = require('express');
const router = express.Router();
const amizadeController = require('../controllers/amizade');
const { Amizade, Usuario } = require('../models');
const { criarNotificacao } = require('../controllers/notificacao');

// Middleware para exigir login
function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

// Página de busca de usuários para amizade
router.get('/', requireLogin, amizadeController.listarUsuariosComStatus);

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
    const amizade = await Amizade.create({
      id_solicitante,
      id_destinatario,
      status_amizade: 'pending'
    });
    // Notifica o destinatário, incluindo id_amizade
    await criarNotificacao({
      id_usuario: id_destinatario,
      tipo_notificacao: 'friendship',
      titulo: 'Novo pedido de amizade',
      mensagem: 'Você recebeu um novo pedido de amizade.',
      id_amizade: amizade.id // <-- Adiciona o id da amizade
    });
  }
  res.redirect('back');
});

// Aceitar amizade (corrigido para /aceitar/:id)
router.post('/aceitar/:id', requireLogin, async (req, res) => {
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
    return res.json({ sucesso: true });
  }
  res.status(404).json({ error: 'Pedido não encontrado ou não autorizado.' });
});

// Recusar amizade (corrigido para /rejeitar/:id)
router.post('/rejeitar/:id', requireLogin, async (req, res) => {
  const amizade = await Amizade.findByPk(req.params.id);
  if (amizade && amizade.id_destinatario === req.session.userId) {
    await amizade.update({ status_amizade: 'rejected' });
    // Notifica o solicitante
    await criarNotificacao({
      id_usuario: amizade.id_solicitante,
      tipo_notificacao: 'friendship',
      titulo: 'Pedido de amizade rejeitado',
      mensagem: 'Seu pedido de amizade foi rejeitado.'
    });
    return res.json({ sucesso: true });
  }
  res.status(404).json({ error: 'Pedido não encontrado ou não autorizado.' });
});

// Rota para listar pedidos de amizade pendentes do usuário logado
router.get('/pedidos', requireLogin, async (req, res) => {
  try {
    const id_destinatario = req.session.userId;
    // Busca pedidos pendentes onde o usuário logado é o destinatário
    const pedidos = await Amizade.findAll({
      where: {
        id_destinatario,
        status_amizade: 'pending'
      },
      include: [{
        model: Usuario,
        as: 'solicitante',
        attributes: ['id_usuario', 'nome_usuario', 'foto_perfil']
      }]
    });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pedidos de amizade.' });
  }
});

module.exports = router;