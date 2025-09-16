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

router.get('/create', requireLogin, async (req, res) => {
  // Busca nomes das tags existentes e renderiza tela de criação de tag
  const tagsExistentes = await tagController.listarNomesSimples();
  res.render('tags/create', { tagsExistentes });
});

router.post('/', requireLogin, async (req, res) => {
  // Cria nova tag e retorna para a tela de criação com feedback e lista atualizada
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

router.delete('/delete/:nome', requireLogin, async (req, res) => {
  const nome = req.params.nome;
  try {
    const tag = await tagController.buscarPorNome(nome, {});
    if (!tag) return res.status(404).json({ error: 'Tag não encontrada' });
    await tag.destroy();
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar tag' });
  }
});

module.exports = router;
