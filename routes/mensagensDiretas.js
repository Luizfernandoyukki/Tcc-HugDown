const express = require('express');
const router = express.Router();
const { MensagemDireta, Usuario, Amizade } = require('../models');
const { Op } = require('sequelize');
const notificacaoService = require('../controllers/notificacaoService');

// Middleware: exige login
function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

// Lista todas as conversas do usuário logado (inbox)
router.get('/', requireLogin, async (req, res) => {
  const userId = req.session.userId;
  // Busca todos os usuários com quem há amizade aceita
  const amizades = await Amizade.findAll({
    where: {
      [Op.or]: [
        { id_solicitante: userId },
        { id_destinatario: userId }
      ],
      status_amizade: 'accepted'
    }
  });
  // Extrai IDs dos amigos
  const amigosIds = amizades.map(a =>
    a.id_solicitante === userId ? a.id_destinatario : a.id_solicitante
  );
  // Busca usuários amigos
  const amigos = await Usuario.findAll({
    where: { id_usuario: { [Op.in]: amigosIds } }
  });
  // Busca últimas mensagens por amigo
  const ultimasMensagens = await Promise.all(amigos.map(async amigo => {
    const msg = await MensagemDireta.findOne({
      where: {
        [Op.or]: [
          { id_remetente: userId, id_destinatario: amigo.id_usuario },
          { id_remetente: amigo.id_usuario, id_destinatario: userId }
        ]
      },
      order: [['data_envio', 'DESC']]
    });
    return { amigo, ultimaMensagem: msg };
  }));
  res.render('mensagensDiretas/index', { conversas: ultimasMensagens, usuario: res.locals.usuario });
});

// Página de conversa (DM) com um usuário específico
router.get('/conversa/:id', requireLogin, async (req, res) => {
  const userId = req.session.userId;
  const outroId = parseInt(req.params.id, 10);
  // Verifica se são amigos
  const amizade = await Amizade.findOne({
    where: {
      [Op.or]: [
        { id_solicitante: userId, id_destinatario: outroId },
        { id_solicitante: outroId, id_destinatario: userId }
      ],
      status_amizade: 'accepted'
    }
  });
  if (!amizade) return res.status(403).render('error', { message: 'Você só pode conversar com amigos.' });
  // Busca mensagens trocadas
  const mensagens = await MensagemDireta.findAll({
    where: {
      [Op.or]: [
        { id_remetente: userId, id_destinatario: outroId },
        { id_remetente: outroId, id_destinatario: userId }
      ]
    },
    order: [['data_envio', 'ASC']],
    include: [
      { model: Usuario, as: 'remetente' },
      { model: Usuario, as: 'destinatario' }
    ]
  });
  const amigo = await Usuario.findByPk(outroId);
  res.render('mensagensDiretas/DMcreate', { mensagens, amigo, usuario: res.locals.usuario });
});

// Envia uma nova mensagem na DM
router.post('/conversa/:id', requireLogin, async (req, res) => {
  const userId = req.session.userId;
  const outroId = parseInt(req.params.id, 10);
  const { conteudo } = req.body;
  if (!conteudo) return res.redirect(`/mensagens-diretas/conversa/${outroId}`);
  // Verifica amizade
  const amizade = await Amizade.findOne({
    where: {
      [Op.or]: [
        { id_solicitante: userId, id_destinatario: outroId },
        { id_solicitante: outroId, id_destinatario: userId }
      ],
      status_amizade: 'accepted'
    }
  });
  if (!amizade) return res.status(403).render('error', { message: 'Você só pode conversar com amigos.' });
  const mensagem = await MensagemDireta.create({
    id_remetente: userId,
    id_destinatario: outroId,
    conteudo
  });
  // Notifica o destinatário
  await notificacaoService.notificarMensagemDireta(outroId);
  res.redirect(`/mensagens-diretas/conversa/${outroId}`);
});

// Marcar mensagens como lidas (opcional, via AJAX)
router.post('/conversa/:id/lidas', requireLogin, async (req, res) => {
  const userId = req.session.userId;
  const outroId = parseInt(req.params.id, 10);
  await MensagemDireta.update(
    { lida: true },
    {
      where: {
        id_remetente: outroId,
        id_destinatario: userId,
        lida: false
      }
    }
  );
  res.json({ sucesso: true });
});

// Show (não faz nada por enquanto)
router.get('/show', requireLogin, (req, res) => {
  res.render('mensagensDiretas/show', { usuario: res.locals.usuario });
});

module.exports = router;