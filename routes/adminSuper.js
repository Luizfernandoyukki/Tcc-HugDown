const express = require('express');
const router = express.Router();
const { Usuario, ReportGrupo, ReportEvento, ReportUsuario, Grupo, Evento } = require('../models');
const advertenciaController = require('../controllers/advertencia');
const requireSuperAdmin = require('../middlewares/requireSuperAdmin');
const nodemailer = require('nodemailer');

// Rota para listar usuários (admin)
router.get('/usuarios', async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

router.get('/reports-grupos', requireSuperAdmin, async (req, res) => {
  const reports = await ReportGrupo.findAll({
    include: [
      { model: Grupo, as: 'grupo' },
      { model: Usuario, as: 'usuario' }
    ],
    order: [['data_report', 'DESC']]
  });
  res.json(reports);
});

// Marcar report de grupo como revisado
router.post('/reports-grupos/:id/review', requireSuperAdmin, async (req, res) => {
  try {
    const updated = await ReportGrupo.update(
      { status: 'reviewed' },
      { where: { id_report: req.params.id } }
    );
    if (!updated) return res.status(404).json({ sucesso: false, error: 'Report não encontrado.' });
    res.json({ sucesso: true, mensagem: 'Report de grupo marcado como revisado.' });
  } catch (err) {
    res.status(500).json({ sucesso: false, error: err.message });
  }
});

// Ignorar report de grupo
router.post('/reports-grupos/:id/dismiss', requireSuperAdmin, async (req, res) => {
  try {
    const updated = await ReportGrupo.update(
      { status: 'dismissed' },
      { where: { id_report: req.params.id } }
    );
    if (!updated) return res.status(404).json({ sucesso: false, error: 'Report não encontrado.' });
    res.json({ sucesso: true, mensagem: 'Report de grupo ignorado.' });
  } catch (err) {
    res.status(500).json({ sucesso: false, error: err.message });
  }
});

// Listar reports de eventos
router.get('/reports-eventos', requireSuperAdmin, async (req, res) => {
  const reports = await ReportEvento.findAll({
    include: [
      { model: Evento, as: 'evento' },
      { model: Usuario, as: 'usuario' }
    ],
    order: [['data_report', 'DESC']]
  });
  res.json(reports);
});

// Marcar report de evento como revisado
router.post('/reports-eventos/:id/review', requireSuperAdmin, async (req, res) => {
  try {
    const updated = await ReportEvento.update(
      { status: 'reviewed' },
      { where: { id_report: req.params.id } }
    );
    if (!updated) return res.status(404).json({ sucesso: false, error: 'Report não encontrado.' });
    res.json({ sucesso: true, mensagem: 'Report de evento marcado como revisado.' });
  } catch (err) {
    res.status(500).json({ sucesso: false, error: err.message });
  }
});

// Ignorar report de evento
router.post('/reports-eventos/:id/dismiss', requireSuperAdmin, async (req, res) => {
  try {
    const updated = await ReportEvento.update(
      { status: 'dismissed' },
      { where: { id_report: req.params.id } }
    );
    if (!updated) return res.status(404).json({ sucesso: false, error: 'Report não encontrado.' });
    res.json({ sucesso: true, mensagem: 'Report de evento ignorado.' });
  } catch (err) {
    res.status(500).json({ sucesso: false, error: err.message });
  }
});

// Listar reports de usuários
router.get('/reports-usuarios', requireSuperAdmin, async (req, res) => {
  const reports = await ReportUsuario.findAll({
    include: [
      { model: Usuario, as: 'usuario' },
      { model: Usuario, as: 'denunciante' }
    ],
    order: [['data_report', 'DESC']]
  });
  res.json(reports);
});

// Marcar report de usuário como revisado
router.post('/reports-usuarios/:id/review', requireSuperAdmin, async (req, res) => {
  try {
    const updated = await ReportUsuario.update(
      { status: 'reviewed' },
      { where: { id_report: req.params.id } }
    );
    if (!updated) return res.status(404).json({ sucesso: false, error: 'Report não encontrado.' });
    res.json({ sucesso: true, mensagem: 'Report de usuário marcado como revisado.' });
  } catch (err) {
    res.status(500).json({ sucesso: false, error: err.message });
  }
});

// Ignorar report de usuário
router.post('/reports-usuarios/:id/dismiss', requireSuperAdmin, async (req, res) => {
  try {
    const updated = await ReportUsuario.update(
      { status: 'dismissed' },
      { where: { id_report: req.params.id } }
    );
    if (!updated) return res.status(404).json({ sucesso: false, error: 'Report não encontrado.' });
    res.json({ sucesso: true, mensagem: 'Report de usuário ignorado.' });
  } catch (err) {
    res.status(500).json({ sucesso: false, error: err.message });
  }
});

module.exports = router;