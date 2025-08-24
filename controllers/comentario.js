const { Comentario, Usuario, Postagem } = require('../models');

const comentarioController = {
  // Listar todos os comentários
  listar: async (req, res) => {
    try {
      const comentarios = await Comentario.findAll({
        include: [
          { model: Usuario, as: 'autor' },
          { model: Postagem, as: 'postagem' }
        ]
      });
      res.json(comentarios);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar comentários: ' + err.message });
    }
  },

  // Buscar comentário por ID
  buscarPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const comentario = await Comentario.findByPk(id, {
        include: [
          { model: Usuario, as: 'autor' },
          { model: Postagem, as: 'postagem' }
        ]
      });
      if (!comentario) return res.status(404).json({ error: 'Comentário não encontrado' });
      res.json(comentario);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar comentário: ' + err.message });
    }
  },

  // Criar novo comentário
  criar: async (req, res) => {
    try {
      const { id_postagem, id_autor, conteudo } = req.body;
      // Validação dos campos obrigatórios
      if (!id_postagem || !id_autor || !conteudo) {
        return res.status(400).json({ error: 'Preencha id_postagem, id_autor e conteudo.' });
      }
      const novo = await Comentario.create({
        id_postagem,
        id_autor,
        conteudo
      });
      res.status(201).json(novo);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar comentário: ' + err.message });
    }
  },

  // Atualizar comentário
  atualizar: async (req, res) => {
    try {
      const id = req.params.id;
      const [updated] = await Comentario.update(req.body, {
        where: { id_comentario: id }
      });
      if (!updated) return res.status(404).json({ error: 'Comentário não encontrado' });
      const comentarioAtualizado = await Comentario.findByPk(id);
      res.json(comentarioAtualizado);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar comentário: ' + err.message });
    }
  },

  // Remover comentário
  remover: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await Comentario.destroy({
        where: { id_comentario: id }
      });
      if (!deleted) return res.status(404).json({ error: 'Comentário não encontrado' });
      res.json({ message: 'Comentário removido com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover comentário: ' + err.message });
    }
  }
};

module.exports = comentarioController;
