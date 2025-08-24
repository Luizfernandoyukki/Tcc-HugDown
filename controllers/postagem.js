const { Postagem, Usuario, Categoria, Tag } = require('../models');

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
    const {
      id_autor,
      tipo_postagem,
      id_categoria,
      id_tag,
      conteudo,
      url_midia,
      tipo_midia,
      artigo_cientifico,
      visualizacoes,
      privacidade,
      latitude,
      longitude
    } = req.body;
    // Validação dos campos obrigatórios
    if (!id_autor || !tipo_postagem) {
      return res.status(400).json({ error: 'Preencha id_autor e tipo_postagem.' });
    }
    const novaPostagem = await Postagem.create({
      id_autor,
      tipo_postagem,
      id_categoria,
      id_tag,
      conteudo,
      url_midia,
      tipo_midia,
      artigo_cientifico,
      visualizacoes,
      privacidade,
      latitude,
      longitude
    });
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
exports.listarPorCategoria = async (req, options) => {
  const posts = await Postagem.findAll({
    where: { id_categoria: options.id_categoria },
    include: [
      { model: Usuario, as: 'autor' },
      { model: Categoria, as: 'categoria' }
    ]
  });
  if (options && options.raw) return posts;
  return req.res.json(posts);
};

// Listar postagens por tag
exports.listarPorTag = async (req, options) => {
  const posts = await Postagem.findAll({
    where: { id_tag: options.id_tag },
    include: [
      { model: Usuario, as: 'autor' },
      { model: Categoria, as: 'categoria' },
      { model: Tag, as: 'tag' }
    ]
  });
  if (options && options.raw) return posts;
  return req.res.json(posts);
};
