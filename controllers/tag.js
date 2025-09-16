const { Tag, TagTraducao, Postagem, Categoria } = require('../models');

// Listar todas as tags
exports.listar = async (req, resOrOptions) => {
  const tags = await Tag.findAll({
    include: [
      { model: TagTraducao, as: 'traducoes' },
      { 
        model: Postagem, 
        as: 'postagens', 
        include: [
          { model: Categoria, as: 'categoria' }, // Corrigido: use 'as'
          { model: Tag, as: 'tag' }
        ] 
      }
    ]
  });
  if (resOrOptions && resOrOptions.raw) return tags;
  if (resOrOptions && typeof resOrOptions.render === 'function') {
    return resOrOptions.render('tags/index', { tags });
  }
  if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.json(tags);
  return tags;
};

// Buscar tag por ID
exports.buscarPorId = async (req, resOrOptions) => {
  const id = req.params.id || req.id;
  const tag = await Tag.findByPk(id, {
    include: [
      { model: TagTraducao, as: 'traducoes' },
      { 
        model: Postagem, 
        as: 'postagens', 
        include: [
          { model: Categoria, as: 'categoria' }, // Corrigido: use 'as'
          { model: Tag, as: 'tag' }
        ] 
      }
    ]
  });
  if (!tag) {
    if (resOrOptions && typeof resOrOptions.render === 'function') {
      return resOrOptions.render('error', { error: 'Tag não encontrada' });
    }
    if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.status(404).json({ error: 'Tag não encontrada' });
    return null;
  }
  if (resOrOptions && typeof resOrOptions.render === 'function') {
    return resOrOptions.render('tags/show', { tag });
  }
  if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.json(tag);
  return tag;
};

// Criar nova tag
exports.criar = async (req, resOrOptions) => {
  try {
    const novaTag = await Tag.create(req.body);
    if (resOrOptions && typeof resOrOptions.render === 'function') {
      return resOrOptions.render('tags/create', { tag: novaTag, sucesso: true });
    }
    if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.status(201).json(novaTag);
    return novaTag;
  } catch (err) {
    if (resOrOptions && typeof resOrOptions.render === 'function') {
      return resOrOptions.render('tags/create', { error: 'Erro ao criar tag: ' + err.message });
    }
    if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.status(500).json({ error: 'Erro ao criar tag: ' + err.message });
    throw err;
  }
};

// Atualizar tag
exports.atualizar = async (req, resOrOptions) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) {
    if (resOrOptions && typeof resOrOptions.render === 'function') {
      return resOrOptions.render('error', { error: 'Tag não encontrada' });
    }
    if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.status(404).json({ error: 'Tag não encontrada' });
    return null;
  }
  await tag.update(req.body);
  if (resOrOptions && typeof resOrOptions.render === 'function') {
    return resOrOptions.render('tags/edit', { tag, sucesso: true });
  }
  if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.json(tag);
  return tag;
};

// Remover tag
exports.remover = async (req, resOrOptions) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) {
    if (resOrOptions && typeof resOrOptions.render === 'function') {
      return resOrOptions.render('error', { error: 'Tag não encontrada' });
    }
    if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.status(404).json({ error: 'Tag não encontrada' });
    return null;
  }
  await tag.destroy();
  if (resOrOptions && typeof resOrOptions.render === 'function') {
    return resOrOptions.render('tags/index', { sucesso: true });
  }
  if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.json({ mensagem: 'Tag removida com sucesso' });
  return { mensagem: 'Tag removida com sucesso' };
};

// Buscar tag por nome
exports.buscarPorNome = async (nome, resOrOptions) => {
  if (!nome) return null;
  const tag = await Tag.findOne({
    where: { nome_tag: nome },
    include: [
      { model: TagTraducao, as: 'traducoes' },
      { 
        model: Postagem, 
        as: 'postagens', 
        include: [
          { model: Categoria, as: 'categoria' }, // Corrigido: use 'as'
          { model: Tag, as: 'tag' }
        ] 
      }
    ]
  });
  if (!tag) {
    if (resOrOptions && typeof resOrOptions.render === 'function') {
      return resOrOptions.render('error', { error: 'Tag não encontrada' });
    }
    return null;
  }
  if (resOrOptions && typeof resOrOptions.render === 'function') {
    return resOrOptions.render('tags/show', { tag });
  }
  return tag;
};

// Listar postagens por tag
exports.listarPorTag = async (req, resOrOptions) => {
  const id_tag = resOrOptions && resOrOptions.id_tag ? resOrOptions.id_tag : req.params.id_tag;
  if (!id_tag) {
    if (resOrOptions && typeof resOrOptions.render === 'function') {
      return resOrOptions.render('tags/show', { postagens: [] });
    }
    return [];
  }
  const postagens = await Postagem.findAll({
    where: { id_tag },
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Tag, as: 'tag' }
    ]
  });
  if (resOrOptions && typeof resOrOptions.render === 'function') {
    return resOrOptions.render('tags/show', { postagens });
  }
  return postagens;
};