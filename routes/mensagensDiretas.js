const express = require('express');
const router = express.Router();
const { MensagemDireta, Usuario, Amizade } = require('../models');
const { Op } = require('sequelize');
const notificacaoService = require('../controllers/notificacaoService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do multer para imagens de mensagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Gera id da conversa baseado nos ids dos usuários
    let userId = req.session.userId;
    let outroId = parseInt(req.params.id, 10);
    if (!userId || !outroId) {
      // fallback para pasta padrão
      return cb(null, path.join(__dirname, '../public/images/mensagens'));
    }
    // Garante ordem crescente para id da conversa
    const idConversa = [userId, outroId].sort((a, b) => a - b).join('_');
    const dir = path.join(__dirname, '../public/images/mensagens', idConversa);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const upload = multer({ storage });

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

// Rota para AJAX: retorna mensagens em JSON
router.get('/conversa/:id/json', requireLogin, async (req, res) => {
  const userId = req.session.userId;
  const outroId = parseInt(req.params.id, 10);
  const amizade = await Amizade.findOne({
    where: {
      [Op.or]: [
        { id_solicitante: userId, id_destinatario: outroId },
        { id_solicitante: outroId, id_destinatario: userId }
      ],
      status_amizade: 'accepted'
    }
  });
  if (!amizade) return res.status(403).json({ error: 'Você só pode conversar com amigos.' });
  const mensagens = await MensagemDireta.findAll({
    where: {
      [Op.or]: [
        { id_remetente: userId, id_destinatario: outroId },
        { id_remetente: outroId, id_destinatario: userId }
      ]
    },
    order: [['data_envio', 'ASC']]
  });
  const amigo = await Usuario.findByPk(outroId);
  res.json({ mensagens, amigo, usuario: res.locals.usuario });
});

// Envia uma nova mensagem na DM (aceita só emoji ou só imagem)
// Adicione o middleware upload.single('imagem_chat') aqui:
router.post('/conversa/:id', requireLogin, upload.single('imagem_chat'), async (req, res) => {
  const userId = req.session.userId;
  const outroId = parseInt(req.params.id, 10);

  // LOGS DETALHADOS PARA DEBUG DUPLICIDADE
  console.log('[DM][POST][INICIO] userId:', userId, '| outroId:', outroId, '| timestamp:', new Date().toISOString());
  console.log('[DM][POST][HEADERS]', req.headers);
  console.log('[DM][POST][BODY]', req.body);

  // Corrige erro: garanta que as variáveis estão definidas
  let conteudo = req.body.conteudo || '';
  let emoji = '';
  let url_midia = null;

  // Permite texto simples, emoji ou imagem
  if (req.body.conteudo && /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u.test(req.body.conteudo.trim())) {
    emoji = req.body.conteudo.trim();
    conteudo = '';
  }
  // Gera id da conversa para salvar o caminho correto
  const idConversa = [userId, outroId].sort((a, b) => a - b).join('_');
  if (req.file && req.file.fieldname === 'imagem_chat') {
    url_midia = `/images/mensagens/${idConversa}/${req.file.filename}`;
  }

  // LOGS DE CAMPOS
  console.log('[DM][POST] conteudo:', conteudo, '| emoji:', emoji, '| url_midia:', url_midia);

  // Só bloqueia se tudo estiver vazio OU só espaços
  if ((!conteudo || !conteudo.trim()) && !emoji && !url_midia) {
    console.warn('[DM][POST][ERRO] Mensagem vazia recebida');
    return res.status(400).json({ error: 'Mensagem vazia.' });
  }

  try {
    // LOG antes de criar mensagem
    console.log('[DM][POST][CREATE] Vai criar mensagem:', {
      id_remetente: userId,
      id_destinatario: outroId,
      conteudo,
      emoji,
      url_midia
    });

    await MensagemDireta.create({
      id_remetente: userId,
      id_destinatario: outroId,
      conteudo,
      emoji,
      url_midia
    });

    // LOG após criar mensagem
    console.log('[DM][POST][CREATE] Mensagem criada com sucesso:', conteudo || emoji || url_midia);

    // Sempre responde JSON para fetch/AJAX
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      console.log('[DM][POST][RESPONSE] Respondendo JSON');
      return res.json({ sucesso: true });
    }
    // Só faz redirect se for submit tradicional
    console.log('[DM][POST][RESPONSE] Respondendo 204');
    res.status(204).end();
  } catch (err) {
    console.error('[DM][POST][ERRO][EXCEPTION]', err);
    res.status(500).json({ error: 'Erro ao salvar mensagem: ' + err.message });
  }
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