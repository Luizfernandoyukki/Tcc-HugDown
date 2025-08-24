const { Amizade, Usuario } = require('../models');

const amizadeController = {
  listar: async (req, res) => {
    try {
      const amizades = await Amizade.findAll({
        include: [
          { model: Usuario, as: 'solicitante' },
          { model: Usuario, as: 'destinatario' }
        ]
      });
      res.json(amizades);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar amizades: ' + err.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const amizade = await Amizade.findByPk(id, {
        include: [
          { model: Usuario, as: 'solicitante' },
          { model: Usuario, as: 'destinatario' }
        ]
      });
      if (!amizade) return res.status(404).json({ error: 'Amizade não encontrada' });
      res.json(amizade);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar amizade: ' + err.message });
    }
  },

  criar: async (req, res) => {
    try {
      const { id_solicitante, id_destinatario, status_amizade } = req.body;
      // Validação dos campos obrigatórios
      if (!id_solicitante || !id_destinatario) {
        return res.status(400).json({ error: 'Preencha id_solicitante e id_destinatario.' });
      }
      // Cria a amizade
      const nova = await Amizade.create({
        id_solicitante,
        id_destinatario,
        status_amizade: status_amizade || 'pending'
      });
      res.status(201).json(nova);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar amizade: ' + err.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const id = req.params.id;
      const [updated] = await Amizade.update(req.body, {
        where: { id_amizade: id }
      });
      if (!updated) return res.status(404).json({ error: 'Amizade não encontrada' });
      const amizadeAtualizada = await Amizade.findByPk(id);
      res.json(amizadeAtualizada);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar amizade: ' + err.message });
    }
  },

  remover: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await Amizade.destroy({
        where: { id_amizade: id }
      });
      if (!deleted) return res.status(404).json({ error: 'Amizade não encontrada' });
      res.json({ message: 'Amizade removida com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover amizade: ' + err.message });
    }
  }
};

module.exports = amizadeController;
