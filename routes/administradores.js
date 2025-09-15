const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const requireLogin = require('../middlewares/auth');
const { Administrador, Usuario, ProfissionalSaude, DocumentoVerificacao } = require('../models');
const { administradorController } = controllers;

// Middleware para garantir que só administradores podem acessar
async function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(403).render('error', { error: 'Acesso restrito a administradores.' });
  }
  const admin = await Administrador.findOne({ where: { id_usuario: req.session.userId } });
  if (!admin) {
    return res.status(403).render('error', { error: 'Acesso restrito a administradores.' });
  }
  res.locals.admin = admin;
  next();
}

// Painel admin
router.get('/', requireLogin, requireAdmin, async (req, res) => {
  const usuarios = await Usuario.findAll();
  const docs = await DocumentoVerificacao.findAll();
  const profissionais = await ProfissionalSaude.findAll();
  res.render('admin/painel', { usuarios, docs, profissionais });
});

// Listar documentos de verificação
router.get('/documentos', requireLogin, requireAdmin, async (req, res) => {
  const docs = await DocumentoVerificacao.findAll();
  res.render('admin/documentosVerificados', { docs });
});

// Aprovar documento
router.post('/documentos/:id/aprovar', requireLogin, requireAdmin, async (req, res) => {
  // lógica de aprovação
  // ...
  res.json({ sucesso: true });
});

// Rejeitar documento
router.post('/documentos/:id/rejeitar', requireLogin, requireAdmin, async (req, res) => {
  // lógica de rejeição
  // ...
  res.json({ sucesso: true });
});

// Banir/desativar usuário
router.post('/usuarios/:id/banir', requireLogin, requireAdmin, async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
  await usuario.update({ ativo: false });
  res.json({ sucesso: true });
});

// Aprovar profissional de saúde
router.post('/profissionais/:id/aprovar', requireLogin, requireAdmin, administradorController.aprovarProfissional);

module.exports = router;