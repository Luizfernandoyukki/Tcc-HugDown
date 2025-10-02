const { DocumentoVerificacao, Usuario, Administrador } = require('../models');
const { criarNotificacao } = require('./notificacao');

const documentoVerificacaoController = {
  // Listar todos os documentos de verificação
  listar: async (req, res) => {
    try {
      const documentos = await DocumentoVerificacao.findAll({
        include: [
          { model: Usuario, as: 'usuario' },
          { model: Administrador, as: 'verificador' }
        ]
      });
      res.json(documentos);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar documentos: ' + err.message });
    }
  },

  // Buscar documento por ID
  buscarPorId: async (req, res) => {
    try {
      const documento = await DocumentoVerificacao.findByPk(req.params.id, {
        include: [
          { model: Usuario, as: 'usuario' },
          { model: Administrador, as: 'verificador' }
        ]
      });
      if (!documento) return res.status(404).json({ error: 'Documento não encontrado' });
      res.json(documento);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar documento: ' + err.message });
    }
  },

  // Criar novo documento de verificação
  criar: async (req, res) => {
    try {
      // permite ser chamado via rota com upload (req.file) ou via API com body.caminho_arquivo
      const id_usuario = req.session?.userId || req.body.id_usuario;
      if (!id_usuario) return res.status(401).json({ error: 'Usuário não autenticado' });

      const caminho_arquivo = req.file ? ('/docs/' + req.file.filename) : (req.body.caminho_arquivo || null);
      if (!caminho_arquivo) return res.status(400).json({ error: 'Arquivo obrigatório' });

      const novoDocumento = await DocumentoVerificacao.create({
        id_usuario,
        tipo_documento: req.body.tipo_documento,
        numero_documento: req.body.numero_documento,
        instituicao: req.body.instituicao,
        caminho_arquivo,
        status: req.body.status || 'pending',
        observacoes: req.body.observacoes || null
      });
      res.status(201).json(novoDocumento);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar documento: ' + err.message });
    }
  },

  // Atualizar documento de verificação
  atualizar: async (req, res) => {
    try {
      const documento = await DocumentoVerificacao.findByPk(req.params.id);
      if (!documento) return res.status(404).json({ error: 'Documento não encontrado' });
      await documento.update(req.body);
      res.json(documento);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar documento: ' + err.message });
    }
  },

  // Remover documento de verificação
  remover: async (req, res) => {
    try {
      const documento = await DocumentoVerificacao.findByPk(req.params.id);
      if (!documento) return res.status(404).json({ error: 'Documento não encontrado' });
      await documento.destroy();
      res.json({ mensagem: 'Documento removido com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover documento: ' + err.message });
    }
  },

  // Aprovar documento de verificação
  aprovar: async (req, res) => {
    try {
      const documento = await DocumentoVerificacao.findByPk(req.params.id);
      if (!documento) return res.status(404).json({ error: 'Documento não encontrado' });
      
      // Lógica para aprovar o documento...
      
      await criarNotificacao({
        id_usuario: documento.id_usuario,
        tipo_notificacao: 'system',
        titulo: 'Documento aprovado',
        mensagem: 'Seu documento de verificação foi aprovado por um administrador.'
      });
      
      res.json({ mensagem: 'Documento aprovado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao aprovar documento: ' + err.message });
    }
  }
};

module.exports = documentoVerificacaoController;
