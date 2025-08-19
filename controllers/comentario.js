const { Comentario, Postagem, Usuario } = require('../models');

// Listar todos os comentários
exports.listar = async (req, res) => {
  try {
    const comentarios = await Comentario.findAll({
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Usuario, as: 'autor' }
      ]
    });
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar comentários', details: err.message });
  }
};

// Buscar comentário por ID
exports.buscarPorId = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id, {
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Usuario, as: 'autor' }
      ]
    });
    if (!comentario) return res.status(404).json({ error: 'Comentário não encontrado' });
    res.json(comentario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar comentário', details: err.message });
  }
};

// Criar novo comentário
exports.criar = async (req, res) => {
  try {
    const novo = await Comentario.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar comentário', details: err.message });
  }
};

// Atualizar comentário
exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Comentario.update(req.body, {
      where: { id_comentario: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Comentário não encontrado' });
    const comentarioAtualizado = await Comentario.findByPk(req.params.id);
    res.json(comentarioAtualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar comentário', details: err.message });
  }
};

// Remover comentário
exports.remover = async (req, res) => {
  try {
    const deleted = await Comentario.destroy({
      where: { id_comentario: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Comentário não encontrado' });
    res.json({ message: 'Comentário removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover comentário', details: err.message });
    }
};