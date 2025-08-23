const { Evento, Usuario, Categoria, ParticipanteEvento } = require('../models');

const eventoController = {
  // Listar todos os eventos
  listar: async (req, res) => {
    try {
      const eventos = await Evento.findAll({
        include: [
          { model: Usuario, as: 'organizador' },
          { model: Categoria, as: 'categoria' },
          { model: ParticipanteEvento, as: 'participantes' }
        ]
      });
      res.json(eventos);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar eventos: ' + err.message });
    }
  },

  // Buscar evento por ID
  buscarPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const evento = await Evento.findByPk(id, {
        include: [
          { model: Usuario, as: 'organizador' },
          { model: Categoria, as: 'categoria' },
          { model: ParticipanteEvento, as: 'participantes' }
        ]
      });
      if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
      res.json(evento);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar evento: ' + err.message });
    }
  },

  // Criar novo evento
  criar: async (req, res) => {
    try {
      const novo = await Evento.create(req.body);
      res.status(201).json(novo);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar evento: ' + err.message });
    }
  },

  // Atualizar evento
  atualizar: async (req, res) => {
    try {
      const id = req.params.id;
      const [updated] = await Evento.update(req.body, {
        where: { id_evento: id }
      });
      if (!updated) return res.status(404).json({ error: 'Evento não encontrado' });
      const eventoAtualizado = await Evento.findByPk(id, {
        include: [
          { model: Usuario, as: 'organizador' },
          { model: Categoria, as: 'categoria' },
          { model: ParticipanteEvento, as: 'participantes' }
        ]
      });
      res.json(eventoAtualizado);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar evento: ' + err.message });
    }
  },

  // Remover evento
  remover: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await Evento.destroy({
        where: { id_evento: id }
      });
      if (!deleted) return res.status(404).json({ error: 'Evento não encontrado' });
      res.json({ message: 'Evento removido com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover evento: ' + err.message });
    }
  }
};

module.exports = eventoController;
