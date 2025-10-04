const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports');
const reportComentarioController = require('../controllers/reportComentario');
const { Report, Postagem, Usuario, Notificacao, DocumentoVerificacao, Administrador, ReportGrupo } = require('../models');
const fs = require('fs');
const path = require('path');

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

// Excluir postagem referida (cascata) - agora remove arquivo físico antes
router.post('/admin/super/postagens/:id/excluir', async (req, res) => {
  const { id } = req.params;
  try {
    const postagem = await Postagem.findByPk(id);
    if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });

    // Remove arquivo de mídia se existir e for local (ex: /post/..., /grupos/..., /perfis/...)
    try {
      const midia = postagem.url_midia;
      if (midia && typeof midia === 'string') {
        const candidate = midia.replace(/^\//, '');
        const filePath = path.join(__dirname, '..', candidate);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (err) {
      console.warn('[ADM][EXCLUIR_POSTAGEM] erro ao remover arquivo de mídia:', err.message);
    }

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
  } catch (err) {
    // Mensagem amigável para erro de FK
    if (err.message && err.message.includes('a foreign key constraint fails')) {
      return res.status(500).json({ error: 'Erro interno: não foi possível aprovar o documento. Verifique se o administrador está cadastrado corretamente.' });
    }
    res.status(500).json({ error: 'Erro ao aprovar documento: ' + err.message });
  }
});

// Rejeitar documento
router.post('/admin/super/documentos/:id/rejeitar', async (req, res) => {
  try {
    const doc = await DocumentoVerificacao.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento não encontrado' });
    await doc.update({ status: 'rejected', data_verificacao: new Date() });
    // Mensagem amigável de sucesso
    res.json({ success: true, mensagem: 'Documento rejeitado com sucesso!' });
  } catch (err) {
    // Mensagem amigável de erro
    res.json({ success: false, mensagem: 'Não foi possível rejeitar o documento. Tente novamente mais tarde.' });
  }
});

// Listar todos os reports de comentários para o painel ADM (dados simples)
router.get('/admin/super/comentarios/reportados', reportComentarioController.listarSimples);

// Visualizar detalhes de um report de comentário específico
router.get('/admin/super/reports-comentarios/:id', reportComentarioController.buscarPorId);

// Excluir comentário reportado (exemplo, ajuste conforme sua lógica)
router.post('/admin/super/comentarios/:id/excluir', async (req, res) => {
  const { id } = req.params;
  const { Comentario } = require('../models');
  const comentario = await Comentario.findByPk(id);
  if (!comentario) return res.status(404).json({ error: 'Comentário não encontrado' });
  await comentario.destroy();
  res.redirect('/admin/super');
});

// Excluir usuário (verifica se é admin antes)
router.post('/admin/super/usuarios/:id/excluir', async (req, res) => {
  const { Administrador, Usuario } = require('../models');
  const admin = await Administrador.findOne({ where: { id_usuario: req.session.userId } });
  if (!admin || admin.nivel_admin !== 'super_admin') return res.status(403).render('error', { error: 'Acesso negado.' });

  const alvoId = Number(req.params.id);
  try {
    const alvoAdmin = await Administrador.findOne({ where: { id_usuario: alvoId } });
    if (alvoAdmin) {
      return res.status(403).render('error', { error: 'Não é permitido excluir contas de administradores.' });
    }
    await Usuario.destroy({ where: { id_usuario: alvoId } });
    res.redirect('/admin/super'); // Redireciona para o painel admin
  } catch (err) {
    console.error('[ADMIN][EXCLUIR_USUARIO][ERRO]', err); // Adicione este log para debug
    res.status(500).render('error', { error: 'Erro ao excluir usuário: ' + err.message });
  }
});

module.exports = router;