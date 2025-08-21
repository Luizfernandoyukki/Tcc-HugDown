const { Amizade, Usuario } = require('../models');

// Listar todas as amizades
exports.listar = async () => {
  try {
    const amizades = await Amizade.findAll({
      include: [
        { model: Usuario, as: 'solicitante' },
        { model: Usuario, as: 'destinatario' }
      ]
    });
    return amizades;
  } catch (err) {
    throw new Error('Erro ao buscar amizades: ' + err.message);
  }
};

// Buscar amizade por ID
exports.buscarPorId = async (id) => {
  try {
    const amizade = await Amizade.findByPk(id, {
      include: [
        { model: Usuario, as: 'solicitante' },
        { model: Usuario, as: 'destinatario' }
      ]
    });
    if (!amizade) throw new Error('Amizade não encontrada');
    return amizade;
  } catch (err) {
    throw new Error('Erro ao buscar amizade: ' + err.message);
  }
};

// Criar nova amizade
exports.criar = async (dados) => {
  try {
    const nova = await Amizade.create(dados);
    return nova;
  } catch (err) {
    throw new Error('Erro ao criar amizade: ' + err.message);
  }
};

// Atualizar amizade
exports.atualizar = async (id, dados) => {
  try {
    const [updated] = await Amizade.update(dados, {
      where: { id_amizade: id }
    });
    if (!updated) throw new Error('Amizade não encontrada');
    const amizadeAtualizada = await Amizade.findByPk(id);
    return amizadeAtualizada;
  } catch (err) {
    throw new Error('Erro ao atualizar amizade: ' + err.message);
  }
};

// Remover amizade
exports.remover = async (id) => {
  try {
    const deleted = await Amizade.destroy({
      where: { id_amizade: id }
    });
    if (!deleted) throw new Error('Amizade não encontrada');
    return { message: 'Amizade removida com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover amizade: ' + err.message);
  }
};