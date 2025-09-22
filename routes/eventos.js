const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index.js');
const { eventoController } = controllers;
const { ParticipanteEvento } = require('../models');
const requireLogin = require('../middlewares/auth');

// Exibir formulário de criação de evento (GET /eventos/create)
router.get('/create', requireLogin, async (req, res) => {
  try {
    console.log('[EVENTOS][GET /create] Usuário logado:', req.session.userId);
    const { Categoria } = require('../models');
    const categorias = await Categoria.findAll({ where: { ativo: true } });
    console.log('[EVENTOS][GET /create] Categorias carregadas:', categorias.length);
    res.render('eventos/create', { categorias });
  } catch (err) {
    console.error('[EVENTOS][GET /create][ERRO]', err);
    res.status(500).render('error', { error: 'Erro ao carregar formulário de criação de evento: ' + err.message });
  }
});

// Listar todos os eventos ordenados por data (GET /eventos)
router.get('/', requireLogin, async (req, res) => {
  const { Evento, Usuario, Categoria, ParticipanteEvento } = require('../models');
  try {
    const eventos = await Evento.findAll({
      include: [
        { model: Usuario, as: 'organizador' },
        { model: Categoria, as: 'categoria' },
        { model: ParticipanteEvento, as: 'participantes' }
      ],
      where: { ativo: true },
      order: [['data_inicio', 'ASC']]
    });
    res.render('eventos/index', { eventos });
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao buscar eventos: ' + err.message });
  }
});

// Exibir detalhes do evento (GET /eventos/:id)
router.get('/:id', requireLogin, async (req, res) => {
  const { Evento, Usuario, Categoria, ParticipanteEvento } = require('../models');
  try {
    const evento = await Evento.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'organizador' },
        { model: Categoria, as: 'categoria' },
        { model: ParticipanteEvento, as: 'participantes' }
      ]
    });
    if (!evento) return res.status(404).render('error', { error: 'Evento não encontrado' });

    // Verifica se o usuário já está inscrito
    let usuarioJaInscrito = false;
    if (req.session.userId) {
      const inscrito = await ParticipanteEvento.findOne({
        where: { id_evento: evento.id_evento, id_usuario: req.session.userId }
      });
      usuarioJaInscrito = !!inscrito;
    }

    res.render('eventos/show', { evento, isLoggedIn: !!req.session.userId, usuarioJaInscrito });
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao buscar evento: ' + err.message });
  }
});

// Criar evento (POST /eventos)
router.post('/', eventoController.criar);

// Atualizar evento (PUT /eventos/:id)
router.put('/:id', eventoController.atualizar);

// Remover evento (DELETE /eventos/:id)
router.delete('/:id', eventoController.remover);

// Inscrever usuário no evento (POST /eventos/:id/participar)
router.post('/:id/participar', requireLogin, async (req, res) => {
  const { ParticipanteEvento } = require('../models');
  try {
    await ParticipanteEvento.findOrCreate({
      where: {
        id_evento: req.params.id,
        id_usuario: req.session.userId
      },
      defaults: {
        status_participacao: 'confirmed'
      }
    });
    res.redirect(`/eventos/${req.params.id}`);
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao inscrever no evento: ' + err.message });
  }
});

// Criar evento (POST /eventos)
router.post('/', requireLogin, async (req, res, next) => {
  try {
    console.log('[EVENTOS][POST /] Dados recebidos:', req.body);
    // Chama o controller normalmente
    await require('../controllers').eventoController.criar(req, res, next);
  } catch (err) {
    console.error('[EVENTOS][POST /][ERRO]', err);
    res.status(500).render('error', { error: 'Erro ao criar evento: ' + err.message });
  }
});

module.exports = router;