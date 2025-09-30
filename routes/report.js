const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports');
const requireLogin = require('../middlewares/auth');

// Criar report (denúncia)
router.post('/', requireLogin, reportsController.criar);

// Listar reports (admin/moderação)
router.get('/', requireLogin, reportsController.listar);

module.exports = router;
