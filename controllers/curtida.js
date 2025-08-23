const { Curtida, Postagem, Usuario } = require('../models');

const curtidaController = {
  // Listar todas as curtidas
  listar: async (req, res) => {
    try {
      const curtidas = await Curtida.findAll({
        include: [
          { model: Postagem, as: 'postagem' },
          { model: Usuario, as: 'usuario' }
        ]
      });
      res.json(curtidas);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar curtidas: ' + err.message });
    }
  },

  // Buscar curtida por ID
  buscarPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const curtida = await Curtida.findByPk(id, {
        include: [
          { model: Postagem, as: 'postagem' },
          { model: Usuario, as: 'usuario' }
        ]
      });
      if (!curtida) return res.status(404).json({ error: 'Curtida não encontrada' });
      res.json(curtida);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar curtida: ' + err.message });
    }
  },

  // Criar nova curtida
  criar: async (req, res) => {
    try {
      const nova = await Curtida.create(req.body);
      res.status(201).json(nova);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar curtida: ' + err.message });
    }
  },

  // Remover curtida
  remover: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await Curtida.destroy({
        where: { id_curtida: id }
      });
      if (!deleted) return res.status(404).json({ error: 'Curtida não encontrada' });
      res.json({ message: 'Curtida removida com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover curtida: ' + err.message });
    }
  }
};

module.exports = curtidaController;
