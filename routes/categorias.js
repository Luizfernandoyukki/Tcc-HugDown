const express = require('express');
const router = express.Router();

const { categoriaController } = require('../controllers');

// Listar categorias
router.get('/', async (req, res) => {
  try {
    const categorias = await categoriaController.listar(req, res, true);
    res.render('categorias/index', { categorias });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Página de criação de categoria
router.get('/create', (req, res) => {
  res.render('categorias/create');
});

// Criar categoria
router.post('/create', async (req, res) => {
  try {
    await categoriaController.criar(req, res);
    res.redirect('/categorias');
  } catch (error) {
    res.status(400).render('categorias/create', { error: error.message });
  }
});

// Página de edição de categoria
router.get('/:id/edit', async (req, res) => {
  try {
    const categoria = await categoriaController.buscarPorId(req, res);
    res.render('categorias/edit', { categoria });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Atualizar categoria
router.post('/:id/edit', async (req, res) => {
  try {
    await categoriaController.atualizar(req, res);
    res.redirect('/categorias');
  } catch (error) {
    res.status(400).render('categorias/edit', { error: error.message });
  }
});

// Visualizar categoria
router.get('/:id', async (req, res) => {
  try {
    const categoria = await categoriaController.buscarPorId(req, res);
    res.render('categorias/show', { categoria });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Remover categoria
router.post('/:id/delete', async (req, res) => {
  try {
    await categoriaController.remover(req, res);
    res.redirect('/categorias');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;