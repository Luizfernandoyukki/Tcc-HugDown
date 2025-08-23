const { Postagem, Usuario } = require('../models');

// Listar todas as postagens
exports.listar = async (req, resOrOptions) => {
  const posts = await Postagem.findAll({
    include: [{ model: Usuario, as: 'autor' }]
  });
  if (resOrOptions && resOrOptions.raw) return posts;
  return resOrOptions.json(posts);
};

// Buscar postagem por ID
exports.buscarPorId = async (req, res) => {
  try {
    const postagem = await Postagem.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'autor' }]
    });
    if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });
    res.json(postagem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar postagem: ' + error.message });
  }
};

// Criar nova postagem
exports.criar = async (req, res) => {
  try {
    const novaPostagem = await Postagem.create(req.body);
    res.status(201).json(novaPostagem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar postagem: ' + error.message });
  }
};

// Atualizar postagem
exports.atualizar = async (req, res) => {
  try {
    const postagem = await Postagem.findByPk(req.params.id);
    if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });
    await postagem.update(req.body);
    res.json(postagem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar postagem: ' + error.message });
  }
};

// Remover postagem
exports.remover = async (req, res) => {
  try {
    const postagem = await Postagem.findByPk(req.params.id);
    if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });
    await postagem.destroy();
    res.json({ message: 'Postagem removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover postagem: ' + error.message });
  }
};

// Listar postagens por categoria
exports.listarPorCategoria = async (req, res) => {
  try {
    const postagens = await Postagem.findAll({
      where: { id_categoria: req.params.id_categoria },
      include: [{ model: Usuario, as: 'autor' }]
    });
    res.json(postagens);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar postagens por categoria: ' + error.message });
  }
};

// Listar postagens por tag
exports.listarPorTag = async (req, res) => {
  try {
    const postagens = await Postagem.findAll({
      include: [
        { association: 'tags', where: { id_tag: req.params.id_tag } },
        { model: Usuario, as: 'autor' }
      ]
    });
    res.json(postagens);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar postagens por tag: ' + error.message });
  }
};
