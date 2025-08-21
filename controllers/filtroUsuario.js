const { FiltroUsuario, Usuario } = require('../models');

// Listar todos os filtros de usuário
exports.listar = async () => {
  try {
    const filtros = await FiltroUsuario.findAll({
      include: [
        { model: Usuario, as: 'usuario' }
      ]
    });
    return filtros;
  } catch (err) {
    throw new Error('Erro ao buscar filtros de usuário: ' + err.message);
  }
};

// Buscar filtro por ID
exports.buscarPorId = async (id) => {
  try {
    const filtro = await FiltroUsuario.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!filtro) throw new Error('Filtro não encontrado');
    return filtro;
  } catch (err) {
    throw new Error('Erro ao buscar filtro: ' + err.message);
  }
};

// Criar novo filtro de usuário
exports.criar = async (dados) => {
  try {
    const novo = await FiltroUsuario.create(dados);
    return novo;
  } catch (err) {
    throw new Error('Erro ao criar filtro: ' + err.message);
  }
};

// Atualizar filtro de usuário
exports.atualizar = async (id, dados) => {
  try {
    const [updated] = await FiltroUsuario.update(dados, {
      where: { id_filtro: id }
    });
    if (!updated) throw new Error('Filtro não encontrado');
    const filtroAtualizado = await FiltroUsuario.findByPk(id);
    return filtroAtualizado;
  } catch (err) {
    throw new Error('Erro ao atualizar filtro: ' + err.message);
  }
};

// Remover filtro de usuário
exports.remover = async (id) => {
  try {
    const deleted = await FiltroUsuario.destroy({
      where: { id_filtro: id }
    });
    if (!deleted) throw new Error('Filtro não encontrado');
    return { message: 'Filtro removido com sucesso' };
  } catch (err) {
    throw new Error('Erro ao remover filtro: ' + err.message);
  }
};