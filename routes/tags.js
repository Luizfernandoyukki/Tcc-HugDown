const express = require('express');
const router = express.Router();

const { tagController } = require('../controllers');

// Listar tags
router.get('/', async (req, res) => {
  try {
    const tags = await tagController.listar(req, res, true);
    res.render('tags/index', { tags });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Página de criação de tag
router.get('/create', (req, res) => {
  res.render('tags/create');
});

// Criar tag
router.post('/create', async (req, res) => {
  try {
    await tagController.criar(req, res);
    res.redirect('/tags');
  } catch (error) {
    res.status(400).render('tags/create', { error: error.message });
  }
});

// Página de edição de tag
router.get('/:id/edit', async (req, res) => {
  try {
    const tag = await tagController.buscarPorId(req, res);
    res.render('tags/edit', { tag });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Atualizar tag
router.post('/:id/edit', async (req, res) => {
  try {
    await tagController.atualizar(req, res);
    res.redirect('/tags');
  } catch (error) {
    res.status(400).render('tags/edit', { error: error.message });
  }
});

// Visualizar tag
router.get('/:id', async (req, res) => {
  try {
    const tag = await tagController.buscarPorId(req, res);
    res.render('tags/show', { tag });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Remover tag
router.post('/:id/delete', async (req, res) => {
  try {
    await tagController.remover(req, res);
    res.redirect('/tags');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;