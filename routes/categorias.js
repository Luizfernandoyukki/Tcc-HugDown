const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index.js');
const requireLogin = require('../middlewares/auth');
const { categoriaController } = controllers;

router.get('/', async (req, res) => {
  const categorias = await categoriaController.listar(req, { raw: true });
  res.render('categorias/index', { categorias });
});
router.get('/:id', async (req, res) => {
  const categoria = await categoriaController.buscarPorId(req.params.id);
  if (!categoria) return res.status(404).render('error', { error: 'Categoria não encontrada' });
  res.render('categorias/show', { categoria });
});

// Filtro por categoria (exibe postagens da categoria)
router.get('/nome/:nome', async (req, res) => {
  const categoria = await categoriaController.buscarPorNome(req.params.nome);
  if (!categoria) return res.status(404).render('error', { error: 'Categoria não encontrada' });
  // ...chame o controller de postagens se necessário...
});

module.exports = router;
