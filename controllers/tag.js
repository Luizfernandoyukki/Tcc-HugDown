const { Tag, TagTraducao, Postagem, Categoria } = require('../models');

// Listar todas as tags
exports.listar = async (req, resOrOptions) => {
  const tags = await Tag.findAll({
    include: [
      { model: TagTraducao, as: 'traducoes' },
      { model: Postagem, as: 'postagens' }
    ]
  });
  if (resOrOptions && resOrOptions.raw) return tags;
  if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.json(tags);
  return tags;
};

// Buscar tag por ID
exports.buscarPorId = async (req, res) => {
  const tag = await Tag.findByPk(req.params.id, {
    include: [
      { model: TagTraducao, as: 'traducoes' },
      { model: Postagem, as: 'postagens' }
    ]
  });
  if (!tag) return res.status(404).json({ error: 'Tag não encontrada' });
  res.json(tag);
};

// Criar nova tag
exports.criar = async (req, res) => {
  try {
    const novaTag = await Tag.create(req.body);
    res.status(201).json(novaTag);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar tag: ' + err.message });
  }
};

// Atualizar tag
exports.atualizar = async (req, res) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) return res.status(404).json({ error: 'Tag não encontrada' });
  await tag.update(req.body);
  res.json(tag);
};

// Remover tag
exports.remover = async (req, res) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) return res.status(404).json({ error: 'Tag não encontrada' });
  await tag.destroy();
  res.json({ mensagem: 'Tag removida com sucesso' });
};

// Buscar tag por nome
exports.buscarPorNome = async (nome) => {
  if (!nome) return null;
  const tag = await Tag.findOne({ where: { nome_tag: nome } });
  if (!tag) return null;
  // Garante que retorna objeto puro
  const tagObj = typeof tag.get === 'function' ? tag.get({ plain: true }) : tag;
  return tagObj && tagObj.id_tag ? tagObj : null;
};

// Listar postagens por tag
exports.listarPorTag = async (req, options) => {
  const id_tag = options && options.id_tag ? options.id_tag : req.params.id_tag;
  if (!id_tag) {
    // Retorne array vazio ou uma mensagem de erro
    return [];
  }
  return await Postagem.findAll({
    where: { id_tag },
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Tag, as: 'tag' }
    ]
  });
};