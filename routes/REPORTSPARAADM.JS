const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports');
const { Report, Postagem, Usuario, Notificacao, DocumentoVerificacao, Administrador } = require('../models');

// Listar todos os reports para o painel ADM (dados simples)
router.get('/admin/super/postagens/reportadas', reportsController.listarSimples);

// Visualizar detalhes de um report específico
router.get('/admin/super/reports/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findByPk(id);
    if (!report) return res.status(404).json({ error: 'Report não encontrado' });
    res.json({ snapshot_post: report.snapshot_post, motivo: report.motivo });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar report: ' + err.message });
  }
});

// Excluir postagem referida (cascata)
router.post('/admin/super/postagens/:id/excluir', async (req, res) => {
  const { id } = req.params;
  try {
    const postagem = await Postagem.findByPk(id);
    if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });
    await postagem.destroy(); // Remove postagem e tudo que tem ON DELETE CASCADE
    res.redirect('/admin/super'); // Redireciona para painel após exclusão
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir postagem: ' + err.message });
  }
});

// Advertir usuário (enviar notificação)
router.post('/admin/super/usuarios/:id/advertir', async (req, res) => {
  const { id } = req.params;
  const { mensagem } = req.body;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Cria notificação de advertência
    await Notificacao.create({
      id_usuario: usuario.id_usuario,
      tipo_notificacao: 'system',
      titulo: 'Advertência',
      mensagem: mensagem,
      url_relacionada: '',
      lida: false
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao advertir usuário: ' + err.message });
  }
});

// Listar documentos pendentes para painel super admin
router.get('/admin/super/documentos/pendentes', async (req, res) => {
  try {
    const docs = await DocumentoVerificacao.findAll({
      where: { status: 'pending' },
      include: [{ model: Usuario, as: 'usuario' }]
    });
    // Retorna dados essenciais para o painel
    res.json(docs.map(doc => ({
      id_documento: doc.id_documento,
      id_usuario: doc.id_usuario,
      usuario_nome: doc.usuario ? doc.usuario.nome_usuario : '',
      tipo_documento: doc.tipo_documento,
      instituicao: doc.instituicao,
      status: doc.status,
      caminho_arquivo: doc.caminho_arquivo,
      observacoes: doc.observacoes
    })));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar documentos: ' + err.message });
  }
});

// Visualizar detalhes de um documento
router.get('/admin/super/documentos/:id', async (req, res) => {
  try {
    const doc = await DocumentoVerificacao.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'usuario' }]
    });
    if (!doc) return res.status(404).json({ error: 'Documento não encontrado' });
    res.json({
      id_documento: doc.id_documento,
      tipo_documento: doc.tipo_documento,
      instituicao: doc.instituicao,
      status: doc.status,
      caminho_arquivo: doc.caminho_arquivo,
      observacoes: doc.observacoes
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar documento: ' + err.message });
  }
});

// Aprovar documento
router.post('/admin/super/documentos/:id/aprovar', async (req, res) => {
  try {
    const doc = await DocumentoVerificacao.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento não encontrado' });
    await doc.update({ status: 'approved', data_verificacao: new Date() });

    // Atualiza o usuário para verificado
    const usuario = await Usuario.findByPk(doc.id_usuario);
    if (usuario && !usuario.verificado) {
      await usuario.update({ verificado: true });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao aprovar documento: ' + err.message });
  }
});

// Rejeitar documento
router.post('/admin/super/documentos/:id/rejeitar', async (req, res) => {
  try {
    const doc = await DocumentoVerificacao.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento não encontrado' });
    await doc.update({ status: 'rejected', data_verificacao: new Date() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao rejeitar documento: ' + err.message });
  }
});

module.exports = router;
