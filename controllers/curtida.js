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
      const { id_postagem, id_usuario } = req.body;
      // Validação dos campos obrigatórios
      if (!id_postagem || !id_usuario) {
        return res.status(400).json({ error: 'Preencha id_postagem e id_usuario.' });
      }
      // Verifica se já existe curtida
      const existente = await Curtida.findOne({
        where: { id_postagem, id_usuario }
      });
      if (existente) {
        return res.status(409).json({ error: 'Usuário já curtiu esta postagem.' });
      }
      const nova = await Curtida.create({
        id_postagem,
        id_usuario
      });
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
