const { Comentario, Postagem, Usuario } = require('../models');

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
    res.status(500).json({ error: 'Erro ao buscar comentários: ' + err.message });
  }
};

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
    res.status(500).json({ error: 'Erro ao buscar comentário: ' + err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novoComentario = await Comentario.create(req.body);
    res.status(201).json(novoComentario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar comentário: ' + err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id);
    if (!comentario) return res.status(404).json({ error: 'Comentário não encontrado' });
    await comentario.update(req.body);
    res.json(comentario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar comentário: ' + err.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id);
    if (!comentario) return res.status(404).json({ error: 'Comentário não encontrado' });
    await comentario.destroy();
    res.json({ mensagem: 'Comentário removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover comentário: ' + err.message });
  }
};
