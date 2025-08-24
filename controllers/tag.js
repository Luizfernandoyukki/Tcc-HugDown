const { Tag, TagTraducao } = require('../models');

// Listar todas as tags
exports.listar = async (req, resOrOptions) => {
  const tags = await Tag.findAll({ include: [{ model: TagTraducao, as: 'traducoes' }] });
  if (resOrOptions && resOrOptions.raw) return tags;
  return resOrOptions.json(tags);
};

// Buscar tag por ID
exports.buscarPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const tag = await Tag.findByPk(id, {
      include: [{ model: TagTraducao, as: 'traducoes' }]
    });
    if (!tag) return res.status(404).json({ error: 'Tag não encontrada' });
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tag: ' + error.message });
  }
};

// Criar nova tag
exports.criar = async (req, res) => {
  try {
    const { nome_tag, descricao_tag } = req.body;
    if (!nome_tag) {
      return res.status(400).json({ error: 'Preencha o nome da tag.' });
    }
    const novaTag = await Tag.create({ nome_tag, descricao_tag });
    res.status(201).json(novaTag);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tag: ' + error.message });
  }
};

// Atualizar tag
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const tag = await Tag.findByPk(id);
    if (!tag) return res.status(404).json({ error: 'Tag não encontrada' });
    await tag.update(req.body);
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tag: ' + error.message });
  }
};

// Remover tag
exports.remover = async (req, res) => {
  try {
    const id = req.params.id;
    const tag = await Tag.findByPk(id);
    if (!tag) return res.status(404).json({ error: 'Tag não encontrada' });
    await tag.destroy();
    res.json({ mensagem: 'Tag removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover tag: ' + error.message });
  }
};

// Buscar tag por nome
exports.buscarPorNome = async (nome, options) => {
  const tag = await Tag.findOne({ where: { nome_tag: nome } });
  if (options && options.raw) return tag;
  if (!tag) return options && options.status ? options.status(404).json({ error: 'Tag não encontrada' }) : null;
  return options && options.json ? options.json(tag) : tag;
};