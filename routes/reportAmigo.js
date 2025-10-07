const express = require('express');
const router = express.Router();
const reportAmigoController = require('../controllers/reportAmigo');
const requireLogin = require('../middlewares/auth');

// Criar report de amizade (denúncia de amigo)
router.post('/', requireLogin, reportAmigoController.criar);

// Listar reports de amizade (admin)
router.get('/', requireLogin, reportAmigoController.listar);

// Rota básica para evitar erro de importação
router.get('/', (req, res) => {
  res.json({ mensagem: 'Rota de report de amigo funcionando.' });
});

module.exports = router;
