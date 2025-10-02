const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index.js');
const { eventoController } = controllers;
const { ParticipanteEvento } = require('../models');
const requireLogin = require('../middlewares/auth');
const https = require('https');

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
  const { Evento, Usuario, ParticipanteEvento } = require('../models');
  try {
    const eventos = await Evento.findAll({
      include: [
        { model: Usuario, as: 'organizador' },
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
  const { Evento, Usuario, ParticipanteEvento } = require('../models');
  try {
    const evento = await Evento.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'organizador' },
        { model: ParticipanteEvento, as: 'participantes' }
      ]
    });
    if (!evento) {
      return res.status(404).render('error', { error: 'Evento não encontrado' });
    }

    // helper: reverse geocode via Nominatim usando https nativo (com timeout e fallback)
    const reverseGeocode = (lat, lon, timeout = 4000) => {
      return new Promise((resolve) => {
        if (!lat || !lon) return resolve(null);
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
        const req = https.get(url, { headers: { 'User-Agent': 'HugDown/1.0 (+https://example.com)' } }, (resp) => {
          let data = '';
          resp.on('data', chunk => data += chunk);
          resp.on('end', () => {
            try {
              const json = JSON.parse(data);
              resolve(json);
            } catch (e) {
              resolve(null);
            }
          });
        });
        req.on('error', () => resolve(null));
        req.setTimeout(timeout, () => { req.abort(); resolve(null); });
      });
    };

    // Busca endereço corrido via Nominatim se houver latitude/longitude
    let enderecoCompleto = '';
    if (evento.latitude && evento.longitude) {
      try {
        const data = await reverseGeocode(evento.latitude, evento.longitude);
        if (data && data.address) {
          enderecoCompleto = [
            data.address.road,
            data.address.neighbourhood,
            data.address.suburb,
            data.address.city || data.address.town || data.address.village,
            data.address.state,
            data.address.country
          ].filter(Boolean).join(', ');
        }
      } catch (err) {
        console.error('[EVENTOS][GET /:id] erro no reverseGeocode:', err && err.stack ? err.stack : err);
        enderecoCompleto = '';
      }
    }

    // Verifica se o usuário já está inscrito
    let usuarioJaInscrito = false;
    if (req.session.userId) {
      try {
        const inscrito = await ParticipanteEvento.findOne({
          where: { id_evento: evento.id_evento, id_usuario: req.session.userId }
        });
        usuarioJaInscrito = !!inscrito;
      } catch (err) {
        console.error('[EVENTOS][GET /:id] erro ao verificar inscricao:', err && err.stack ? err.stack : err);
      }
    }

    // render com callback para capturar erro de template
    res.render('eventos/show', {
      evento,
      isLoggedIn: !!req.session.userId,
      usuarioJaInscrito,
      enderecoCompleto,
      usuario: res.locals.usuario
    }, function(renderErr, html) {
      if (renderErr) {
        console.error('[EVENTOS][RENDER][ERRO] ao renderizar eventos/show:', renderErr && renderErr.stack ? renderErr.stack : renderErr);
        return res.status(500).render('error', { error: 'Erro ao renderizar evento: ' + (renderErr.message || renderErr) });
      }
      res.send(html);
    });
  } catch (err) {
    console.error('[EVENTOS][GET /:id][ERRO]', err && err.stack ? err.stack : err);
    res.status(500).render('error', { error: 'Erro ao buscar evento: ' + (err.message || err) });
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