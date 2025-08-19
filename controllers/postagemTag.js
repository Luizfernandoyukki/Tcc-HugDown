const { PostagemTag, Postagem, Tag } = require('../models');

// Listar todas as tags de postagens
exports.listar = async (req, res) => {
  try {
    const postagemTags = await PostagemTag.findAll({
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Tag, as: 'tag' }
      ]
    });
    res.json(postagemTags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar tag de postagem por ID
exports.buscarPorId = async (req, res) => {
  try {
    const postagemTag = await PostagemTag.findByPk(req.params.id, {
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Tag, as: 'tag' }
      ]
    });
    if (!postagemTag) {
      return res.status(404).json({ error: 'Tag de postagem não encontrada' });
    }
    res.json(postagemTag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar nova tag de postagem
exports.criar = async (req, res) => {
  try {
    const novaPostagemTag = await PostagemTag.create(req.body);
    res.status(201).json(novaPostagemTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar tag de postagem
exports.atualizar = async (req, res) => {
  try {
    const postagemTag = await PostagemTag.findByPk(req.params.id);
    if (!postagemTag) {
      return res.status(404).json({ error: 'Tag de postagem não encontrada' });
    }
    await postagemTag.update(req.body);
    res.json(postagemTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover tag de postagem
exports.remover = async (req, res) => {
  try {
    const postagemTag = await PostagemTag.findByPk(req.params.id);
    if (!postagemTag) {
      return res.status(404).json({ error: 'Tag de postagem não encontrada' });
    }
    await postagemTag.destroy();
    res.json({ mensagem: 'Tag de postagem removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};