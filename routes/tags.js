const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index.js');
const requireLogin = require('../middlewares/auth');
const { tagController } = controllers;
const { podeEditarOuVerTag } = require('../middlewares/auth');

router.get('/', requireLogin, async (req, res) => {
  // Lista todas as tags com traduções e postagens relacionadas
  await tagController.listar(req, res);
});

router.get('/create', requireLogin, (req, res) => {
  // Renderiza tela de criação de tag
  res.render('tags/create');
});

router.post('/', requireLogin, async (req, res) => {
  // Cria nova tag e retorna para a tela de criação com feedback
  await tagController.criar(req, res);
});

router.get('/:id/edit', requireLogin, podeEditarOuVerTag, async (req, res) => {
  // Busca tag por ID para edição
  const tag = await tagController.buscarPorId(req, {});
  if (!tag) return res.status(404).render('error', { error: 'Tag não encontrada' });
  res.render('tags/edit', { tag });
});

router.post('/:id/edit', requireLogin, podeEditarOuVerTag, async (req, res) => {
  // Atualiza tag
  await tagController.atualizar(req, res);
});

router.get('/:id', requireLogin, podeEditarOuVerTag, async (req, res) => {
  // Visualiza tag por ID, com traduções e postagens
  await tagController.buscarPorId(req, res);
});

// Filtro por tag (exibe postagens da tag)
router.get('/nome/:nome', requireLogin, async (req, res) => {
  // Busca tag por nome e envia para a view de visualização
  await tagController.buscarPorNome(req.params.nome, res);
});

module.exports = router;
