const express = require('express');
const router = express.Router();

const { postagemController } = require('../controllers');

// Listar postagens (feed)
router.get('/', async (req, res) => {
  try {
    const posts = await postagemController.listar(req, res, true);
    res.render('postagens/index', { posts });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Página de criação de postagem
router.get('/create', (req, res) => {
  res.render('postagens/create');
});

// Criar postagem
router.post('/create', async (req, res) => {
  try {
    await postagemController.criar(req, res);
    res.redirect('/postagens');
  } catch (error) {
    res.status(400).render('postagens/create', { error: error.message });
  }
});

// Página de edição de postagem
router.get('/:id/edit', async (req, res) => {
  try {
    const post = await postagemController.buscarPorId(req, res);
    res.render('postagens/edit', { post });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Atualizar postagem
router.post('/:id/edit', async (req, res) => {
  try {
    await postagemController.atualizar(req, res);
    res.redirect('/postagens');
  } catch (error) {
    res.status(400).render('postagens/edit', { error: error.message });
  }
});

// Visualizar postagem
router.get('/:id', async (req, res) => {
  try {
    const post = await postagemController.buscarPorId(req, res);
    res.render('postagens/show', { post });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Remover postagem
router.post('/:id/delete', async (req, res) => {
  try {
    await postagemController.remover(req, res);
    res.redirect('/postagens');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;