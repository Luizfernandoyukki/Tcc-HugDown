const express = require('express');
const router = express.Router();
const { Usuario, Postagem, Notificacao, DocumentoVerificacao, Administrador, Advertencia } = require('../models');
const fs = require('fs');
const path = require('path');

// Listar usuários
router.get('/usuarios', async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

// Listar postagens
router.get('/postagens', async (req, res) => {
  const postagens = await Postagem.findAll();
  res.json(postagens);
});

// Listar documentos de verificação pendentes
router.get('/documentos/pendentes', async (req, res) => {
  const docs = await DocumentoVerificacao.findAll({
    where: { status: 'pending' },
    include: [{ model: Usuario, as: 'usuario' }]
  });
  res.json(docs);
});

// Advertir usuário
router.post('/usuarios/:id/advertir', async (req, res) => {
  const { id } = req.params;
  const { motivo, detalhes } = req.body;
  await Advertencia.create({ id_usuario: id, motivo, detalhes });
  await Notificacao.create({
    id_usuario: id,
    tipo_notificacao: 'system',
    titulo: 'Advertência',
    mensagem: motivo + (detalhes ? ' - ' + detalhes : ''),
    lida: false
  });
  const usuario = await Usuario.findByPk(id);
  if (usuario && usuario.email) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"HugDown" <no-reply@seudominio.com>',
      to: usuario.email,
      subject: 'Advertência recebida - HugDown',
      text: `Você recebeu uma advertência.\nMotivo: ${motivo}${detalhes ? '\nDetalhes: ' + detalhes : ''}\n\nSe tiver dúvidas, entre em contato com SuporteHugDown@gmail.com.`
    });
  }
  res.json({ sucesso: true });
});

// Banir usuário
router.post('/usuarios/:id/banir', async (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
  if (usuario.bloqueado) return res.json({ sucesso: false, error: 'Usuário já está banido.' });
  await usuario.update({ bloqueado: true, motivo_bloqueio: motivo, data_bloqueio: new Date() });
  await Notificacao.create({
    id_usuario: usuario.id_usuario,
    tipo_notificacao: 'system',
    titulo: 'Banimento',
    mensagem: motivo,
    lida: false
  });
  if (usuario.email) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"HugDown" <no-reply@seudominio.com>',
      to: usuario.email,
      subject: 'Conta banida - HugDown',
      text: `Sua conta foi banida.\nMotivo: ${motivo}\nPara recorrer, entre em contato com SuporteHugDown@gmail.com.`
    });
  }
  res.json({ sucesso: true });
});

// Desbanir usuário
router.post('/usuarios/:id/desbanir', async (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
  if (!usuario.bloqueado) return res.json({ sucesso: false, error: 'Usuário já está desbloqueado.' });
  await usuario.update({ bloqueado: false, motivo_desbloqueio: motivo, data_desbloqueio: new Date() });
  await Notificacao.create({
    id_usuario: usuario.id_usuario,
    tipo_notificacao: 'system',
    titulo: 'Desbanimento',
    mensagem: motivo,
    lida: false
  });
  if (usuario.email) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"HugDown" <no-reply@seudominio.com>',
      to: usuario.email,
      subject: 'Conta desbanida - HugDown',
      text: `Sua conta foi desbanida.\nMotivo: ${motivo}\nEm caso de dúvidas, entre em contato com SuporteHugDown@gmail.com.`
    });
  }
  res.json({ sucesso: true });
});

// Excluir postagem
router.post('/postagens/:id/excluir', async (req, res) => {
  const { id } = req.params;
  const postagem = await Postagem.findByPk(id);
  if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });
  await postagem.destroy();
  res.json({ sucesso: true });
});

// Aprovar documento
router.post('/documentos/:id/aprovar', async (req, res) => {
  const doc = await DocumentoVerificacao.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Documento não encontrado' });

  // Cria ProfissionalSaude se não existir
  const { ProfissionalSaude, Usuario, Administrador } = require('../models');
  const usuario = await Usuario.findByPk(doc.id_usuario);
  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

  // Busca o id_admin do administrador logado
  const admin = await Administrador.findOne({ where: { id_usuario: req.session.userId } });
  if (!admin) return res.status(403).json({ error: 'Administrador não encontrado.' });

  // Evita duplicidade
  const jaExiste = await ProfissionalSaude.findOne({ where: { id_usuario: usuario.id_usuario } });
  if (!jaExiste) {
    await ProfissionalSaude.create({
      id_usuario: usuario.id_usuario,
      tipo_registro: doc.tipo_documento?.toUpperCase() || 'OUTRO',
      numero_registro: doc.numero_documento,
      uf_registro: '', // Não tem no documento, pode pedir para preencher depois
      especialidade: doc.observacoes,
      instituicao: doc.instituicao,
      data_registro: new Date(),
      status_verificacao: 'aprovado',
      data_verificacao: new Date(),
      verificado_por: admin.id_admin, // Corrigido: usa id_admin do admin logado
    });
  }

  await doc.update({ status: 'approved', data_verificacao: new Date() });
  if (!usuario.verificado) await usuario.update({ verificado: true });

  res.json({ success: true, mensagem: 'Documento aprovado com sucesso!' });
});

// Rejeitar documento
router.post('/documentos/:id/rejeitar', async (req, res) => {
  const doc = await DocumentoVerificacao.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Documento não encontrado' });
  await doc.update({ status: 'rejected', data_verificacao: new Date() });
  res.json({ sucesso: true });
});

// Dados detalhados de report de evento para previsualização AJAX
router.get('/reports-eventos/:id/dados', async (req, res) => {
  const { ReportEvento, Evento } = require('../models');
  const report = await ReportEvento.findByPk(req.params.id, {
    include: [{ model: Evento, as: 'evento' }]
  });
  if (!report || !report.evento) return res.status(404).json({ error: 'Evento não encontrado' });
  res.json({
    titulo_evento: report.evento.titulo_evento,
    descricao_evento: report.evento.descricao_evento,
    data_inicio: report.evento.data_inicio,
    data_fim: report.evento.data_fim,
    local_evento: report.evento.local_evento,
    motivo: report.motivo,
    detalhes: report.detalhes
  });
});

// Excluir report de evento e o evento (AJAX) - exclui todos os reports do mesmo evento
router.post('/reports-eventos/:id/excluir', async (req, res) => {
  const { ReportEvento, Evento } = require('../models');
  const report = await ReportEvento.findByPk(req.params.id);
  if (!report) return res.status(404).json({ error: 'Report não encontrado' });
  // Exclui o evento relacionado, se existir
  if (report.id_evento) {
    const evento = await Evento.findByPk(report.id_evento);
    if (evento) await evento.destroy();
    // Exclui todos os reports desse evento
    await ReportEvento.destroy({ where: { id_evento: report.id_evento } });
  } else {
    await report.destroy();
  }
  res.json({ sucesso: true });
});

// Ignorar (dismiss) report de evento (AJAX) - exclui todos os reports do mesmo evento se não existir mais evento
router.post('/reports-eventos/:id/dismiss', async (req, res) => {
  const { ReportEvento, Evento } = require('../models');
  const report = await ReportEvento.findByPk(req.params.id);
  if (!report) return res.status(404).json({ error: 'Report não encontrado' });
  // Se o evento não existe mais, remove todos os reports desse evento
  const evento = report.id_evento ? await Evento.findByPk(report.id_evento) : null;
  if (!evento && report.id_evento) {
    await ReportEvento.destroy({ where: { id_evento: report.id_evento } });
  } else {
    await report.destroy();
  }
  res.json({ sucesso: true });
});

module.exports = router;