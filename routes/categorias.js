const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index.js');
const requireLogin = require('../middlewares/auth');
const { categoriaController } = controllers;

// Middleware para permitir apenas admin
function requireAdmin(req, res, next) {
  const usuario = req.session.usuario || res.locals.usuario;
  if (!usuario || !usuario.nivel_admin || usuario.nivel_admin === 'user') {
    return res.status(403).render('error', { error: 'Apenas administradores podem acessar esta página.' });
  }
  next();
}

// Listar categorias (apenas admin)
router.get('/', requireLogin, requireAdmin, async (req, res) => {
  const categorias = await categoriaController.listar(req, { raw: true });
  res.render('categorias/index', { categorias });
});
// Formulário de criação de categoria (apenas admin)
router.get('/create', requireLogin, requireAdmin, (req, res) => {
  res.render('categorias/create');
});

// Criar categoria (apenas admin)
router.post('/', requireLogin, requireAdmin, async (req, res) => {
  await categoriaController.criar(req);
  res.redirect('/categorias');
});

// Editar categoria (apenas admin)
router.get('/:id/edit', requireLogin, requireAdmin, async (req, res) => {
  const categoria = await categoriaController.buscarPorId(req.params.id);
  if (!categoria) return res.status(404).render('error', { error: 'Categoria não encontrada' });
  res.render('categorias/edit', { categoria });
});
router.post('/:id/edit', requireLogin, requireAdmin, async (req, res) => {
  await categoriaController.atualizar(req.params.id, req.body);
  res.redirect('/categorias');
});

// Remover categoria (apenas admin)
router.post('/:id/delete', requireLogin, requireAdmin, async (req, res) => {
  await categoriaController.remover(req.params.id);
  res.redirect('/categorias');
});

// Filtro por categoria (exibe postagens da categoria)
router.get('/nome/:nome', async (req, res) => {
  const categoria = await categoriaController.buscarPorNome(req.params.nome);
  if (!categoria) return res.status(404).render('error', { error: 'Categoria não encontrada' });
  // ...chame o controller de postagens se necessário...
});

module.exports = router;
