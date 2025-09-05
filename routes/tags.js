const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const requireLogin = require('../middlewares/auth');
const { tagController } = controllers;

router.get('/', requireLogin, tagController.listar);
router.post('/', requireLogin, tagController.criar);

// Filtro por tag (exibe postagens da tag)
router.get('/nome/:nome', async (req, res) => {
  const tag = await tagController.buscarPorNome(req.params.nome);
  if (!tag || !tag.id_tag) {
    return res.status(404).render('error', { error: 'Tag não encontrada ou inválida' });
  }
  // ...chame o controller de postagens se necessário...
});

module.exports = router;
