const { Postagem, Usuario, Categoria, Tag } = require('../models');


// Listar todas as postagens
exports.listar = async (req, resOrOptions) => {
  console.log('[LOG] postagemController.listar chamado');
  let posts = await Postagem.findAll({
    include: [
      { model: Usuario, as: 'autor' },
      { model: Categoria, as: 'categoria' },
      { model: Tag, as: 'tag' }
    ]
  });

  // Ajusta o caminho da foto do autor
  posts = posts.map(post => {
    if (post.autor && post.autor.foto_perfil) {
      if (!/^https?:\/\//.test(post.autor.foto_perfil)) {
        post.autor.foto_perfil = '..' + post.autor.foto_perfil;
      }
    }
    return post;
  });

  if (resOrOptions && resOrOptions.raw) return posts;
  if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.json(posts);
  return posts;
};

// Buscar postagem por ID
exports.buscarPorId = async (req, resOrOptions) => {
  let id;
  // Suporta chamada por rota (req) ou por objeto (params)
  if (req && req.params && req.params.id) {
    id = req.params.id;
  } else if (req && req.id) {
    id = req.id;
  } else if (resOrOptions && resOrOptions.params && resOrOptions.params.id) {
    id = resOrOptions.params.id;
  } else if (resOrOptions && resOrOptions.id) {
    id = resOrOptions.id;
  }
  if (!id) return null;

  console.log('[LOG] postagemController.buscarPorId chamado para id:', id);

  const postagem = await Postagem.findByPk(id, {
    include: [
      { model: Usuario, as: 'autor' },
      { model: Categoria, as: 'categoria' },
      { model: Tag, as: 'tag' }
    ]
  });

  if (!postagem) {
    if (resOrOptions && typeof resOrOptions.render === 'function') {
      return resOrOptions.render('error', { error: 'Postagem não encontrada' });
    }
    if (resOrOptions && typeof resOrOptions.json === 'function') {
      return resOrOptions.status(404).json({ error: 'Postagem não encontrada' });
    }
    return null;
  }

  if (resOrOptions && resOrOptions.raw) return postagem;
  if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.json(postagem);
  return postagem;
};

// Criar nova postagem
exports.criar = async (req, res) => {
  try {
    console.log('[LOG] postagemController.criar chamado. Body:', req.body, 'File:', req.file);
    // Monta dados da postagem
    const dados = {
      id_autor: req.session.userId,
      id_categoria: req.body.id_categoria,
      tipo_postagem: req.body.tipo_postagem,
      conteudo: req.body.conteudo,
      titulo: req.body.titulo,
      resumo: req.body.resumo,
      artigo_cientifico: req.body.artigo_cientifico === 'true',
      // url_midia: req.file ? `/post/${req.body.tipo_postagem === 'article' ? 'artigos' : 'public'}/${req.file.filename}` : null,
      url_midia: req.file ? '/post/' + req.file.filename : null,
      latitude: req.body.latitude || null,
      longitude: req.body.longitude || null
    };

    // Cria a postagem
    const novaPostagem = await Postagem.create(dados);

    // Relaciona tags (N para N)
    if (req.body['tags[]']) {
      let tagsArray = Array.isArray(req.body['tags[]']) ? req.body['tags[]'] : [req.body['tags[]']];
      await novaPostagem.setTags(tagsArray);
    }

    res.status(201).json(novaPostagem);
  } catch (err) {
    console.error('[ERRO] Erro ao criar postagem:', err);
    // Log detalhado para debug
    res.status(500).json({ error: 'Erro ao criar postagem: ' + err.message });
  }
};

// Atualizar postagem
exports.atualizar = async (req, res) => {
  try {
    console.log('[LOG] postagemController.atualizar chamado para id:', req.params.id, 'Body:', req.body);
    const postagem = await Postagem.findByPk(req.params.id);
    if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });

    await postagem.update({
      titulo: req.body.titulo,
      resumo: req.body.resumo,
      conteudo: req.body.conteudo,
      tipo_postagem: req.body.tipo_postagem,
      artigo_cientifico: req.body.artigo_cientifico === 'Sim' || req.body.artigo_cientifico === 'true',
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      id_categoria: req.body.id_categoria
    });

    // Atualiza tags (N para N)
    if (req.body['tags[]']) {
      let tagsArray = Array.isArray(req.body['tags[]']) ? req.body['tags[]'] : [req.body['tags[]']];
      await postagem.setTags(tagsArray); // Só funciona se o relacionamento estiver correto!
    }

    res.json(postagem);
  } catch (err) {
    console.error('[ERRO] Erro ao atualizar postagem:', err);
    res.status(500).json({ error: 'Erro ao atualizar postagem: ' + err.message });
  }
};

// Remover postagem
exports.remover = async (req, res) => {
  console.log('[LOG] postagemController.remover chamado para id:', req.params.id);
  const postagem = await Postagem.findByPk(req.params.id);
  if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });
  await postagem.destroy();
  res.json({ mensagem: 'Postagem removida com sucesso' });
};
