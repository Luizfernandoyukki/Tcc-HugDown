const { DocumentoVerificacao, Usuario, Administrador } = require('../models');

// Listar todos os documentos de verificação
exports.listar = async (req, res) => {
  try {
    const docs = await DocumentoVerificacao.findAll({
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Administrador, as: 'adminVerificador' }
      ]
    });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar documentos de verificação', details: err.message });
  }
};

// Buscar documento por ID
exports.buscarPorId = async (req, res) => {
  try {
    const doc = await DocumentoVerificacao.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Administrador, as: 'adminVerificador' }
      ]
    });
    if (!doc) return res.status(404).json({ error: 'Documento não encontrado' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar documento', details: err.message });
  }
};

// Criar novo documento de verificação
exports.criar = async (req, res) => {
  try {
    const novo = await DocumentoVerificacao.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar documento', details: err.message });
  }
};

// Atualizar documento de verificação
exports.atualizar = async (req, res) => {
  try {
    const [updated] = await DocumentoVerificacao.update(req.body, {
      where: { id_documento: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Documento não encontrado' });
    const docAtualizado = await DocumentoVerificacao.findByPk(req.params.id);
    res.json(docAtualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar documento', details: err.message });
  }
};

// Remover documento de verificação
exports.remover = async (req, res) => {
  try {
    const deleted = await DocumentoVerificacao.destroy({
      where: { id_documento: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Documento não encontrado' });
    res.json({ message: 'Documento removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover documento', details: err.message });
  }
};