const { ParticipanteEvento, Evento, Usuario } = require('../models');

// Listar todos os participantes de eventos
exports.listar = async () => {
  try {
    const participantes = await ParticipanteEvento.findAll({
      include: [
        { model: Evento, as: 'evento' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    return participantes;
  } catch (error) {
    throw new Error('Erro ao buscar participantes de eventos: ' + error.message);
  }
};

// Buscar participante de evento por ID
exports.buscarPorId = async (id) => {
  try {
    const participante = await ParticipanteEvento.findByPk(id, {
      include: [
        { model: Evento, as: 'evento' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!participante) throw new Error('Participante não encontrado');
    return participante;
  } catch (error) {
    throw new Error('Erro ao buscar participante de evento: ' + error.message);
  }
};

// Criar novo participante de evento
exports.criar = async (dados) => {
  try {
    const novoParticipante = await ParticipanteEvento.create(dados);
    return novoParticipante;
  } catch (error) {
    throw new Error('Erro ao criar participante de evento: ' + error.message);
  }
};

// Atualizar participante de evento
exports.atualizar = async (id, dados) => {
  try {
    const participante = await ParticipanteEvento.findByPk(id);
    if (!participante) throw new Error('Participante não encontrado');
    await participante.update(dados);
    return participante;
  } catch (error) {
    throw new Error('Erro ao atualizar participante de evento: ' + error.message);
  }
};

// Remover participante de evento
exports.remover = async (id) => {
  try {
    const participante = await ParticipanteEvento.findByPk(id);
    if (!participante) throw new Error('Participante não encontrado');
    await participante.destroy();
    return { mensagem: 'Participante removido com sucesso' };
  } catch (error) {
    throw new Error('Erro ao remover participante de evento: ' + error.message);
  }
};