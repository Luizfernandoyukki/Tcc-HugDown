const { DocumentoVerificacao, Usuario, Administrador } = require('../models');

const documentoVerificacaoController = {
  // Listar todos os documentos de verificação
  listar: async (req, res) => {
    try {
      const docs = await DocumentoVerificacao.findAll({
        include: [
          { model: Usuario, as: 'usuario' },
          { model: Administrador, as: 'adminVerificador' }
        ]
      });
      res.json(docs);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar documentos: ' + err.message });
    }
  },

  // Buscar documento por ID
  buscarPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const doc = await DocumentoVerificacao.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuario' },
          { model: Administrador, as: 'adminVerificador' }
        ]
      });
      if (!doc) return res.status(404).json({ error: 'Documento não encontrado' });
      res.json(doc);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar documento: ' + err.message });
    }
  },

  // Criar novo documento de verificação
  criar: async (req, res) => {
    try {
      const {
        id_usuario,
        caminho_arquivo,
        tipo_documento,
        numero_documento,
        instituicao,
        status,
        data_verificacao,
        verificado_por_admin,
        observacoes
      } = req.body;
      // Validação dos campos obrigatórios
      if (!id_usuario || !caminho_arquivo) {
        return res.status(400).json({ error: 'Preencha id_usuario e caminho_arquivo.' });
      }
      const novo = await DocumentoVerificacao.create({
        id_usuario,
        caminho_arquivo,
        tipo_documento,
        numero_documento,
        instituicao,
        status: status || 'pending',
        data_verificacao,
        verificado_por_admin,
        observacoes
      });
      res.status(201).json(novo);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar documento: ' + err.message });
    }
  },

  // Atualizar documento de verificação
  atualizar: async (req, res) => {
    try {
      const id = req.params.id;
      const [updated] = await DocumentoVerificacao.update(req.body, {
        where: { id_documento: id }
      });
      if (!updated) return res.status(404).json({ error: 'Documento não encontrado' });
      const docAtualizado = await DocumentoVerificacao.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuario' },
          { model: Administrador, as: 'adminVerificador' }
        ]
      });
      res.json(docAtualizado);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar documento: ' + err.message });
    }
  },

  // Remover documento de verificação
  remover: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await DocumentoVerificacao.destroy({
        where: { id_documento: id }
      });
      if (!deleted) return res.status(404).json({ error: 'Documento não encontrado' });
      res.json({ message: 'Documento removido com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover documento: ' + err.message });
    }
  }
};

module.exports = documentoVerificacaoController;
