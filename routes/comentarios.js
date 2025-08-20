const express = require('express');
const router = express.Router();

const { comentarioController } = require('../controllers');

// Listar comentários de uma postagem
router.get('/postagem/:idPostagem', async (req, res) => {
  try {
    const comentarios = await comentarioController.listarPorPostagem(req, res);
    res.render('comentarios/index', { comentarios, idPostagem: req.params.idPostagem });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Página de criação de comentário
router.get('/postagem/:idPostagem/create', (req, res) => {
  res.render('comentarios/create', { idPostagem: req.params.idPostagem });
});

// Criar comentário
router.post('/postagem/:idPostagem/create', async (req, res) => {
  try {
    await comentarioController.criar(req, res);
    res.redirect(`/comentarios/postagem/${req.params.idPostagem}`);
  } catch (error) {
    res.status(400).render('comentarios/create', { error: error.message, idPostagem: req.params.idPostagem });
  }
});

// Página de edição de comentário
router.get('/:id/edit', async (req, res) => {
  try {
    const comentario = await comentarioController.buscarPorId(req, res);
    res.render('comentarios/edit', { comentario });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Atualizar comentário
router.post('/:id/edit', async (req, res) => {
  try {
    await comentarioController.atualizar(req, res);
    res.redirect(`/comentarios/postagem/${req.body.id_postagem}`);
  } catch (error) {
    res.status(400).render('comentarios/edit', { error: error.message });
  }
});

// Remover comentário
router.post('/:id/delete', async (req, res) => {
  try {
    await comentarioController.remover(req, res);
    res.redirect('back');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;