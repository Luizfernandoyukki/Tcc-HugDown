const { DocumentoVerificacao, Usuario, Administrador } = require('../models');

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
      const novoDocumento = await DocumentoVerificacao.create(req.body);
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
  }
};

module.exports = documentoVerificacaoController;
