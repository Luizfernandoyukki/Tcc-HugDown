const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');
const advertenciaController = require('../controllers/advertencia');
const requireSuperAdmin = require('../middlewares/requireSuperAdmin');

// Rota para listar usuários (admin)
router.get('/usuarios', async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

// Rota para advertir usuário
router.post('/usuarios/:id/advertir', requireSuperAdmin, async (req, res) => {
  const { motivo, detalhes } = req.body;
  await advertenciaController.criar({ body: { id_usuario: req.params.id, motivo, detalhes } }, res);
  res.json({ sucesso: true });
});

router.post('/usuarios/:id/banir', requireSuperAdmin, async (req, res) => {
  const { motivo } = req.body;
  await Usuario.update(
    { bloqueado: true, motivo_bloqueio: motivo, data_bloqueio: new Date() },
    { where: { id_usuario: req.params.id } }
  );
  res.json({ sucesso: true });
});

router.post('/usuarios/:id/desbanir', requireSuperAdmin, async (req, res) => {
  const { motivo } = req.body;
  await Usuario.update(
    { bloqueado: false, motivo_desbloqueio: motivo, data_desbloqueio: new Date() },
    { where: { id_usuario: req.params.id } }
  );
  res.json({ sucesso: true });
});

module.exports = router;