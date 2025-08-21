const { Evento, Usuario, Categoria, ParticipanteEvento } = require('../models');

// Listar todos os eventos
exports.listar = async () => {
  try {
    const eventos = await Evento.findAll({
      include: [
        { model: Usuario, as: 'organizador' },
        { model: Categoria, as: 'categoria' },
        { model: ParticipanteEvento, as: 'participantes' }
      ]
    });
    return eventos;
  } catch (err) {
    throw new Error('Erro ao buscar eventos: ' + err.message);
  }
};

// Buscar evento por ID
exports.buscarPorId = async (id) => {
  try {
    const evento = await Evento.findByPk(id, {
      include: [
        { model: Usuario, as: 'organizador' },
        { model: Categoria, as: 'categoria' },
        { model: ParticipanteEvento, as: 'participantes' }
      ]
    });
    if (!evento) throw new Error('Evento não encontrado');
    return evento;
  } catch (err) {
    throw new Error('Erro ao buscar evento: ' + err.message);
  }
};

// Criar novo evento
exports.criar = async (dados) => {
  try {
    const novo = await Evento.create(dados);
    return novo;
  } catch (err) {
    throw new Error('Erro ao criar evento: ' + err.message);
  }
};

// Atualizar evento
exports.atualizar = async (id, dados) => {
  try {
    const [updated] = await Evento.update(dados, {
      where: { id_evento: id }
    });
    if (!updated) throw new Error('Evento não encontrado');
    const eventoAtualizado = await Evento.findByPk(id);
    return eventoAtualizado;
  } catch (err) {
    throw new Error('Erro ao atualizar evento: ' + err.message);
  }
};

// Remover evento
exports.remover = async (id) => {
  try {
    const deleted = await Evento.destroy({
      where: { id_evento: id }
    });
    if (!deleted) throw new Error('Evento não encontrado');
    return { message: 'Evento removido com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover evento: ' + err.message);
  }
};