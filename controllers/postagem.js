const { Postagem, Usuario, Categoria, Tag } = require('../models');
const { criarNotificacao } = require('./notificacao');


// Listar todas as postagens
exports.listar = async (req, resOrOptions) => {
  console.log('[LOG] postagemController.listar chamado');
  let posts = await Postagem.findAll({
    include: [
      { model: Usuario, as: 'autor' },
      { model: Categoria, as: 'categoria' },
      { model: Tag, as: 'tags' } // modelo correto: Tag, alias correto: 'tags'
    ]
  });

  // Preenche curtidas contando na tabela curtidas
  for (const post of posts) {
    post.curtidas = await require('../models').Curtida.count({ where: { id_postagem: post.id_postagem } });
    // Ajusta o caminho da foto do autor e adiciona links de perfil
    if (post.autor) {
      if (post.autor.foto_perfil && !/^https?:\/\//.test(post.autor.foto_perfil)) {
        post.autor.foto_perfil = '..' + post.autor.foto_perfil;
      }
      // Adiciona links para o perfil do autor
      post.autor.linkShow = `/usuarios/show/${post.autor.id_usuario}`;
      post.autor.linkIndex = `/usuarios/index/${post.autor.id_usuario}`;
    }
  }

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
      { model: Tag, as: 'tags' } // modelo correto: Tag, alias correto: 'tags'
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
    // Verifica se o usuário está logado
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Usuário não autenticado. Faça login para criar postagens.' });
    }
    // Monta dados da postagem
    const dados = {
      id_autor: req.session.userId,
      id_categoria: req.body.id_categoria,
      tipo_postagem: req.body.tipo_postagem,
      conteudo: req.body.conteudo,
      titulo: req.body.titulo,
      resumo: req.body.resumo,
      artigo_cientifico: req.body.artigo_cientifico === 'true',
      // Salva url_midia e tipo_midia se houver arquivo
      url_midia: (req.body.tipo_postagem === 'photo' || req.body.tipo_postagem === 'video') && req.file
        ? '/post/' + req.file.filename
        : null,
      tipo_midia: req.file ? req.file.mimetype : null,
      latitude: req.body.latitude || null,
      longitude: req.body.longitude || null
    };

    // Cria a postagem
    const novaPostagem = await Postagem.create(dados);

    // Relaciona tags (N para N) - use 'tags' e não 'tag'
    if (req.body.tags || req.body['tags[]']) {
      let tagsArray = req.body.tags || req.body['tags[]'];
      if (!Array.isArray(tagsArray)) tagsArray = [tagsArray];
      await novaPostagem.setTags(tagsArray);
    }

    // Notificar amigos (busque todos amigos do autor e envie notificação)
    if (typeof buscarAmigosDoUsuario === 'function') {
      const amigos = await buscarAmigosDoUsuario(req.session.userId);
      for (const amigo of amigos) {
        await criarNotificacao({
          id_usuario: amigo.id_usuario,
          tipo_notificacao: 'post',
          titulo: 'Novo post de um amigo',
          mensagem: 'Seu amigo postou algo novo.'
        });
      }
    } else {
      console.warn('[WARN] Função buscarAmigosDoUsuario não está definida. Nenhuma notificação enviada.');
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

// Exemplo: ao curtir postagem
exports.curtir = async (req, res) => {
  // ...existing code para curtir...
  await criarNotificacao({
    id_usuario: postagem.id_autor,
    tipo_notificacao: 'like',
    titulo: 'Sua postagem foi curtida',
    mensagem: 'Alguém curtiu sua postagem.'
  });
  // ...existing code...
};

// Listar postagens por categoria
exports.listarPorCategoria = async (req, options = {}) => {
  const id_categoria = options.id_categoria || (req.query && req.query.categoria);
  if (!id_categoria) return [];
  const posts = await Postagem.findAll({
    where: { id_categoria },
    include: [
      { model: Usuario, as: 'autor' },
      { model: Categoria, as: 'categoria' },
      { model: Tag, as: 'tags' } // modelo correto: Tag, alias correto: 'tags'
    ]
  });
  if (options.raw) return posts;
  if (options.json) return options.json(posts);
  return posts;
};

// Listar postagens por categoria e tag
exports.listarPorCategoriaETag = async (req, options = {}) => {
  const id_categoria = options.id_categoria || (req.query && req.query.categoria);
  const id_tag = options.id_tag || (req.query && req.query.tag);
  if (!id_categoria || !id_tag) return [];
  const posts = await Postagem.findAll({
    where: { id_categoria },
    include: [
      { model: Usuario, as: 'autor' },
      { model: Categoria, as: 'categoria' },
      {
        model: Tag,
        as: 'tags',
        where: { id_tag }
      }
    ]
  });
  if (options.raw) return posts;
  if (options.json) return options.json(posts);
  return posts;
};

// Listar postagens por tag
exports.listarPorTag = async (req, options = {}) => {
  const id_tag = options.id_tag || (req.query && req.query.tag);
  if (!id_tag) return [];
  const posts = await Postagem.findAll({
    include: [
      { model: Usuario, as: 'autor' },
      { model: Categoria, as: 'categoria' },
      {
        model: Tag,
        as: 'tags',
        where: { id_tag }
      }
    ]
  });
  if (options.raw) return posts;
  if (options.json) return options.json(posts);
  return posts;
};

