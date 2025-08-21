const { Postagem, Usuario } = require('../models');

// Listar todas as postagens
exports.listar = async (req, res, modoView) => {
  try {
    const posts = await Postagem.findAll({
      include: [
        { model: Usuario, as: 'autor' } // Use o mesmo alias do model!
      ]
    });
    return posts; // Apenas retorna os dados!
  } catch (error) {
    // Em caso de erro, lance para ser tratado na rota
    throw error;
  }
};

// Buscar postagem por ID
exports.buscarPorId = async (req, res) => {
  try {
    const postagem = await Postagem.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'autor' }
      ]
    });
    if (!postagem) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }
    res.json(postagem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar nova postagem
exports.criar = async (req, res) => {
  try {
    const novaPostagem = await Postagem.create(req.body);
    res.status(201).json(novaPostagem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar postagem
exports.atualizar = async (req, res) => {
  try {
    const postagem = await Postagem.findByPk(req.params.id);
    if (!postagem) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }
    await postagem.update(req.body);
    res.json(postagem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover postagem
exports.remover = async (req, res) => {
  try {
    const postagem = await Postagem.findByPk(req.params.id);
    if (!postagem) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }
    await postagem.destroy();
    res.json({ mensagem: 'Postagem removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};