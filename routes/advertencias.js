const express = require('express');
const router = express.Router();
const advertenciaController = require('../controllers/advertencia');
const requireLogin = require('../middlewares/auth');

// Criar advertência
router.post('/', requireLogin, advertenciaController.criar);

// Listar advertências de um usuário
router.get('/:id', requireLogin, advertenciaController.listarPorUsuario);

// Remover advertência
router.post('/:id/remover', requireLogin, advertenciaController.remover);

module.exports = router;
