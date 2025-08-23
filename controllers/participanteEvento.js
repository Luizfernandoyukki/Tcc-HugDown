const { ParticipanteEvento, Evento, Usuario } = require('../models');

// Listar todos os participantes de eventos
exports.listar = async (req, res) => {
  try {
    const participantes = await ParticipanteEvento.findAll({
      include: [
        { model: Evento, as: 'evento' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    res.json(participantes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar participantes de eventos: ' + error.message });
  }
};

// Buscar participante de evento por ID
exports.buscarPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const participante = await ParticipanteEvento.findByPk(id, {
      include: [
        { model: Evento, as: 'evento' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!participante) return res.status(404).json({ error: 'Participante não encontrado' });
    res.json(participante);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar participante de evento: ' + error.message });
  }
};

// Criar novo participante de evento
exports.criar = async (req, res) => {
  try {
    const novoParticipante = await ParticipanteEvento.create(req.body);
    res.status(201).json(novoParticipante);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar participante de evento: ' + error.message });
  }
};

// Atualizar participante de evento
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const participante = await ParticipanteEvento.findByPk(id, {
      include: [
        { model: Evento, as: 'evento' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!participante) return res.status(404).json({ error: 'Participante não encontrado' });
    await participante.update(req.body);
    res.json(participante);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar participante de evento: ' + error.message });
  }
};

// Remover participante de evento
exports.remover = async (req, res) => {
  try {
    const id = req.params.id;
    const participante = await ParticipanteEvento.findByPk(id);
    if (!participante) return res.status(404).json({ error: 'Participante não encontrado' });
    await participante.destroy();
    res.json({ message: 'Participante removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover participante de evento: ' + error.message });
  }
};
