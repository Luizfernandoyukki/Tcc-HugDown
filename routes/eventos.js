const express = require('express');
const router = express.Router();

const { eventoController } = require('../controllers');

// Listar eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await eventoController.listar(req, res, true);
    res.render('eventos/index', { eventos });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Página de criação de evento
router.get('/create', (req, res) => {
  res.render('eventos/create');
});

// Criar evento
router.post('/create', async (req, res) => {
  try {
    await eventoController.criar(req, res);
    res.redirect('/eventos');
  } catch (error) {
    res.status(400).render('eventos/create', { error: error.message });
  }
});

// Página de edição de evento
router.get('/:id/edit', async (req, res) => {
  try {
    const evento = await eventoController.buscarPorId(req, res);
    res.render('eventos/edit', { evento });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Atualizar evento
router.post('/:id/edit', async (req, res) => {
  try {
    await eventoController.atualizar(req, res);
    res.redirect('/eventos');
  } catch (error) {
    res.status(400).render('eventos/edit', { error: error.message });
  }
});

// Visualizar evento
router.get('/:id', async (req, res) => {
  try {
    const evento = await eventoController.buscarPorId(req, res);
    res.render('eventos/show', { evento });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Remover evento
router.post('/:id/delete', async (req, res) => {
  try {
    await eventoController.remover(req, res);
    res.redirect('/eventos');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;