const { Tag, TagTraducao } = require('../models');

// Listar todas as tags
exports.listar = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [
        { model: TagTraducao, as: 'traducoes' }
      ]
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar tag por ID
exports.buscarPorId = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        { model: TagTraducao, as: 'traducoes' }
      ]
    });
    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar nova tag
exports.criar = async (req, res) => {
  try {
    const novaTag = await Tag.create(req.body);
    res.status(201).json(novaTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar tag
exports.atualizar = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }
    await tag.update(req.body);
    res.json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover tag
exports.remover = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }
    await tag.destroy();
    res.json({ mensagem: 'Tag removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};