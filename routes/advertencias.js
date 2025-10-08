const express = require('express');
const router = express.Router();
const advertenciaController = require('../controllers/advertencia');
const requireLogin = require('../middlewares/auth');

// Listar todas as advertências agrupadas por usuário (admin/super)
router.get('/agrupadas', advertenciaController.listarTodasAgrupadas);

// Criar advertência
router.post('/', requireLogin, advertenciaController.criar);

// Listar advertências de um usuário
router.get('/:id', requireLogin, advertenciaController.listarPorUsuario);

// Remover advertência
router.post('/:id/remover', requireLogin, advertenciaController.remover);

module.exports = router;
