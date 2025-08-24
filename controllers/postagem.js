const { Postagem, Usuario, Categoria, Tag } = require('../models');

// Listar todas as postagens
exports.listar = async (req, resOrOptions) => {
  const posts = await Postagem.findAll({
    include: [
      { model: Usuario, as: 'autor' },
      { model: Categoria, as: 'categoria' },
      { model: Tag, as: 'tag' }
    ]
  });
  if (resOrOptions && resOrOptions.raw) return posts;
  if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.json(posts);
  return posts;
};

// Buscar postagem por ID
exports.buscarPorId = async (req, res) => {
  const postagem = await Postagem.findByPk(req.params.id, {
    include: [
      { model: Usuario, as: 'autor' },
      { model: Categoria, as: 'categoria' },
      { model: Tag, as: 'tag' }
    ]
  });
  if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });
  res.json(postagem);
};

// Criar nova postagem
exports.criar = async (req, res) => {
  try {
    const novaPostagem = await Postagem.create(req.body);
    res.status(201).json(novaPostagem);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar postagem: ' + err.message });
  }
};

// Atualizar postagem
exports.atualizar = async (req, res) => {
  const postagem = await Postagem.findByPk(req.params.id);
  if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });
  await postagem.update(req.body);
  res.json(postagem);
};

// Remover postagem
exports.remover = async (req, res) => {
  const postagem = await Postagem.findByPk(req.params.id);
  if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });
  await postagem.destroy();
  res.json({ mensagem: 'Postagem removida com sucesso' });
};

// Listar postagens por categoria
exports.listarPorCategoria = async (req, options) => {
  const id_categoria = options && options.id_categoria ? options.id_categoria : req.params.id_categoria;
  if (!id_categoria) return [];
  const posts = await Postagem.findAll({
    where: { id_categoria },
    include: [
      { model: Usuario, as: 'autor' },
      { model: Categoria, as: 'categoria' }
    ]
  });
  if (options && options.raw) return posts;
  return posts;
};

// Listar postagens por tag
exports.listarPorTag = async (req, res) => {
  const posts = await Postagem.findAll({
    where: { id_tag: req.params.id_tag },
    include: [
      { model: Usuario, as: 'autor' },
      { model: Tag, as: 'tag' }
    ]
  });
  res.json(posts);
};
