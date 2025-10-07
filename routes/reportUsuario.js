const express = require('express');
const router = express.Router();
const reportUsuarioController = require('../controllers/reportUsuario');
const requireLogin = require('../middlewares/auth');

// Criar report de usuário
router.post('/', requireLogin, reportUsuarioController.criar);

// Listar reports de usuários (admin)
router.get('/', requireLogin, reportUsuarioController.listar);

module.exports = router;
